import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import config from '@/utils/config';
import logger from '@/utils/logger';

export interface ScrapedData {
  url: string;
  title?: string;
  description?: string;
  content: Record<string, any>;
  metadata: {
    scrapedAt: string;
    userAgent: string;
    responseTime: number;
    statusCode: number;
  };
}

export interface ScraperOptions {
  timeout?: number;
  delay?: number;
  userAgent?: string;
  headers?: Record<string, string>;
  retries?: number;
}

export abstract class BaseScraper {
  protected client: AxiosInstance;
  protected options: Required<ScraperOptions>;

  constructor(options: ScraperOptions = {}) {
    this.options = {
      timeout: options.timeout || config.scraperTimeoutMs,
      delay: options.delay || config.scraperDelayMs,
      userAgent: options.userAgent || config.scraperUserAgent,
      headers: options.headers || {},
      retries: options.retries || 3,
    };

    this.client = axios.create({
      timeout: this.options.timeout,
      headers: {
        'User-Agent': this.options.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        ...this.options.headers,
      },
    });

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.debug('Scraper request successful', {
          url: response.config.url,
          status: response.status,
          responseTime: response.headers['x-response-time'],
        });
        return response;
      },
      (error) => {
        logger.warn('Scraper request failed', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Scrape a single URL
   */
  async scrape(url: string): Promise<ScrapedData> {
    const startTime = Date.now();
    
    try {
      logger.info('Starting scrape', { url });

      // Add delay between requests
      if (this.options.delay > 0) {
        await this.delay(this.options.delay);
      }

      const response = await this.client.get(url);
      const responseTime = Date.now() - startTime;

      const $ = cheerio.load(response.data);
      
      // Extract basic metadata
      const title = $('title').text().trim() || 
                   $('meta[property="og:title"]').attr('content') ||
                   $('h1').first().text().trim();

      const description = $('meta[name="description"]').attr('content') ||
                         $('meta[property="og:description"]').attr('content') ||
                         $('meta[name="twitter:description"]').attr('content');

      // Call abstract method to extract specific content
      const content = await this.extractContent($, url);

      const scrapedData: ScrapedData = {
        url,
        title,
        description,
        content,
        metadata: {
          scrapedAt: new Date().toISOString(),
          userAgent: this.options.userAgent,
          responseTime,
          statusCode: response.status,
        },
      };

      logger.info('Scrape completed successfully', {
        url,
        responseTime,
        contentKeys: Object.keys(content),
      });

      return scrapedData;
    } catch (error) {
      logger.error('Scrape failed', { url, error });
      throw error;
    }
  }

  /**
   * Scrape multiple URLs with rate limiting
   */
  async scrapeMultiple(urls: string[]): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    const errors: Array<{ url: string; error: string }> = [];

    logger.info('Starting batch scrape', { urlCount: urls.length });

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      try {
        const result = await this.scrapeWithRetry(url);
        results.push(result);
        
        logger.debug(`Scraped ${i + 1}/${urls.length}: ${url}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ url, error: errorMessage });
        
        logger.warn(`Failed to scrape ${i + 1}/${urls.length}: ${url}`, { error: errorMessage });
      }

      // Add delay between requests (except for the last one)
      if (i < urls.length - 1 && this.options.delay > 0) {
        await this.delay(this.options.delay);
      }
    }

    logger.info('Batch scrape completed', {
      total: urls.length,
      successful: results.length,
      failed: errors.length,
    });

    return results;
  }

  /**
   * Scrape with retry logic
   */
  private async scrapeWithRetry(url: string): Promise<ScrapedData> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.options.retries; attempt++) {
      try {
        return await this.scrape(url);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.options.retries) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          logger.debug(`Retry attempt ${attempt} for ${url} in ${backoffDelay}ms`);
          await this.delay(backoffDelay);
        }
      }
    }

    throw lastError!;
  }

  /**
   * Abstract method to extract content from the page
   * Must be implemented by concrete scraper classes
   */
  protected abstract extractContent(
    $: cheerio.CheerioAPI, 
    url: string
  ): Promise<Record<string, any>>;

  /**
   * Utility method to add delay
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Utility method to clean text content
   */
  protected cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
  }

  /**
   * Utility method to extract all links from a page
   */
  protected extractLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
    const links: string[] = [];
    
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, baseUrl).toString();
          links.push(absoluteUrl);
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    return [...new Set(links)]; // Remove duplicates
  }

  /**
   * Utility method to extract images
   */
  protected extractImages($: cheerio.CheerioAPI, baseUrl: string): Array<{ src: string; alt?: string }> {
    const images: Array<{ src: string; alt?: string }> = [];
    
    $('img[src]').each((_, element) => {
      const src = $(element).attr('src');
      const alt = $(element).attr('alt');
      
      if (src) {
        try {
          const absoluteUrl = new URL(src, baseUrl).toString();
          images.push({ src: absoluteUrl, alt });
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    return images;
  }

  /**
   * Utility method to extract structured data (JSON-LD, microdata, etc.)
   */
  protected extractStructuredData($: cheerio.CheerioAPI): any[] {
    const structuredData: any[] = [];

    // Extract JSON-LD
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const data = JSON.parse($(element).html() || '');
        structuredData.push(data);
      } catch (error) {
        // Invalid JSON, skip
      }
    });

    return structuredData;
  }
}

/**
 * Generic web scraper for basic content extraction
 */
export class GenericScraper extends BaseScraper {
  protected async extractContent($: cheerio.CheerioAPI, url: string): Promise<Record<string, any>> {
    return {
      headings: {
        h1: $('h1').map((_, el) => this.cleanText($(el).text())).get(),
        h2: $('h2').map((_, el) => this.cleanText($(el).text())).get(),
        h3: $('h3').map((_, el) => this.cleanText($(el).text())).get(),
      },
      paragraphs: $('p').map((_, el) => this.cleanText($(el).text())).get()
        .filter(text => text.length > 20), // Filter out short paragraphs
      links: this.extractLinks($, url),
      images: this.extractImages($, url),
      structuredData: this.extractStructuredData($),
      metadata: {
        lang: $('html').attr('lang'),
        charset: $('meta[charset]').attr('charset'),
        viewport: $('meta[name="viewport"]').attr('content'),
      },
    };
  }
}

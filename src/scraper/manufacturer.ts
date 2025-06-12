import { BaseScraper } from './base-scraper';
import * as cheerio from 'cheerio';
import logger from '@/utils/logger';

export interface ProductData {
  name: string;
  model?: string;
  sku?: string;
  price?: {
    amount: number;
    currency: string;
    formatted: string;
  };
  description?: string;
  specifications?: Record<string, string>;
  images?: Array<{ src: string; alt?: string }>;
  availability?: string;
  category?: string;
  brand?: string;
  features?: string[];
  documents?: Array<{ name: string; url: string; type: string }>;
}

/**
 * Manufacturer-specific scraper for product data
 */
export class ManufacturerScraper extends BaseScraper {
  constructor(_manufacturerConfig: Record<string, any> = {}) {
    super();
  }

  protected async extractContent($: cheerio.CheerioAPI, url: string): Promise<Record<string, any>> {
    const hostname = new URL(url).hostname;
    
    // Try to detect manufacturer and use specific extraction logic
    const manufacturer = this.detectManufacturer(hostname);
    
    if (manufacturer) {
      const extractMethod = (this as any)[`extract${manufacturer}Data`];
      if (typeof extractMethod === 'function') {
        logger.debug(`Using ${manufacturer}-specific extraction for ${url}`);
        return await extractMethod.call(this, $, url);
      }
    }

    // Fall back to generic product extraction
    logger.debug(`Using generic product extraction for ${url}`);
    return await this.extractGenericProductData($, url);
  }

  /**
   * Detect manufacturer from hostname
   */
  private detectManufacturer(hostname: string): string | null {
    const manufacturers = {
      'apple.com': 'Apple',
      'samsung.com': 'Samsung',
      'lg.com': 'LG',
      'sony.com': 'Sony',
      'dell.com': 'Dell',
      'hp.com': 'HP',
      'lenovo.com': 'Lenovo',
      'microsoft.com': 'Microsoft',
      'google.com': 'Google',
      'amazon.com': 'Amazon',
    };

    for (const [domain, manufacturer] of Object.entries(manufacturers)) {
      if (hostname.includes(domain)) {
        return manufacturer;
      }
    }

    return null;
  }

  /**
   * Generic product data extraction
   */
  private async extractGenericProductData($: cheerio.CheerioAPI, url: string): Promise<ProductData> {
    const product: ProductData = {
      name: this.extractProductName($),
    };

    // Extract basic product information
    product.model = this.extractModel($);
    product.sku = this.extractSKU($);
    product.price = this.extractPrice($);
    product.description = this.extractDescription($);
    product.specifications = this.extractSpecifications($);
    product.images = this.extractImages($, url);
    product.availability = this.extractAvailability($);
    product.category = this.extractCategory($);
    product.brand = this.extractBrand($);
    product.features = this.extractFeatures($);
    product.documents = this.extractDocuments($, url);

    return product;
  }

  /**
   * Extract product name
   */
  private extractProductName($: cheerio.CheerioAPI): string {
    const selectors = [
      'h1.product-title',
      'h1.product-name',
      '.product-title h1',
      '.product-name h1',
      'h1[data-testid*="product"]',
      'h1[class*="product"]',
      'h1',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        return this.cleanText(element.text());
      }
    }

    // Fallback to page title
    const title = $('title').text();
    return this.cleanText(title.split('|')[0].split('-')[0]);
  }

  /**
   * Extract product model
   */
  private extractModel($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '[data-testid*="model"]',
      '.model',
      '.product-model',
      '[class*="model"]',
    ];

    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text) {
        return this.cleanText(text);
      }
    }

    return undefined;
  }

  /**
   * Extract SKU
   */
  private extractSKU($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '[data-testid*="sku"]',
      '.sku',
      '.product-sku',
      '[class*="sku"]',
      '[data-sku]',
    ];

    for (const selector of selectors) {
      const element = $(selector);
      const text = element.text().trim() || element.attr('data-sku');
      if (text) {
        return this.cleanText(text);
      }
    }

    return undefined;
  }

  /**
   * Extract price information
   */
  private extractPrice($: cheerio.CheerioAPI): ProductData['price'] | undefined {
    const priceSelectors = [
      '.price',
      '.product-price',
      '[data-testid*="price"]',
      '[class*="price"]',
      '.cost',
      '.amount',
    ];

    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        const priceMatch = priceText.match(/[\$€£¥]?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        if (priceMatch) {
          const amount = parseFloat(priceMatch[1].replace(/,/g, ''));
          const currency = this.detectCurrency(priceText);
          
          return {
            amount,
            currency,
            formatted: this.cleanText(priceText),
          };
        }
      }
    }

    return undefined;
  }

  /**
   * Detect currency from price text
   */
  private detectCurrency(priceText: string): string {
    if (priceText.includes('$')) return 'USD';
    if (priceText.includes('€')) return 'EUR';
    if (priceText.includes('£')) return 'GBP';
    if (priceText.includes('¥')) return 'JPY';
    return 'USD'; // Default
  }

  /**
   * Extract product description
   */
  private extractDescription($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '.product-description',
      '.description',
      '[data-testid*="description"]',
      '.product-details .description',
      '.overview',
    ];

    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text && text.length > 50) {
        return this.cleanText(text);
      }
    }

    return undefined;
  }

  /**
   * Extract product specifications
   */
  private extractSpecifications($: cheerio.CheerioAPI): Record<string, string> {
    const specs: Record<string, string> = {};

    // Look for specification tables
    $('.specifications table tr, .specs table tr, .product-specs table tr').each((_: number, row: any) => {
      const cells = $(row).find('td, th');
      if (cells.length >= 2) {
        const key = this.cleanText($(cells[0]).text());
        const value = this.cleanText($(cells[1]).text());
        if (key && value) {
          specs[key] = value;
        }
      }
    });

    // Look for specification lists
    $('.specifications dl dt, .specs dl dt').each((_: number, dt: any) => {
      const key = this.cleanText($(dt).text());
      const value = this.cleanText($(dt).next('dd').text());
      if (key && value) {
        specs[key] = value;
      }
    });

    return specs;
  }

  /**
   * Extract availability information
   */
  private extractAvailability($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '.availability',
      '.stock-status',
      '[data-testid*="availability"]',
      '[data-testid*="stock"]',
      '.in-stock',
      '.out-of-stock',
    ];

    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text) {
        return this.cleanText(text);
      }
    }

    return undefined;
  }

  /**
   * Extract product category
   */
  private extractCategory($: cheerio.CheerioAPI): string | undefined {
    // Look for breadcrumbs
    const breadcrumbs = $('.breadcrumb a, .breadcrumbs a, nav[aria-label="breadcrumb"] a')
      .map((_: number, el: any) => this.cleanText($(el).text()))
      .get()
      .filter((text: string) => text && text.toLowerCase() !== 'home');

    if (breadcrumbs.length > 0) {
      return breadcrumbs[breadcrumbs.length - 1];
    }

    return undefined;
  }

  /**
   * Extract brand information
   */
  private extractBrand($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      '.brand',
      '.manufacturer',
      '[data-testid*="brand"]',
      '.product-brand',
    ];

    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text) {
        return this.cleanText(text);
      }
    }

    return undefined;
  }

  /**
   * Extract product features
   */
  private extractFeatures($: cheerio.CheerioAPI): string[] {
    const features: string[] = [];

    // Look for feature lists
    $('.features li, .product-features li, .highlights li').each((_: number, li: any) => {
      const feature = this.cleanText($(li).text());
      if (feature && feature.length > 5) {
        features.push(feature);
      }
    });

    return features;
  }

  /**
   * Extract product documents (manuals, datasheets, etc.)
   */
  private extractDocuments($: cheerio.CheerioAPI, baseUrl: string): Array<{ name: string; url: string; type: string }> {
    const documents: Array<{ name: string; url: string; type: string }> = [];

    $('.downloads a, .documents a, .manuals a').each((_: number, link: any) => {
      const href = $(link).attr('href');
      const name = this.cleanText($(link).text());
      
      if (href && name) {
        try {
          const url = new URL(href, baseUrl).toString();
          const type = this.getDocumentType(href);
          documents.push({ name, url, type });
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    return documents;
  }

  /**
   * Determine document type from URL
   */
  private getDocumentType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'xls':
      case 'xlsx': return 'Excel Spreadsheet';
      case 'ppt':
      case 'pptx': return 'PowerPoint Presentation';
      case 'zip':
      case 'rar': return 'Archive';
      default: return 'Document';
    }
  }

  /**
   * Map scraped data to Builder.io content format
   */
  mapToBuilderContent(productData: ProductData, _modelId: string): any {
    return {
      name: productData.name,
      data: {
        title: productData.name,
        model: productData.model,
        sku: productData.sku,
        price: productData.price,
        description: productData.description,
        specifications: productData.specifications,
        images: productData.images,
        availability: productData.availability,
        category: productData.category,
        brand: productData.brand,
        features: productData.features,
        documents: productData.documents,
        lastUpdated: new Date().toISOString(),
      },
      published: 'draft',
      meta: {
        title: productData.name,
        description: productData.description?.substring(0, 160),
      },
    };
  }
}

// Export singleton instance
export const manufacturerScraper = new ManufacturerScraper();

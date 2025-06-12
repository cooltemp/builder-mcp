import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from '@/utils/config';
import logger, { logBuilderApiCall } from '@/utils/logger';
import {
  BuilderContent,
  BuilderApiResponse,
  BuilderApiError,
  CreateContentRequest,
  UpdateContentRequest,
  GetContentOptions
} from './types';

export class BuilderContentApi {
  private client: AxiosInstance;
  private readonly baseUrl = 'https://cdn.builder.io/api/v2';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.builderPrivateApiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('Builder Content API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
        });
        return config;
      },
      (error) => {
        logger.error('Builder Content API Request Error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logBuilderApiCall(
          response.config.url || '',
          response.config.method?.toUpperCase() || '',
          true,
          response.headers['x-response-time'] ? parseInt(response.headers['x-response-time']) : undefined
        );
        return response;
      },
      (error) => {
        const endpoint = error.config?.url || '';
        const method = error.config?.method?.toUpperCase() || '';
        
        logBuilderApiCall(endpoint, method, false);
        
        if (error.response) {
          logger.error('Builder Content API Response Error', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            endpoint,
            method,
          });
        } else if (error.request) {
          logger.error('Builder Content API Network Error', {
            message: error.message,
            endpoint,
            method,
          });
        }
        
        return Promise.reject(this.transformError(error));
      }
    );
  }

  /**
   * Get content entries for a specific model
   */
  async getContent(modelId: string, options: GetContentOptions = {}): Promise<BuilderContent[]> {
    try {
      const params: any = {
        apiKey: config.builderPublicApiKey,
        limit: options.limit || 100,
        offset: options.offset || 0,
      };

      if (options.published) {
        params.published = options.published;
      }

      if (options.sortBy) {
        params.sortBy = options.sortBy;
        params.sortOrder = options.sortOrder || 'desc';
      }

      if (options.query) {
        params.query = JSON.stringify(options.query);
      }

      const response: AxiosResponse<BuilderApiResponse<BuilderContent>> = await this.client.get(
        `/content/${modelId}`,
        { params }
      );

      return response.data.results;
    } catch (error) {
      logger.error(`Failed to fetch content for model ${modelId}`, error);
      throw error;
    }
  }

  /**
   * Get a specific content entry by ID
   */
  async getContentById(modelId: string, contentId: string): Promise<BuilderContent> {
    try {
      const params = {
        apiKey: config.builderPublicApiKey,
      };

      const response: AxiosResponse<BuilderContent> = await this.client.get(
        `/content/${modelId}/${contentId}`,
        { params }
      );

      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch content ${contentId} for model ${modelId}`, error);
      throw error;
    }
  }

  /**
   * Create new content entry
   */
  async createContent(modelId: string, content: CreateContentRequest): Promise<BuilderContent> {
    try {
      const response: AxiosResponse<BuilderContent> = await this.client.post(
        `/content/${modelId}`,
        {
          ...content,
          apiKey: config.builderPublicApiKey,
        }
      );

      logger.info(`Created new content entry: ${content.name}`, { 
        modelId, 
        contentId: response.data.id 
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to create content for model ${modelId}`, error);
      throw error;
    }
  }

  /**
   * Update existing content entry
   */
  async updateContent(
    modelId: string, 
    contentId: string, 
    updates: UpdateContentRequest
  ): Promise<BuilderContent> {
    try {
      const response: AxiosResponse<BuilderContent> = await this.client.put(
        `/content/${modelId}/${contentId}`,
        {
          ...updates,
          apiKey: config.builderPublicApiKey,
        }
      );

      logger.info(`Updated content entry: ${contentId}`, { modelId, updates });
      return response.data;
    } catch (error) {
      logger.error(`Failed to update content ${contentId} for model ${modelId}`, error);
      throw error;
    }
  }

  /**
   * Delete content entry
   */
  async deleteContent(modelId: string, contentId: string): Promise<void> {
    try {
      await this.client.delete(`/content/${modelId}/${contentId}`, {
        params: {
          apiKey: config.builderPublicApiKey,
        }
      });

      logger.info(`Deleted content entry: ${contentId}`, { modelId });
    } catch (error) {
      logger.error(`Failed to delete content ${contentId} for model ${modelId}`, error);
      throw error;
    }
  }

  /**
   * Publish content entry
   */
  async publishContent(modelId: string, contentId: string): Promise<BuilderContent> {
    return this.updateContent(modelId, contentId, { published: 'published' });
  }

  /**
   * Unpublish content entry
   */
  async unpublishContent(modelId: string, contentId: string): Promise<BuilderContent> {
    return this.updateContent(modelId, contentId, { published: 'draft' });
  }

  /**
   * Transform axios errors into our custom error format
   */
  private transformError(error: any): BuilderApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || error.response.statusText || 'Unknown API error',
        code: error.response.status.toString(),
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message: 'Network error - unable to reach Builder.io API',
        code: 'NETWORK_ERROR',
        details: error.message,
      };
    } else {
      return {
        message: error.message || 'Unknown error',
        code: 'UNKNOWN_ERROR',
        details: error,
      };
    }
  }
}

// Export singleton instance
export const builderContentApi = new BuilderContentApi();

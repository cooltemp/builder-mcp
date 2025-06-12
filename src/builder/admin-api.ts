import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from '@/utils/config';
import logger, { logBuilderApiCall } from '@/utils/logger';
import {
  BuilderModel,
  BuilderApiResponse,
  BuilderApiError,
  GetModelsOptions
} from './types';

export class BuilderAdminApi {
  private client: AxiosInstance;
  private readonly baseUrl = 'https://builder.io/api/v1';

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
        logger.debug('Builder Admin API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
        });
        return config;
      },
      (error) => {
        logger.error('Builder Admin API Request Error', error);
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
          logger.error('Builder Admin API Response Error', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            endpoint,
            method,
          });
        } else if (error.request) {
          logger.error('Builder Admin API Network Error', {
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
   * Get all models from Builder.io
   */
  async getModels(options: GetModelsOptions = {}): Promise<BuilderModel[]> {
    try {
      const params = {
        limit: options.limit || 100,
        offset: options.offset || 0,
        includeFields: options.includeFields !== false, // Default to true
      };

      const response: AxiosResponse<BuilderApiResponse<BuilderModel>> = await this.client.get(
        '/models',
        { params }
      );

      return response.data.results;
    } catch (error) {
      logger.error('Failed to fetch models from Builder.io', error);
      throw error;
    }
  }

  /**
   * Get a specific model by ID
   */
  async getModel(modelId: string): Promise<BuilderModel> {
    try {
      const response: AxiosResponse<BuilderModel> = await this.client.get(
        `/models/${modelId}`
      );

      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch model ${modelId} from Builder.io`, error);
      throw error;
    }
  }

  /**
   * Create a new model
   */
  async createModel(model: Partial<BuilderModel>): Promise<BuilderModel> {
    try {
      const response: AxiosResponse<BuilderModel> = await this.client.post(
        '/models',
        model
      );

      logger.info(`Created new model: ${model.name}`, { modelId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error(`Failed to create model: ${model.name}`, error);
      throw error;
    }
  }

  /**
   * Update an existing model
   */
  async updateModel(modelId: string, updates: Partial<BuilderModel>): Promise<BuilderModel> {
    try {
      const response: AxiosResponse<BuilderModel> = await this.client.put(
        `/models/${modelId}`,
        updates
      );

      logger.info(`Updated model: ${modelId}`, updates);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update model: ${modelId}`, error);
      throw error;
    }
  }

  /**
   * Delete a model
   */
  async deleteModel(modelId: string): Promise<void> {
    try {
      await this.client.delete(`/models/${modelId}`);
      logger.info(`Deleted model: ${modelId}`);
    } catch (error) {
      logger.error(`Failed to delete model: ${modelId}`, error);
      throw error;
    }
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
export const builderAdminApi = new BuilderAdminApi();

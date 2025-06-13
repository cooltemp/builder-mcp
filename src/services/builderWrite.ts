// Builder.io Write API client for creating and updating content

import axios, { AxiosResponse } from 'axios';
import { BuilderConfig, BuilderContent, ApiResponse } from '@/types';
import { Logger } from '@/utils/logger';

export class BuilderWriteService {
  private config: BuilderConfig;
  private baseUrl = 'https://builder.io/api/v1/write';

  constructor(config: BuilderConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.privateKey}`,
      'Content-Type': 'application/json'
    };
  }

  async createContent(model: string, data: any, name?: string): Promise<ApiResponse<BuilderContent>> {
    try {
      const url = `${this.baseUrl}/${model}`;
      const payload = {
        name: name || `New ${model} entry`,
        data,
        published: 'draft'
      };

      Logger.apiRequest('POST', url);

      const response: AxiosResponse = await axios.post(url, payload, {
        headers: this.getHeaders()
      });

      Logger.apiResponse('POST', url, response.status, response.data);

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Write API create request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async updateContent(model: string, id: string, updates: Partial<BuilderContent>): Promise<ApiResponse<BuilderContent>> {
    try {
      const url = `${this.baseUrl}/${model}/${id}`;

      Logger.apiRequest('PUT', url);

      const response: AxiosResponse = await axios.put(url, updates, {
        headers: this.getHeaders()
      });

      Logger.apiResponse('PUT', url, response.status, response.data);

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Write API update request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async publishContent(model: string, id: string): Promise<ApiResponse<BuilderContent>> {
    return this.updateContent(model, id, { published: 'published' });
  }

  async unpublishContent(model: string, id: string): Promise<ApiResponse<BuilderContent>> {
    return this.updateContent(model, id, { published: 'draft' });
  }

  async archiveContent(model: string, id: string): Promise<ApiResponse<BuilderContent>> {
    return this.updateContent(model, id, { published: 'archived' });
  }

  async deleteContent(model: string, id: string): Promise<ApiResponse<boolean>> {
    try {
      const url = `${this.baseUrl}/${model}/${id}`;

      Logger.apiRequest('DELETE', url);

      const response: AxiosResponse = await axios.delete(url, {
        headers: this.getHeaders()
      });

      Logger.apiResponse('DELETE', url, response.status);

      return {
        success: true,
        data: true,
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Write API delete request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async duplicateContent(model: string, id: string, newName?: string): Promise<ApiResponse<BuilderContent>> {
    try {
      const url = `${this.baseUrl}/${model}/${id}/duplicate`;
      const payload = newName ? { name: newName } : {};

      Logger.apiRequest('POST', url);

      const response: AxiosResponse = await axios.post(url, payload, {
        headers: this.getHeaders()
      });

      Logger.apiResponse('POST', url, response.status, response.data);

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Write API duplicate request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }
}

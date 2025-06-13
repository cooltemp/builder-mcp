// Builder.io Upload API client for media management

import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { BuilderConfig, UploadResponse, ApiResponse } from '@/types';
import { Logger } from '@/utils/logger';

export class BuilderUploadService {
  private config: BuilderConfig;
  private baseUrl = 'https://builder.io/api/v1/upload';

  constructor(config: BuilderConfig) {
    this.config = config;
  }

  private getHeaders(contentType?: string) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.privateKey}`
    };

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return headers;
  }

  async uploadFile(file: Buffer, filename: string, options: {
    folder?: string;
    metadata?: Record<string, any>;
  } = {}): Promise<ApiResponse<UploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file, filename);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata));
      }

      Logger.apiRequest('POST', this.baseUrl);

      const response: AxiosResponse = await axios.post(this.baseUrl, formData, {
        headers: {
          ...this.getHeaders(),
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      Logger.apiResponse('POST', this.baseUrl, response.status, response.data);

      return {
        success: true,
        data: {
          url: response.data.url,
          id: response.data.id
        },
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Upload API request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async uploadFromUrl(url: string, options: {
    filename?: string;
    folder?: string;
    metadata?: Record<string, any>;
  } = {}): Promise<ApiResponse<UploadResponse>> {
    try {
      const payload = {
        url,
        filename: options.filename,
        folder: options.folder,
        metadata: options.metadata
      };

      Logger.apiRequest('POST', `${this.baseUrl}/url`);

      const response: AxiosResponse = await axios.post(`${this.baseUrl}/url`, payload, {
        headers: this.getHeaders('application/json')
      });

      Logger.apiResponse('POST', `${this.baseUrl}/url`, response.status, response.data);

      return {
        success: true,
        data: {
          url: response.data.url,
          id: response.data.id
        },
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Upload from URL request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async deleteFile(fileId: string): Promise<ApiResponse<boolean>> {
    try {
      const url = `${this.baseUrl}/${fileId}`;

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
      Logger.error('Delete file request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async getFileInfo(fileId: string): Promise<ApiResponse<any>> {
    try {
      const url = `${this.baseUrl}/${fileId}`;

      Logger.apiRequest('GET', url);

      const response: AxiosResponse = await axios.get(url, {
        headers: this.getHeaders()
      });

      Logger.apiResponse('GET', url, response.status, response.data);

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Get file info request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }
}

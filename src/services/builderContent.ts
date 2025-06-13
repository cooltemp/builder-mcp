// Builder.io Content API client for reading published content

import axios, { AxiosResponse } from 'axios';
import { BuilderConfig, BuilderContent, ContentQuery, ApiResponse } from '@/types';
import { Logger } from '@/utils/logger';

export class BuilderContentService {
  private config: BuilderConfig;
  private baseUrl = 'https://cdn.builder.io/api/v3/content';

  constructor(config: BuilderConfig) {
    this.config = config;
  }

  private buildQueryParams(query: ContentQuery): URLSearchParams {
    const params = new URLSearchParams();
    
    // Always include API key
    params.append('apiKey', query.apiKey || this.config.apiKey);
    
    // Add optional parameters
    if (query.enrich !== undefined) params.append('enrich', query.enrich.toString());
    if (query.fields) params.append('fields', query.fields);
    if (query.omit) params.append('omit', query.omit);
    if (query.query) params.append('query', query.query);
    if (query.sort) params.append('sort', query.sort);
    if (query.limit !== undefined) params.append('limit', query.limit.toString());
    if (query.offset !== undefined) params.append('offset', query.offset.toString());
    if (query.noTargeting !== undefined) params.append('noTargeting', query.noTargeting.toString());
    if (query.includeRefs !== undefined) params.append('includeRefs', query.includeRefs.toString());
    if (query.cacheSeconds !== undefined) params.append('cacheSeconds', query.cacheSeconds.toString());
    if (query.staleCacheSeconds !== undefined) params.append('staleCacheSeconds', query.staleCacheSeconds.toString());
    if (query.includeUnpublished !== undefined) params.append('includeUnpublished', query.includeUnpublished.toString());
    if (query.userAttributes) params.append('userAttributes', JSON.stringify(query.userAttributes));

    return params;
  }

  async getContent(model: string, query: ContentQuery = {}): Promise<ApiResponse<BuilderContent[]>> {
    try {
      const params = this.buildQueryParams(query);
      const url = `${this.baseUrl}/${model}?${params.toString()}`;
      
      Logger.apiRequest('GET', url);

      const response: AxiosResponse = await axios.get(url);

      Logger.apiResponse('GET', url, response.status, response.data);

      return {
        success: true,
        data: response.data.results || [],
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Content API request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async getContentById(model: string, id: string, query: ContentQuery = {}): Promise<ApiResponse<BuilderContent>> {
    try {
      const params = this.buildQueryParams({
        ...query,
        query: JSON.stringify({ id })
      });
      const url = `${this.baseUrl}/${model}?${params.toString()}`;
      
      Logger.apiRequest('GET', url);

      const response: AxiosResponse = await axios.get(url);

      Logger.apiResponse('GET', url, response.status, response.data);

      const results = response.data.results || [];
      if (results.length === 0) {
        return {
          success: false,
          error: 'Content not found',
          status: 404
        };
      }

      return {
        success: true,
        data: results[0],
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Content API request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async searchContent(model: string, searchQuery: string, options: ContentQuery = {}): Promise<ApiResponse<BuilderContent[]>> {
    const query: ContentQuery = {
      ...options,
      query: JSON.stringify({
        $or: [
          { 'data.title': { $regex: searchQuery, $options: 'i' } },
          { 'data.description': { $regex: searchQuery, $options: 'i' } },
          { name: { $regex: searchQuery, $options: 'i' } }
        ]
      })
    };

    return this.getContent(model, query);
  }
}

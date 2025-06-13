// Builder.io Admin API GraphQL client

import axios, { AxiosResponse } from 'axios';
import { BuilderConfig, BuilderModel, ApiResponse } from '@/types';
import { Logger } from '@/utils/logger';

export class BuilderAdminService {
  private config: BuilderConfig;
  private baseUrl = 'https://cdn.builder.io/api/v2/admin';

  constructor(config: BuilderConfig) {
    this.config = config;
  }

  private async makeRequest<T>(query: string, variables?: any): Promise<ApiResponse<T>> {
    try {
      Logger.apiRequest('POST', this.baseUrl);

      const response: AxiosResponse = await axios.post(
        this.baseUrl,
        {
          query,
          variables
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.privateKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Logger.apiResponse('POST', this.baseUrl, response.status, response.data);

      if (response.data.errors) {
        return {
          success: false,
          error: response.data.errors[0]?.message || 'GraphQL error',
          status: response.status
        };
      }

      return {
        success: true,
        data: response.data.data,
        status: response.status
      };
    } catch (error: any) {
      Logger.error('Admin API request failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async introspectSchema(): Promise<ApiResponse<any>> {
    const query = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            fields {
              name
              type {
                name
                kind
              }
            }
          }
        }
      }
    `;

    return this.makeRequest<any>(query);
  }

  async getModels(): Promise<ApiResponse<{ models: BuilderModel[] }>> {
    const query = `
      query GetModels {
        models {
          id
          name
          kind
          fields
          hidden
          archived
          publicReadable
          lastUpdateBy
        }
      }
    `;

    return this.makeRequest<{ models: BuilderModel[] }>(query);
  }

  async getModelIds(): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    const query = `
      query GetModelIds {
        models {
          id
          name
        }
      }
    `;

    const result = await this.makeRequest<{ models: Array<{ id: string; name: string }> }>(query);

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.models
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to get model IDs',
      status: result.status
    };
  }

  async getModel(id: string): Promise<ApiResponse<BuilderModel>> {
    const query = `
      query GetModel($id: String!) {
        model(id: $id) {
          id
          name
          kind
          fields
          hidden
          archived
          publicReadable
          lastUpdateBy
        }
      }
    `;

    const result = await this.makeRequest<{ model: BuilderModel }>(query, { id });

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.model
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to get model',
      status: result.status
    };
  }

  async createModel(model: Partial<BuilderModel>): Promise<ApiResponse<BuilderModel>> {
    const mutation = `
      mutation CreateModel($input: ModelInput!) {
        createModel(input: $input) {
          id
          name
          kind
          fields {
            name
            type
            required
            defaultValue
          }
          createdDate
          lastUpdated
        }
      }
    `;

    const result = await this.makeRequest<{ createModel: BuilderModel }>(mutation, { input: model });

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.createModel
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to create model',
      status: result.status
    };
  }

  async updateModel(id: string, updates: Partial<BuilderModel>): Promise<ApiResponse<BuilderModel>> {
    const mutation = `
      mutation UpdateModel($id: String!, $input: ModelInput!) {
        updateModel(id: $id, input: $input) {
          id
          name
          kind
          fields {
            name
            type
            required
            defaultValue
          }
          createdDate
          lastUpdated
        }
      }
    `;

    const result = await this.makeRequest<{ updateModel: BuilderModel }>(mutation, { id, input: updates });

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.updateModel
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to update model',
      status: result.status
    };
  }

  async deleteModel(id: string): Promise<ApiResponse<boolean>> {
    const mutation = `
      mutation DeleteModel($id: String!) {
        deleteModel(id: $id)
      }
    `;

    const result = await this.makeRequest<{ deleteModel: boolean }>(mutation, { id });

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.deleteModel
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to delete model',
      status: result.status
    };
  }
}

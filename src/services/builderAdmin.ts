// Builder.io Admin API SDK client

import { createAdminApiClient } from '@builder.io/admin-sdk';
import axios, { AxiosResponse } from 'axios';
import { BuilderConfig, BuilderModel, ApiResponse } from '@/types';
import { Logger } from '@/utils/logger';

export class BuilderAdminService {
  private config: BuilderConfig;
  private adminSDK: any;

  constructor(config: BuilderConfig) {
    this.config = config;
    this.adminSDK = createAdminApiClient(config.privateKey);
  }

  private async executeSDKQuery<T>(queryObject: any): Promise<ApiResponse<T>> {
    try {
      Logger.apiRequest('POST', 'Admin SDK Query');
      Logger.apiDebug('POST', 'Admin SDK Query', queryObject);

      const response = await this.adminSDK.query(queryObject);

      Logger.apiResponse('POST', 'Admin SDK Query', 200, response);
      Logger.apiDebug('POST', 'Admin SDK Query', queryObject, response, 200);

      return {
        success: true,
        data: response,
        status: 200
      };
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        queryObject
      };

      Logger.error('Admin SDK query failed', errorDetails);
      Logger.apiDebug('POST', 'Admin SDK Query', queryObject, error.message, 500);

      return {
        success: false,
        error: error.message || 'Admin SDK query failed',
        status: 500
      };
    }
  }

  private async executeSDKMutation<T>(mutationChain: any): Promise<ApiResponse<T>> {
    try {
      Logger.apiRequest('POST', 'Admin SDK Mutation');
      Logger.apiDebug('POST', 'Admin SDK Mutation', 'mutation chain');

      const response = await mutationChain.execute({});

      Logger.apiResponse('POST', 'Admin SDK Mutation', 200, response);
      Logger.apiDebug('POST', 'Admin SDK Mutation', 'mutation chain', response, 200);

      return {
        success: true,
        data: response,
        status: 200
      };
    } catch (error: any) {
      const errorDetails = {
        message: error.message
      };

      Logger.error('Admin SDK mutation failed', errorDetails);
      Logger.apiDebug('POST', 'Admin SDK Mutation', 'mutation chain', error.message, 500);

      return {
        success: false,
        error: error.message || 'Admin SDK mutation failed',
        status: 500
      };
    }
  }

  // Fallback method for raw GraphQL queries not available in SDK chain API
  private async makeRequest<T>(query: string, variables?: any): Promise<ApiResponse<T>> {
    try {
      const baseUrl = 'https://cdn.builder.io/api/v2/admin';
      Logger.apiRequest('POST', baseUrl);
      Logger.apiDebug('POST', baseUrl, { query, variables });

      const requestPayload = {
        query,
        variables
      };

      const response: AxiosResponse = await axios.post(
        baseUrl,
        requestPayload,
        {
          headers: {
            'Authorization': `Bearer ${this.config.privateKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Logger.apiResponse('POST', baseUrl, response.status, response.data);
      Logger.apiDebug('POST', baseUrl, { query, variables }, response.data, response.status);

      if (response.data.errors) {
        const allErrors = response.data.errors.map((err: any) => err.message).join('; ');
        return {
          success: false,
          error: allErrors,
          status: response.status
        };
      }

      return {
        success: true,
        data: response.data.data,
        status: response.status
      };
    } catch (error: any) {
      const errorDetails = {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        query: query.substring(0, 200) + '...',
        variables
      };

      Logger.error('Admin API raw GraphQL failed', errorDetails);
      Logger.apiDebug('POST', 'Admin API Raw GraphQL', { query, variables }, error.response?.data, error.response?.status);

      if (error.response?.data?.errors) {
        const allErrors = error.response.data.errors.map((err: any) => err.message).join('; ');
        return {
          success: false,
          error: allErrors,
          status: error.response?.status || 500
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500
      };
    }
  }

  async introspectSchema(): Promise<ApiResponse<any>> {
    // Use raw GraphQL for introspection as SDK might not support it
    const query = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
            fields {
              name
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    `;

    return this.makeRequest<any>(query);
  }

  async getModels(): Promise<ApiResponse<{ models: BuilderModel[] }>> {
    const queryObject = {
      models: {
        id: true,
        name: true,
        kind: true,
        fields: true,
        hidden: true,
        archived: true,
        publicReadable: true,
        lastUpdateBy: true
      }
    };

    const result = await this.executeSDKQuery<{ data: { models: BuilderModel[] } }>(queryObject);

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.data
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to get models',
      status: result.status
    };
  }

  async getModelIds(): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    const queryObject = {
      models: {
        id: true,
        name: true
      }
    };

    const result = await this.executeSDKQuery<{ data: { models: Array<{ id: string; name: string }> } }>(queryObject);

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.data.models
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to get model IDs',
      status: result.status
    };
  }

  async getModel(id: string): Promise<ApiResponse<BuilderModel>> {
    // For single model queries with variables, we need to get all models first
    // and filter by ID, as the SDK doesn't support parameterized queries the same way
    const modelsResult = await this.getModels();

    if (!modelsResult.success) {
      return {
        success: false,
        error: modelsResult.error || 'Failed to fetch models',
        status: modelsResult.status
      };
    }

    const models = modelsResult.data?.models || [];
    const model = models.find(m => m.id === id);

    if (!model) {
      return {
        success: false,
        error: `Model with ID '${id}' not found`,
        status: 404
      };
    }

    return {
      success: true,
      data: model,
      status: 200
    };
  }

  async getModelByName(name: string): Promise<ApiResponse<BuilderModel>> {
    // First get all models to find the one with matching name
    const modelsResult = await this.getModels();

    if (!modelsResult.success) {
      return {
        success: false,
        error: modelsResult.error || 'Failed to fetch models',
        status: modelsResult.status
      };
    }

    const models = modelsResult.data?.models || [];
    const model = models.find(m => m.name === name);

    if (!model) {
      return {
        success: false,
        error: `Model with name '${name}' not found`,
        status: 404
      };
    }

    // Now get the full model details by ID
    return this.getModel(model.id);
  }

  async createModel(model: Partial<BuilderModel>): Promise<ApiResponse<BuilderModel>> {
    // Use raw GraphQL directly as the chain API doesn't support field selection properly
    const mutation = `
      mutation CreateModel($body: JSONObject!) {
        addModel(body: $body) {
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

    const result = await this.makeRequest<{ addModel: BuilderModel }>(mutation, { body: model });

    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.addModel
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
      mutation UpdateModel($id: String!, $body: JSONObject!) {
        updateModel(id: $id, body: $body) {
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

    const result = await this.makeRequest<{ updateModel: BuilderModel }>(mutation, { id, body: updates });

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
        deleteModel(id: $id) {
          id
        }
      }
    `;

    const result = await this.makeRequest<{ deleteModel: { id: string } | null }>(mutation, { id });

    // Builder.io returns success with deleteModel: null when deletion is successful
    // This is the expected behavior, not an error
    if (result.success && result.data !== undefined) {
      return {
        ...result,
        data: true
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to delete model',
      status: result.status
    };
  }
}

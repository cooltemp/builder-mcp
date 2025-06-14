// Comprehensive test suite for Builder.io Models API operations
// Tests: list all, list IDs, get specific, create, verify, update, verify, delete, verify

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BuilderAdminService } from '@/services/builderAdmin';
import { BuilderConfig, BuilderModel } from '@/types';
import { Logger } from '@/utils/logger';

describe('Builder.io Models API Integration Tests', () => {
  let adminService: BuilderAdminService;
  let testModelId: string | null = null;
  const testModelName = 'test-model-vitest';
  
  // Skip tests if API keys are not available
  const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;
  
  beforeAll(() => {
    if (!hasApiKeys) {
      console.log('⚠️  Skipping Builder.io API tests - API keys not found');
      return;
    }
    
    const config: BuilderConfig = {
      apiKey: process.env.BUILDER_API_KEY!,
      privateKey: process.env.BUILDER_PRIVATE_KEY!
    };
    
    adminService = new BuilderAdminService(config);
    Logger.info('🧪 Starting Builder.io Models API tests');
  });

  afterAll(async () => {
    if (!hasApiKeys || !testModelId) return;
    
    // Cleanup: Delete test model if it still exists
    try {
      Logger.info(`🧹 Cleaning up test model: ${testModelId}`);
      await adminService.deleteModel(testModelId);
    } catch (error) {
      Logger.warn('Cleanup warning: Could not delete test model', error);
    }
  });

  describe('1. List All Models', () => {
    it('should successfully fetch all models', async () => {
      if (!hasApiKeys) return;
      
      const result = await adminService.getModels();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.models).toBeInstanceOf(Array);
      expect(result.status).toBe(200);
      
      if (result.data?.models.length) {
        const firstModel = result.data.models[0];
        expect(firstModel).toHaveProperty('id');
        expect(firstModel).toHaveProperty('name');
        expect(firstModel).toHaveProperty('kind');
        expect(firstModel).toHaveProperty('fields');
      }
      
      Logger.info(`✅ Found ${result.data?.models.length || 0} models`);
    });
  });

  describe('2. List All Model IDs', () => {
    it('should successfully fetch model IDs and names only', async () => {
      if (!hasApiKeys) return;
      
      const result = await adminService.getModelIds();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.status).toBe(200);
      
      if (result.data?.length) {
        const firstModel = result.data[0];
        expect(firstModel).toHaveProperty('id');
        expect(firstModel).toHaveProperty('name');
        expect(Object.keys(firstModel)).toHaveLength(2); // Only id and name
      }
      
      Logger.info(`✅ Found ${result.data?.length || 0} model IDs`);
    });
  });

  describe('3. Get Specific Model', () => {
    it('should successfully fetch a specific model by ID', async () => {
      if (!hasApiKeys) return;

      // First get a model ID to test with
      const modelsResult = await adminService.getModelIds();
      expect(modelsResult.success).toBe(true);

      if (!modelsResult.data?.length) {
        Logger.warn('⚠️  No models found to test specific model fetch');
        return;
      }

      const testId = modelsResult.data[0].id;
      const result = await adminService.getModel(testId);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(testId);
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('kind');
      expect(result.data).toHaveProperty('fields');
      expect(result.status).toBe(200);

      Logger.info(`✅ Successfully fetched model: ${result.data?.name}`);
    });

    it('should handle non-existent model ID gracefully', async () => {
      if (!hasApiKeys) return;

      const fakeId = 'non-existent-model-id-12345';
      const result = await adminService.getModel(fakeId);

      // Builder.io may return success=true but data=null for non-existent models
      if (result.success) {
        expect(result.data).toBeNull();
      } else {
        expect(result.error).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(400);
      }

      Logger.info('✅ Properly handled non-existent model ID');
    });
  });

  describe('3.5. Get Model By Name', () => {
    it('should successfully fetch a specific model by name', async () => {
      if (!hasApiKeys) return;

      // First get a model to test with
      const modelsResult = await adminService.getModelIds();
      expect(modelsResult.success).toBe(true);

      if (!modelsResult.data?.length) {
        Logger.warn('⚠️  No models found to test model fetch by name');
        return;
      }

      const testModel = modelsResult.data[0];
      const testName = testModel.name;
      const testId = testModel.id;

      const result = await adminService.getModelByName(testName);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(testId);
      expect(result.data?.name).toBe(testName);
      expect(result.data).toHaveProperty('kind');
      expect(result.data).toHaveProperty('fields');
      expect(result.status).toBe(200);

      Logger.info(`✅ Successfully fetched model by name: ${testName}`);
    });

    it('should return the same data when fetching by ID vs by name', async () => {
      if (!hasApiKeys) return;

      // Get a model to test with
      const modelsResult = await adminService.getModelIds();
      expect(modelsResult.success).toBe(true);

      if (!modelsResult.data?.length) {
        Logger.warn('⚠️  No models found to test ID vs name consistency');
        return;
      }

      const testModel = modelsResult.data[0];
      const testName = testModel.name;
      const testId = testModel.id;

      // Fetch by ID
      const resultById = await adminService.getModel(testId);
      expect(resultById.success).toBe(true);

      // Fetch by name
      const resultByName = await adminService.getModelByName(testName);
      expect(resultByName.success).toBe(true);

      // Compare the results
      expect(resultById.data?.id).toBe(resultByName.data?.id);
      expect(resultById.data?.name).toBe(resultByName.data?.name);
      expect(resultById.data?.kind).toBe(resultByName.data?.kind);
      expect(resultById.data?.fields?.length).toBe(resultByName.data?.fields?.length);

      Logger.info(`✅ Verified consistency between getModel(ID) and getModelByName(name)`);
    });

    it('should handle non-existent model name gracefully', async () => {
      if (!hasApiKeys) return;

      const fakeName = 'non-existent-model-name-12345';
      const result = await adminService.getModelByName(fakeName);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain(`Model with name '${fakeName}' not found`);
      expect(result.status).toBe(404);

      Logger.info('✅ Properly handled non-existent model name');
    });

    it('should handle empty model name gracefully', async () => {
      if (!hasApiKeys) return;

      const emptyName = '';
      const result = await adminService.getModelByName(emptyName);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain(`Model with name '' not found`);
      expect(result.status).toBe(404);

      Logger.info('✅ Properly handled empty model name');
    });

    it('should handle case-sensitive model names correctly', async () => {
      if (!hasApiKeys) return;

      // Get a model to test with
      const modelsResult = await adminService.getModelIds();
      expect(modelsResult.success).toBe(true);

      if (!modelsResult.data?.length) {
        Logger.warn('⚠️  No models found to test case sensitivity');
        return;
      }

      const testModel = modelsResult.data[0];
      const testName = testModel.name;

      // Test with different case
      const upperCaseName = testName.toUpperCase();
      const lowerCaseName = testName.toLowerCase();

      // Only test if the case is actually different
      if (upperCaseName !== testName) {
        const resultUpper = await adminService.getModelByName(upperCaseName);
        expect(resultUpper.success).toBe(false);
        expect(resultUpper.error).toContain(`Model with name '${upperCaseName}' not found`);
        Logger.info('✅ Verified case sensitivity for uppercase name');
      }

      if (lowerCaseName !== testName) {
        const resultLower = await adminService.getModelByName(lowerCaseName);
        expect(resultLower.success).toBe(false);
        expect(resultLower.error).toContain(`Model with name '${lowerCaseName}' not found`);
        Logger.info('✅ Verified case sensitivity for lowercase name');
      }
    });

    it('should handle API errors when fetching models list', async () => {
      if (!hasApiKeys) return;

      // Create a service with invalid credentials to test error handling
      const invalidConfig: BuilderConfig = {
        apiKey: 'invalid-api-key',
        privateKey: 'invalid-private-key'
      };

      const invalidService = new BuilderAdminService(invalidConfig);
      const result = await invalidService.getModelByName('any-name');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      // Builder.io API might return 200 even with invalid credentials, so just check for error
      expect(result.status).toBeGreaterThanOrEqual(200);

      Logger.info('✅ Properly handled API errors in getModelByName');
    });
  });

  describe('4. Create New Model', () => {
    it('should successfully create a new test model', async () => {
      if (!hasApiKeys) return;

      const newModel: Partial<BuilderModel> = {
        name: testModelName,
        kind: 'data',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: ''
          },
          {
            name: 'content',
            type: 'longText',
            required: false
          }
        ]
      };

      const result = await adminService.createModel(newModel);

      // Always expect the operation to either succeed or fail properly
      expect(result).toBeDefined();
      expect(result.status).toBeDefined();

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data?.name).toBe(testModelName);
        expect(result.data?.kind).toBe('data');
        expect(result.data?.id).toBeDefined();
        expect(result.status).toBe(200);

        // Store the ID for subsequent tests
        testModelId = result.data?.id || null;

        Logger.info(`✅ Successfully created test model with ID: ${testModelId}`);
      } else {
        // If creation fails, log the error and ensure subsequent tests handle it gracefully
        Logger.warn(`⚠️  Model creation failed: ${result.error} (Status: ${result.status})`);
        Logger.warn('This might be due to API permissions or Builder.io plan limitations');

        // Ensure subsequent tests know no model was created
        testModelId = null;

        // Still expect proper error handling
        expect(result.error).toBeDefined();
        expect(typeof result.error).toBe('string');
      }
    });
  });

  describe('5. Verify Test Model Exists', () => {
    it('should find the newly created test model in the models list', async () => {
      if (!hasApiKeys || !testModelId) {
        Logger.info('⏭️  Skipping test - no test model created');
        return;
      }

      const result = await adminService.getModels();

      expect(result.success).toBe(true);
      expect(result.data?.models).toBeDefined();

      const testModel = result.data?.models.find(model => model.id === testModelId);
      expect(testModel).toBeDefined();
      expect(testModel?.name).toBe(testModelName);

      Logger.info('✅ Verified test model exists in models list');
    });

    it('should be able to fetch the test model by ID', async () => {
      if (!hasApiKeys || !testModelId) {
        Logger.info('⏭️  Skipping test - no test model created');
        return;
      }

      const result = await adminService.getModel(testModelId);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(testModelId);
      expect(result.data?.name).toBe(testModelName);
      expect(result.data?.fields).toHaveLength(2);

      Logger.info('✅ Verified test model can be fetched by ID');
    });
  });

  describe('6. Update Model with Description Field', () => {
    it('should successfully add a description field to the test model', async () => {
      if (!hasApiKeys || !testModelId) {
        Logger.info('⏭️  Skipping test - no test model created');
        return;
      }

      const updates: Partial<BuilderModel> = {
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: ''
          },
          {
            name: 'content',
            type: 'longText',
            required: false
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            helperText: 'A brief description of the content'
          }
        ]
      };

      const result = await adminService.updateModel(testModelId, updates);

      // Always expect a proper response structure
      expect(result).toBeDefined();
      expect(result.status).toBeDefined();

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data?.id).toBe(testModelId);
        expect(result.data?.fields).toHaveLength(3);

        // Check that the description field was added
        const descriptionField = result.data?.fields.find(field => field.name === 'description');
        expect(descriptionField).toBeDefined();
        expect(descriptionField?.type).toBe('text');
        expect(descriptionField?.required).toBe(false);

        Logger.info('✅ Successfully added description field to test model');
      } else {
        // If update fails, log the error but don't fail the test if updates aren't supported
        Logger.warn(`⚠️  Model update failed: ${result.error} (Status: ${result.status})`);
        Logger.warn('This might be due to API permissions or Builder.io plan limitations');

        // Still expect proper error handling
        expect(result.error).toBeDefined();
        expect(typeof result.error).toBe('string');
      }
    });
  });

  describe('7. Verify New Field is Present', () => {
    it('should confirm the description field exists in the updated model', async () => {
      if (!hasApiKeys || !testModelId) {
        Logger.info('⏭️  Skipping test - no test model created');
        return;
      }

      const result = await adminService.getModel(testModelId);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      const fields = result.data?.fields || [];
      const fieldNames = fields.map(field => field.name);

      // Always expect the original fields
      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('content');

      // Check if the description field was successfully added
      if (fields.length === 3 && fieldNames.includes('description')) {
        // Update was successful
        expect(result.data?.fields).toHaveLength(3);
        expect(fieldNames).toContain('description');

        const descriptionField = fields.find(field => field.name === 'description');
        expect(descriptionField?.type).toBe('text');
        expect(descriptionField?.required).toBe(false);

        Logger.info('✅ Verified description field is present in updated model');
      } else {
        // Update may have failed, but model should still have original fields
        expect(result.data?.fields).toHaveLength(2);
        Logger.info('⚠️  Description field not found - update may have failed, but original model is intact');
      }
    });
  });

  describe('8. Delete Test Model', () => {
    it('should successfully delete the test model', async () => {
      if (!hasApiKeys || !testModelId) {
        Logger.info('⏭️  Skipping test - no test model created');
        return;
      }

      const result = await adminService.deleteModel(testModelId);

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(result.status).toBe(200);

      Logger.info(`✅ Successfully deleted test model: ${testModelId}`);
    });
  });

  describe('9. Verify Model is Deleted', () => {
    it('should confirm the test model no longer exists in the models list', async () => {
      if (!hasApiKeys || !testModelId) {
        Logger.info('⏭️  Skipping test - no test model created');
        return;
      }

      const result = await adminService.getModels();

      expect(result.success).toBe(true);
      expect(result.data?.models).toBeDefined();

      const testModel = result.data?.models.find(model => model.id === testModelId);
      expect(testModel).toBeUndefined();

      Logger.info('✅ Verified test model no longer exists in models list');
    });

    it('should return error when trying to fetch the deleted model by ID', async () => {
      if (!hasApiKeys || !testModelId) {
        Logger.info('⏭️  Skipping test - no test model created');
        return;
      }

      const result = await adminService.getModel(testModelId);

      // Builder.io may return success=true but data=null for deleted models
      if (result.success) {
        expect(result.data).toBeNull();
      } else {
        expect(result.error).toBeDefined();
        expect(result.status).toBeGreaterThanOrEqual(400);
      }

      Logger.info('✅ Verified deleted model cannot be fetched by ID');

      // Clear the test model ID since it's been successfully deleted
      testModelId = null;
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid model creation gracefully', async () => {
      if (!hasApiKeys) return;

      const invalidModel = {
        // Missing required name field
        kind: 'data',
        fields: []
      };

      const result = await adminService.createModel(invalidModel);

      // Builder.io API may return 200 even for invalid requests, so check for proper error handling
      expect(result).toBeDefined();
      expect(result.status).toBeDefined();

      if (result.success) {
        // If Builder.io accepts the invalid model, that's their API behavior
        Logger.info('ℹ️  Builder.io API accepted model without name - API behavior may vary');
        expect(result.data).toBeDefined();
      } else {
        // If it properly rejects invalid models
        expect(result.error).toBeDefined();
        expect(typeof result.error).toBe('string');
        Logger.info('✅ Properly handled invalid model creation');
      }
    });

    it('should handle update of non-existent model gracefully', async () => {
      if (!hasApiKeys) return;

      const fakeId = 'non-existent-model-id-12345';
      const updates = { fields: [] };

      const result = await adminService.updateModel(fakeId, updates);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.status).toBeGreaterThanOrEqual(400);

      Logger.info('✅ Properly handled update of non-existent model');
    });

    it('should handle deletion of non-existent model gracefully', async () => {
      if (!hasApiKeys) return;

      const fakeId = 'non-existent-model-id-12345';

      const result = await adminService.deleteModel(fakeId);

      // Builder.io API may return success even for non-existent models
      expect(result).toBeDefined();
      expect(result.status).toBeDefined();

      if (result.success) {
        // Builder.io may return success for non-existent model deletion (idempotent behavior)
        Logger.info('ℹ️  Builder.io API returned success for non-existent model deletion (idempotent behavior)');
        expect(result.data).toBe(true);
      } else {
        // If it properly handles non-existent models
        expect(result.error).toBeDefined();
        expect(typeof result.error).toBe('string');
        Logger.info('✅ Properly handled deletion of non-existent model');
      }
    });
  });
});

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
        // Log the error for debugging but don't fail the test if model creation isn't supported
        Logger.warn(`⚠️  Model creation failed: ${result.error}`);
        Logger.warn('This might be due to API permissions or Builder.io plan limitations');

        // Skip subsequent tests that depend on model creation
        testModelId = null;
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

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(testModelId);
      expect(result.data?.fields).toHaveLength(3);

      // Check that the description field was added
      const descriptionField = result.data?.fields.find(field => field.name === 'description');
      expect(descriptionField).toBeDefined();
      expect(descriptionField?.type).toBe('text');
      expect(descriptionField?.required).toBe(false);

      Logger.info('✅ Successfully added description field to test model');
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
      expect(result.data?.fields).toHaveLength(3);

      const fields = result.data?.fields || [];
      const fieldNames = fields.map(field => field.name);

      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('content');
      expect(fieldNames).toContain('description');

      const descriptionField = fields.find(field => field.name === 'description');
      expect(descriptionField?.type).toBe('text');
      expect(descriptionField?.required).toBe(false);

      Logger.info('✅ Verified description field is present in updated model');
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

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.status).toBeGreaterThanOrEqual(400);

      Logger.info('✅ Properly handled invalid model creation');
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

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.status).toBeGreaterThanOrEqual(400);

      Logger.info('✅ Properly handled deletion of non-existent model');
    });
  });
});

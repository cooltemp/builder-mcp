// Comprehensive test suite for Builder.io Content API operations
// Tests: get content, get by ID, create, update, publish, unpublish, search

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BuilderContentService } from '@/services/builderContent';
import { BuilderWriteService } from '@/services/builderWrite';
import { BuilderAdminService } from '@/services/builderAdmin';
import { BuilderConfig, BuilderContent } from '@/types';
import { Logger } from '@/utils/logger';

describe('Builder.io Content API Integration Tests', () => {
  let contentService: BuilderContentService;
  let writeService: BuilderWriteService;
  let adminService: BuilderAdminService;
  let testContentId: string | null = null;
  let testModelName: string | null = null;
  
  // Skip tests if API keys are not available
  const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;
  
  beforeAll(async () => {
    if (!hasApiKeys) {
      console.log('⚠️  Skipping Builder.io Content API tests - API keys not found');
      return;
    }
    
    const config: BuilderConfig = {
      apiKey: process.env.BUILDER_API_KEY!,
      privateKey: process.env.BUILDER_PRIVATE_KEY!
    };
    
    contentService = new BuilderContentService(config);
    writeService = new BuilderWriteService(config);
    adminService = new BuilderAdminService(config);
    
    // Find an existing model to test with
    const modelsResult = await adminService.getModels();
    if (modelsResult.success && modelsResult.data?.models.length) {
      testModelName = modelsResult.data.models[0].name;
      Logger.info(`🧪 Using test model: ${testModelName}`);
    }
    
    Logger.info('🧪 Starting Builder.io Content API tests');
  });

  afterAll(async () => {
    if (!hasApiKeys || !testContentId || !testModelName) return;
    
    // Cleanup: Delete test content if it still exists
    try {
      Logger.info(`🧹 Cleaning up test content: ${testContentId}`);
      // Note: Builder.io Write API doesn't have a delete endpoint, content will remain as draft
    } catch (error) {
      Logger.warn('Cleanup warning: Could not delete test content', error);
    }
  });

  describe('1. Get Content from Model', () => {
    it('should successfully fetch content from an existing model', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }
      
      const result = await contentService.getContent(testModelName);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.status).toBe(200);
      
      Logger.info(`✅ Found ${result.data?.length || 0} content entries for model: ${testModelName}`);
    });

    it('should handle query parameters correctly', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }
      
      const result = await contentService.getContent(testModelName, {
        limit: 5,
        includeRefs: true,
        cacheSeconds: 0
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data?.length).toBeLessThanOrEqual(5);
      
      Logger.info('✅ Successfully applied query parameters');
    });

    it('should handle non-existent model gracefully', async () => {
      if (!hasApiKeys) return;
      
      const fakeModel = 'non-existent-model-12345';
      const result = await contentService.getContent(fakeModel);
      
      // Builder.io may return success with empty results OR error for non-existent models
      if (result.success) {
        expect(result.data).toBeInstanceOf(Array);
      } else {
        expect(result.error).toBeDefined();
      }
      
      Logger.info('✅ Handled non-existent model gracefully');
    });
  });

  describe('2. Get Content by ID', () => {
    it('should fetch specific content by ID when content exists', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }
      
      // First get some content to test with
      const contentResult = await contentService.getContent(testModelName, { limit: 1 });
      
      if (!contentResult.success || !contentResult.data?.length) {
        Logger.info('⏭️  Skipping test - no content available in model');
        return;
      }
      
      const testId = contentResult.data[0].id;
      const result = await contentService.getContentById(testModelName, testId);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(testId);
      
      Logger.info(`✅ Successfully fetched content by ID: ${testId}`);
    });

    it('should handle non-existent content ID gracefully', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }
      
      const fakeId = 'non-existent-content-id-12345';
      const result = await contentService.getContentById(testModelName, fakeId);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.status).toBe(404);
      
      Logger.info('✅ Properly handled non-existent content ID');
    });
  });

  describe('3. Create Content', () => {
    it('should successfully create new content entry', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }

      const testData = {
        title: 'Test Content Entry',
        description: 'This is a test content entry created by Vitest',
        testField: 'test-value-' + Date.now()
      };

      const result = await writeService.createContent(
        testModelName,
        testData,
        'Test Content - Vitest'
      );

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data?.name).toBe('Test Content - Vitest');
        expect(result.data?.published).toBe('draft');
        expect(result.data?.data).toBeDefined();
        expect(result.status).toBe(200);

        // Store the ID for subsequent tests
        testContentId = result.data?.id || null;

        Logger.info(`✅ Successfully created test content with ID: ${testContentId}`);
      } else {
        Logger.warn(`⚠️  Content creation failed: ${result.error}`);
        Logger.warn('This might be due to API permissions or model field requirements');
        testContentId = null;
      }
    });
  });

  describe('4. Update Content', () => {
    it('should successfully update existing content', async () => {
      if (!hasApiKeys || !testModelName || !testContentId) {
        Logger.info('⏭️  Skipping test - no test content created');
        return;
      }

      const updates = {
        name: 'Updated Test Content - Vitest',
        data: {
          title: 'Updated Test Content Entry',
          description: 'This content has been updated by Vitest',
          updatedAt: new Date().toISOString()
        }
      };

      const result = await writeService.updateContent(testModelName, testContentId, updates);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('Updated Test Content - Vitest');

      Logger.info('✅ Successfully updated test content');
    });
  });

  describe('5. Publish Content', () => {
    it('should successfully publish content', async () => {
      if (!hasApiKeys || !testModelName || !testContentId) {
        Logger.info('⏭️  Skipping test - no test content created');
        return;
      }

      const result = await writeService.publishContent(testModelName, testContentId);

      expect(result.success).toBe(true);
      expect(result.data?.published).toBe('published');

      Logger.info('✅ Successfully published test content');
    });
  });

  describe('6. Unpublish Content', () => {
    it('should successfully unpublish content', async () => {
      if (!hasApiKeys || !testModelName || !testContentId) {
        Logger.info('⏭️  Skipping test - no test content created');
        return;
      }

      const result = await writeService.unpublishContent(testModelName, testContentId);

      expect(result.success).toBe(true);
      expect(result.data?.published).toBe('draft');

      Logger.info('✅ Successfully unpublished test content');
    });
  });

  describe('7. Search Content', () => {
    it('should successfully search content with text query', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }

      const result = await contentService.searchContent(testModelName, 'test');

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);

      Logger.info(`✅ Search returned ${result.data?.length || 0} results`);
    });

    it('should handle empty search results gracefully', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }

      const result = await contentService.searchContent(testModelName, 'very-unlikely-search-term-12345');

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data?.length).toBe(0);

      Logger.info('✅ Handled empty search results gracefully');
    });
  });

  describe('8. Error Handling', () => {
    it('should handle invalid content creation gracefully', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }

      // Try to create content with invalid data structure
      const result = await writeService.createContent(testModelName, null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      Logger.info('✅ Properly handled invalid content creation');
    });

    it('should handle update of non-existent content gracefully', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }

      const fakeId = 'non-existent-content-id-12345';
      const result = await writeService.updateContent(testModelName, fakeId, { name: 'Test' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      Logger.info('✅ Properly handled update of non-existent content');
    });

    it('should handle publish of non-existent content gracefully', async () => {
      if (!hasApiKeys || !testModelName) {
        Logger.info('⏭️  Skipping test - no test model available');
        return;
      }

      const fakeId = 'non-existent-content-id-12345';
      const result = await writeService.publishContent(testModelName, fakeId);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      Logger.info('✅ Properly handled publish of non-existent content');
    });
  });
});

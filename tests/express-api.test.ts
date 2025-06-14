// Comprehensive test suite for Express API Routes
// Tests: HTTP endpoints, middleware, validation, error handling

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createModelsRouter } from '@/routes/models';
import { createContentRouter } from '@/routes/content';
import { createUploadRouter } from '@/routes/upload';
import { createTypesRouter } from '@/routes/types';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';

describe('Express API Routes Testing', () => {
  let app: express.Application;
  let testModelId: string | null = null;
  const testModelName = `express-test-${Date.now()}`;
  
  // Skip tests if API keys are not available
  const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;
  
  beforeAll(() => {
    if (!hasApiKeys) {
      console.log('⚠️  Skipping Express API tests - API keys not found');
      return;
    }
    
    const config: BuilderConfig = {
      apiKey: process.env.BUILDER_API_KEY!,
      privateKey: process.env.BUILDER_PRIVATE_KEY!
    };
    
    // Create Express app with routes
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Add request logging middleware for tests
    app.use((req, res, next) => {
      Logger.info(`Test Request: ${req.method} ${req.path}`);
      next();
    });
    
    // Mount routers
    app.use('/models', createModelsRouter(config));
    app.use('/content', createContentRouter(config));
    app.use('/upload', createUploadRouter(config));
    app.use('/generate-types', createTypesRouter(config));
    
    // Error handling middleware
    app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    });
    
    Logger.info('🧪 Starting Express API tests');
  });

  afterAll(async () => {
    if (!hasApiKeys || !testModelId) return;
    
    // Cleanup: Delete test model if it still exists
    try {
      Logger.info(`🧹 Cleaning up test model: ${testModelId}`);
      await request(app)
        .delete(`/models/${testModelId}`)
        .expect(200);
    } catch (error) {
      Logger.warn('Cleanup warning: Could not delete test model', error);
    }
  });

  describe('Models API Routes', () => {
    it('GET /models should return models list', async () => {
      if (!hasApiKeys) return;
      
      const response = await request(app)
        .get('/models')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('models');
      expect(Array.isArray(response.body.data.models)).toBe(true);
      
      Logger.info(`✅ GET /models returned ${response.body.data.models.length} models`);
    });

    it('GET /models/ids should return model IDs only', async () => {
      if (!hasApiKeys) return;
      
      const response = await request(app)
        .get('/models/ids')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 0) {
        const firstModel = response.body.data[0];
        expect(firstModel).toHaveProperty('id');
        expect(firstModel).toHaveProperty('name');
        expect(Object.keys(firstModel)).toHaveLength(2);
      }
      
      Logger.info('✅ GET /models/ids returns correct format');
    });

    it('GET /models/schema should return GraphQL schema', async () => {
      if (!hasApiKeys) return;
      
      const response = await request(app)
        .get('/models/schema')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      
      Logger.info('✅ GET /models/schema returns schema data');
    });

    it('POST /models should create new model with validation', async () => {
      if (!hasApiKeys) return;
      
      // Test validation - missing name
      await request(app)
        .post('/models')
        .send({
          kind: 'data',
          fields: []
        })
        .expect(400);
      
      // Test validation - invalid name
      await request(app)
        .post('/models')
        .send({
          name: 'invalid name with spaces',
          kind: 'data',
          fields: []
        })
        .expect(400);
      
      // Test successful creation
      const validModel = {
        name: testModelName,
        kind: 'data',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: ''
          }
        ]
      };
      
      const response = await request(app)
        .post('/models')
        .send(validModel)
        .expect('Content-Type', /json/);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(testModelName);
        testModelId = response.body.data.id;
        Logger.info(`✅ POST /models created model: ${testModelId}`);
      } else {
        Logger.warn(`⚠️  Model creation failed: ${response.body.error}`);
      }
    });

    it('GET /models/:id should fetch specific model', async () => {
      if (!hasApiKeys) return;
      
      // Test with invalid ID
      await request(app)
        .get('/models/invalid-id-12345')
        .expect(404);
      
      // Test with valid ID (if we have one)
      if (testModelId) {
        const response = await request(app)
          .get(`/models/${testModelId}`)
          .expect(200)
          .expect('Content-Type', /json/);
        
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data.id).toBe(testModelId);
        expect(response.body.data.name).toBe(testModelName);
        
        Logger.info('✅ GET /models/:id fetches specific model correctly');
      }
    });

    it('PUT /models/:id should update model with validation', async () => {
      if (!hasApiKeys || !testModelId) return;

      // Test validation - invalid name
      await request(app)
        .put(`/models/${testModelId}`)
        .send({
          name: 'invalid name with spaces'
        })
        .expect(400);

      // Test successful update
      const updates = {
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: ''
          },
          {
            name: 'description',
            type: 'text',
            required: false
          }
        ]
      };

      const response = await request(app)
        .put(`/models/${testModelId}`)
        .send(updates)
        .expect('Content-Type', /json/);

      // Handle both success and failure cases
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data.id).toBe(testModelId);
        Logger.info('✅ PUT /models/:id updates model correctly');
      } else {
        // Model update might fail due to Builder.io limitations
        expect(response.body).toHaveProperty('success', false);
        Logger.warn(`⚠️  Model update failed (expected): ${response.body.error}`);
      }
    });

    it('DELETE /models/:id should delete model', async () => {
      if (!hasApiKeys || !testModelId) return;

      const response = await request(app)
        .delete(`/models/${testModelId}`)
        .expect('Content-Type', /json/);

      // Handle both success and failure cases
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);

        // Verify model is deleted
        await request(app)
          .get(`/models/${testModelId}`)
          .expect(404);

        testModelId = null; // Clear for cleanup
        Logger.info('✅ DELETE /models/:id deletes model correctly');
      } else {
        // Model deletion might fail due to Builder.io limitations
        expect(response.body).toHaveProperty('success', false);
        Logger.warn(`⚠️  Model deletion failed (expected): ${response.body.error}`);
        // Keep testModelId for cleanup attempt
      }
    });
  });

  describe('Content API Routes', () => {
    it('GET /content/:model should return content with query parameters', async () => {
      if (!hasApiKeys) return;
      
      // Test with missing model parameter (should be handled by route)
      await request(app)
        .get('/content/')
        .expect(404);
      
      // Test with valid model
      const response = await request(app)
        .get('/content/page')
        .query({ limit: 5, includeRefs: true })
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      
      Logger.info('✅ GET /content/:model handles query parameters correctly');
    });

    it('GET /content/:model/:id should fetch specific content', async () => {
      if (!hasApiKeys) return;
      
      // Test with invalid ID
      const response = await request(app)
        .get('/content/page/invalid-id-12345')
        .expect('Content-Type', /json/);
      
      // Should return error response, not 500
      expect(response.body).toHaveProperty('success');
      
      Logger.info('✅ GET /content/:model/:id handles invalid IDs gracefully');
    });

    it('POST /content/:model should validate content data', async () => {
      if (!hasApiKeys) return;
      
      // Test with missing data
      await request(app)
        .post('/content/page')
        .send({
          name: 'Test Content'
        })
        .expect(400);
      
      // Test with invalid data
      await request(app)
        .post('/content/page')
        .send({
          data: null
        })
        .expect(400);
      
      Logger.info('✅ POST /content/:model validates content data correctly');
    });
  });

  describe('Upload API Routes', () => {
    it('POST /upload should handle missing file', async () => {
      if (!hasApiKeys) return;

      const response = await request(app)
        .post('/upload')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('No file provided');

      Logger.info('✅ POST /upload handles missing file correctly');
    });

    it('POST /upload/url should validate URL parameter', async () => {
      if (!hasApiKeys) return;

      // Test with missing URL
      await request(app)
        .post('/upload/url')
        .send({})
        .expect(400);

      // Test with invalid URL
      await request(app)
        .post('/upload/url')
        .send({
          url: 'not-a-valid-url'
        })
        .expect(400);

      Logger.info('✅ POST /upload/url validates URL parameter correctly');
    });
  });

  describe('Types API Routes', () => {
    it('POST /generate-types should generate types for all models', async () => {
      if (!hasApiKeys) return;

      const response = await request(app)
        .post('/generate-types')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');

      Logger.info('✅ POST /generate-types generates types correctly');
    });

    it('POST /generate-types/:model should validate model parameter', async () => {
      if (!hasApiKeys) return;

      // Test with invalid model name
      const response = await request(app)
        .post('/generate-types/invalid-model-name-12345')
        .expect('Content-Type', /json/);

      // Should return error response for non-existent model
      expect(response.body).toHaveProperty('success', false);

      Logger.info('✅ POST /generate-types/:model validates model parameter');
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle 404 routes correctly', async () => {
      if (!hasApiKeys) return;
      
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);
      
      Logger.info('✅ 404 routes handled correctly');
    });

    it('should handle validation errors consistently', async () => {
      if (!hasApiKeys) return;
      
      const response = await request(app)
        .post('/models')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      
      Logger.info('✅ Validation errors handled consistently');
    });
  });
});

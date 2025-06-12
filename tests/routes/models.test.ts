import request from 'supertest';
import app from '../../src/app';
import { builderAdminApi } from '../../src/builder/admin-api';
import { BuilderModel } from '../../src/builder/types';

// Mock the Builder Admin API
jest.mock('../../src/builder/admin-api');
const mockBuilderAdminApi = builderAdminApi as jest.Mocked<typeof builderAdminApi>;

describe('Models Routes', () => {
  const mockModel: BuilderModel = {
    id: 'test-model-id',
    name: 'Test Model',
    kind: 'data',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'longText',
        required: false,
      },
    ],
    createdDate: Date.now(),
    lastUpdated: Date.now(),
    published: 'published',
  };

  const apiKey = 'test-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /models', () => {
    it('should return all models with valid API key', async () => {
      mockBuilderAdminApi.getModels.mockResolvedValue([mockModel]);

      const response = await request(app)
        .get('/models')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: [mockModel],
        meta: {
          count: 1,
          limit: 100,
          offset: 0,
        },
      });

      expect(mockBuilderAdminApi.getModels).toHaveBeenCalledWith({
        limit: 100,
        offset: 0,
        includeFields: true,
      });
    });

    it('should return 401 without API key', async () => {
      const response = await request(app)
        .get('/models')
        .expect(401);

      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should handle pagination parameters', async () => {
      mockBuilderAdminApi.getModels.mockResolvedValue([]);

      await request(app)
        .get('/models?limit=50&offset=10')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(mockBuilderAdminApi.getModels).toHaveBeenCalledWith({
        limit: 50,
        offset: 10,
        includeFields: true,
      });
    });

    it('should validate pagination parameters', async () => {
      const response = await request(app)
        .get('/models?limit=invalid')
        .set('X-API-Key', apiKey)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /models/:model', () => {
    it('should return specific model', async () => {
      mockBuilderAdminApi.getModel.mockResolvedValue(mockModel);

      const response = await request(app)
        .get('/models/test-model-id')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockModel,
      });

      expect(mockBuilderAdminApi.getModel).toHaveBeenCalledWith('test-model-id');
    });

    it('should return 404 for non-existent model', async () => {
      mockBuilderAdminApi.getModel.mockRejectedValue({ code: '404' });

      const response = await request(app)
        .get('/models/non-existent')
        .set('X-API-Key', apiKey)
        .expect(404);

      expect(response.body.error).toBe('NOT_FOUND');
    });
  });

  describe('POST /models', () => {
    const newModelData = {
      name: 'New Test Model',
      kind: 'data' as const,
      fields: [
        {
          name: 'title',
          type: 'text' as const,
          required: true,
        },
      ],
    };

    it('should create new model with valid data', async () => {
      mockBuilderAdminApi.getModels.mockResolvedValue([]); // No existing models
      mockBuilderAdminApi.createModel.mockResolvedValue({
        ...mockModel,
        ...newModelData,
      });

      const response = await request(app)
        .post('/models')
        .set('X-API-Key', apiKey)
        .send(newModelData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newModelData.name);
      expect(mockBuilderAdminApi.createModel).toHaveBeenCalledWith(newModelData);
    });

    it('should return 400 for invalid model data', async () => {
      const invalidData = {
        name: '', // Empty name
        kind: 'invalid',
        fields: [],
      };

      const response = await request(app)
        .post('/models')
        .set('X-API-Key', apiKey)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 409 for duplicate model name', async () => {
      mockBuilderAdminApi.getModels.mockResolvedValue([mockModel]);

      const response = await request(app)
        .post('/models')
        .set('X-API-Key', apiKey)
        .send({ ...newModelData, name: mockModel.name })
        .expect(409);

      expect(response.body.error).toBe('CONFLICT');
    });
  });

  describe('PUT /models/:model', () => {
    const updateData = {
      name: 'Updated Model Name',
      kind: 'data' as const,
      fields: [
        {
          name: 'title',
          type: 'text' as const,
          required: true,
        },
      ],
    };

    it('should update existing model', async () => {
      mockBuilderAdminApi.updateModel.mockResolvedValue({
        ...mockModel,
        ...updateData,
      });

      const response = await request(app)
        .put('/models/test-model-id')
        .set('X-API-Key', apiKey)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockBuilderAdminApi.updateModel).toHaveBeenCalledWith('test-model-id', updateData);
    });

    it('should return 404 for non-existent model', async () => {
      mockBuilderAdminApi.updateModel.mockRejectedValue({ code: '404' });

      const response = await request(app)
        .put('/models/non-existent')
        .set('X-API-Key', apiKey)
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /models/:model', () => {
    it('should delete existing model', async () => {
      mockBuilderAdminApi.deleteModel.mockResolvedValue();

      const response = await request(app)
        .delete('/models/test-model-id')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockBuilderAdminApi.deleteModel).toHaveBeenCalledWith('test-model-id');
    });

    it('should return 404 for non-existent model', async () => {
      mockBuilderAdminApi.deleteModel.mockRejectedValue({ code: '404' });

      const response = await request(app)
        .delete('/models/non-existent')
        .set('X-API-Key', apiKey)
        .expect(404);

      expect(response.body.error).toBe('NOT_FOUND');
    });
  });

  describe('GET /models/:model/schema', () => {
    it('should return JSON schema for model', async () => {
      mockBuilderAdminApi.getModel.mockResolvedValue(mockModel);

      const response = await request(app)
        .get('/models/test-model-id/schema')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('$schema');
      expect(response.body.data).toHaveProperty('properties');
      expect(response.body.data.properties).toHaveProperty('title');
      expect(response.body.data.properties).toHaveProperty('description');
    });
  });
});

import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/metabox';
import { MetaBox } from '../../../models/MetaBox';

// Mock MongoDB
jest.mock('../../../lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock mongoose
const mockCollection = {
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  toArray: jest.fn()
};

const mockModel = {
  collection: mockCollection
};

const mockMongoose = {
  model: jest.fn(() => mockModel),
  Schema: jest.fn(() => ({})),
  __esModule: true
};

jest.mock('mongoose', () => mockMongoose);

describe('/api/metabox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock to return the mockModel
    mockMongoose.model.mockReturnValue(mockModel);
  });

  describe('GET', () => {
    it('returns meta boxes for a company', async () => {
      const mockMetaBoxes = [
        {
          id: 'metabox_1',
          name: 'Test Meta Box',
          company_id: 'company_001',
          owner_id: 'user_001',
          phases: [],
          templates: [],
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      mockCollection.toArray.mockResolvedValue(mockMetaBoxes);

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          company_id: 'company_001',
          user_id: 'user_001'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe('Test Meta Box');
    });

    it('returns 400 when company_id is missing', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          user_id: 'user_001'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('company_id is required');
    });

    it('filters by user permissions', async () => {
      mockCollection.toArray.mockResolvedValue([]);

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          company_id: 'company_001',
          user_id: 'user_001'
        }
      });

      await handler(req, res);

      expect(mockCollection.find).toHaveBeenCalledWith({
        company_id: 'company_001',
        $or: [
          { owner_id: 'user_001' },
          { shared_with: 'user_001' }
        ]
      });
    });
  });

  describe('POST', () => {
    it('creates a new meta box', async () => {
      const newMetaBox = {
        name: 'New Meta Box',
        description: 'Test description',
        company_id: 'company_001',
        user_id: 'user_001',
        phases: [],
        templates: []
      };

      mockCollection.insertOne.mockResolvedValue({
        acknowledged: true,
        insertedId: 'new_id'
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: newMetaBox
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Meta box created successfully');
    });

    it('returns 400 when required fields are missing', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          name: 'Test Meta Box'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('company_id and user_id are required');
    });

    it('returns 400 for invalid data', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          company_id: 'company_001',
          user_id: 'user_001',
          name: '' // Invalid: empty name
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Invalid meta box data');
    });
  });

  describe('PUT', () => {
    it('updates an existing meta box', async () => {
      const existingMetaBox = {
        id: 'metabox_1',
        name: 'Original Name',
        company_id: 'company_001',
        owner_id: 'user_001',
        version: 1
      };

      const updateData = {
        id: 'metabox_1',
        user_id: 'user_001',
        name: 'Updated Name',
        description: 'Updated description'
      };

      mockCollection.findOne
        .mockResolvedValueOnce(existingMetaBox) // First call for permission check
        .mockResolvedValueOnce({ ...existingMetaBox, ...updateData }); // Second call for updated data

      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1
      });

      const { req, res } = createMocks({
        method: 'PUT',
        body: updateData
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Meta box updated successfully');
    });

    it('returns 404 when meta box not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          id: 'nonexistent',
          user_id: 'user_001',
          name: 'Updated Name'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Meta box not found');
    });

    it('returns 403 when user does not have permission', async () => {
      const existingMetaBox = {
        id: 'metabox_1',
        owner_id: 'other_user'
      };

      mockCollection.findOne.mockResolvedValue(existingMetaBox);

      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          id: 'metabox_1',
          user_id: 'user_001',
          name: 'Updated Name'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Permission denied');
    });
  });

  describe('DELETE', () => {
    it('deletes an existing meta box', async () => {
      const existingMetaBox = {
        id: 'metabox_1',
        owner_id: 'user_001'
      };

      mockCollection.findOne.mockResolvedValue(existingMetaBox);
      mockCollection.deleteOne.mockResolvedValue({
        deletedCount: 1
      });

      const { req, res } = createMocks({
        method: 'DELETE',
        body: {
          id: 'metabox_1',
          user_id: 'user_001'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Meta box deleted successfully');
    });

    it('returns 404 when meta box not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'DELETE',
        body: {
          id: 'nonexistent',
          user_id: 'user_001'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Meta box not found');
    });

    it('returns 403 when user does not have permission', async () => {
      const existingMetaBox = {
        id: 'metabox_1',
        owner_id: 'other_user'
      };

      mockCollection.findOne.mockResolvedValue(existingMetaBox);

      const { req, res } = createMocks({
        method: 'DELETE',
        body: {
          id: 'metabox_1',
          user_id: 'user_001'
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Permission denied');
    });
  });

  describe('Method not allowed', () => {
    it('returns 405 for unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'PATCH'
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Method not allowed');
    });
  });
}); 
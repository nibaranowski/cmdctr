import { createMocks } from 'node-mocks-http';
import request from 'supertest';

import { queryAuditLogs, getAuditStats } from '../../../lib/audit';
import handler from '../../../pages/api/audit-logs';

// Mock the audit utility
jest.mock('../../../lib/audit', () => ({
  queryAuditLogs: jest.fn(),
  getAuditStats: jest.fn(),
}));

describe('/api/audit-logs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return audit logs with pagination', async () => {
      const mockLogs = [
        {
          _id: 'audit123',
          event_type: 'auth.login',
          severity: 'low',
          user_email: 'test@example.com',
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (queryAuditLogs as jest.Mock).mockResolvedValue({
        logs: mockLogs,
        total: 1,
        hasMore: false,
      });

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          event_type: 'auth.login',
          limit: '10',
          offset: '0',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        logs: [
          {
            id: 'audit123',
            event_type: 'auth.login',
            severity: 'low',
            user_email: 'test@example.com',
            timestamp: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
        pagination: {
          total: 1,
          hasMore: false,
          limit: 10,
          offset: 0,
        },
      });
    });

    it('should handle stats request', async () => {
      const mockStats = {
        total_events: 100,
        events_by_type: {
          'auth.login': 50,
          'auth.logout': 30,
        },
        events_by_severity: {
          low: 80,
          medium: 20,
        },
        recent_activity: 10,
      };

      (getAuditStats as jest.Mock).mockResolvedValue(mockStats);

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          stats: 'true',
          company_id: 'company123',
          days: '30',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        stats: mockStats,
      });

      expect(getAuditStats).toHaveBeenCalledWith('company123', 30);
    });

    it('should handle date range filters', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          start_date: '2024-01-01T00:00:00.000Z',
          end_date: '2024-01-31T23:59:59.999Z',
        },
      });

      (queryAuditLogs as jest.Mock).mockResolvedValue({
        logs: [],
        total: 0,
        hasMore: false,
      });

      await handler(req, res);

      expect(queryAuditLogs).toHaveBeenCalledWith({
        start_date: new Date('2024-01-01T00:00:00.000Z'),
        end_date: new Date('2024-01-31T23:59:59.999Z'),
        limit: 50,
        offset: 0,
      });
    });

    it('should handle multiple filters', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          event_type: 'auth.login',
          severity: 'medium',
          user_email: 'test@example.com',
          ip_address: '192.168.1.1',
          company_id: 'company123',
        },
      });

      (queryAuditLogs as jest.Mock).mockResolvedValue({
        logs: [],
        total: 0,
        hasMore: false,
      });

      await handler(req, res);

      expect(queryAuditLogs).toHaveBeenCalledWith({
        event_type: 'auth.login',
        severity: 'medium',
        user_email: 'test@example.com',
        ip_address: '192.168.1.1',
        company_id: 'company123',
        limit: 50,
        offset: 0,
      });
    });

    it('should return 405 for non-GET requests', async () => {
      const { req, res } = createMocks({
        method: 'POST',
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Method not allowed',
      });
    });

    it('should handle errors gracefully', async () => {
      (queryAuditLogs as jest.Mock).mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Internal server error',
      });
    });
  });

  describe('Query parameters', () => {
    it('should use default pagination values', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      });

      (queryAuditLogs as jest.Mock).mockResolvedValue({
        logs: [],
        total: 0,
        hasMore: false,
      });

      await handler(req, res);

      expect(queryAuditLogs).toHaveBeenCalledWith({
        limit: 50,
        offset: 0,
      });
    });

    it('should parse custom pagination values', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          limit: '25',
          offset: '50',
        },
      });

      (queryAuditLogs as jest.Mock).mockResolvedValue({
        logs: [],
        total: 0,
        hasMore: false,
      });

      await handler(req, res);

      expect(queryAuditLogs).toHaveBeenCalledWith({
        limit: 25,
        offset: 50,
      });
    });

    it('should handle invalid pagination values', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          limit: 'invalid',
          offset: 'invalid',
        },
      });

      (queryAuditLogs as jest.Mock).mockResolvedValue({
        logs: [],
        total: 0,
        hasMore: false,
      });

      await handler(req, res);

      expect(queryAuditLogs).toHaveBeenCalledWith({
        limit: NaN,
        offset: NaN,
      });
    });
  });
}); 
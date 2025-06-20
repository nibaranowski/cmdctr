// Mock MongoDB connection
const dbConnectMock = jest.fn(() => Promise.resolve());
jest.mock('../../lib/mongodb', () => ({
  __esModule: true,
  default: dbConnectMock,
}));

// Mock AuditLog model
jest.mock('../../models/AuditLog', () => ({
  AuditLog: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

describe('Audit Logging Utility', () => {
  let logAuditEvent: any;
  let queryAuditLogs: any;
  let getAuditStats: any;
  let logAuthEvent: any;
  let logSecurityEvent: any;
  let logUserEvent: any;
  let logSystemEvent: any;
  let AuditLog: any;
  let dbConnect: any;

  beforeAll(async () => {
    // Import modules after mocks are set up
    const auditModule = await import('../../lib/audit');
    const auditLogModule = await import('../../models/AuditLog');
    const mongodbModule = await import('../../lib/mongodb');

    logAuditEvent = auditModule.logAuditEvent;
    queryAuditLogs = auditModule.queryAuditLogs;
    getAuditStats = auditModule.getAuditStats;
    logAuthEvent = auditModule.logAuthEvent;
    logSecurityEvent = auditModule.logSecurityEvent;
    logUserEvent = auditModule.logUserEvent;
    logSystemEvent = auditModule.logSystemEvent;
    AuditLog = auditLogModule.AuditLog;
    dbConnect = mongodbModule.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    dbConnectMock.mockClear();
  });

  describe('logAuditEvent', () => {
    it('should create an audit log entry', async () => {
      const mockAuditLog = {
        _id: 'audit123',
        event_type: 'auth.login',
        severity: 'low',
        user_email: 'test@example.com',
        timestamp: new Date(),
      };

      (AuditLog.create as jest.Mock).mockResolvedValue(mockAuditLog);

      const result = await logAuditEvent({
        event_type: 'auth.login',
        severity: 'low',
        user_email: 'test@example.com',
      });

      expect(dbConnectMock).toHaveBeenCalled();
      expect(AuditLog.create).toHaveBeenCalledWith({
        event_type: 'auth.login',
        severity: 'low',
        user_email: 'test@example.com',
        timestamp: expect.any(Date),
      });
      expect(result).toEqual(mockAuditLog);
    });

    it('should extract IP and user agent from request', async () => {
      const mockRequest = {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0',
        },
      } as any;

      const mockAuditLog = {
        _id: 'audit123',
        event_type: 'auth.login',
        severity: 'low',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        timestamp: new Date(),
      };

      (AuditLog.create as jest.Mock).mockResolvedValue(mockAuditLog);

      await logAuditEvent({
        event_type: 'auth.login',
        severity: 'low',
        user_email: 'test@example.com',
      }, mockRequest);

      expect(AuditLog.create).toHaveBeenCalledWith({
        event_type: 'auth.login',
        severity: 'low',
        user_email: 'test@example.com',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        timestamp: expect.any(Date),
      });
    });

    it('should handle errors gracefully', async () => {
      (AuditLog.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(logAuditEvent({
        event_type: 'auth.login',
        severity: 'low',
        user_email: 'test@example.com',
      })).rejects.toThrow('Database error');
    });
  });

  describe('queryAuditLogs', () => {
    it('should query audit logs with filters', async () => {
      const mockLogs = [
        {
          _id: 'audit123',
          event_type: 'auth.login',
          severity: 'low',
          user_email: 'test@example.com',
          timestamp: new Date(),
        },
      ];

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockLogs),
      };

      const mockCountDocuments = {
        exec: jest.fn().mockResolvedValue(1),
      };

      (AuditLog.find as jest.Mock).mockReturnValue(mockFind);
      (AuditLog.countDocuments as jest.Mock).mockReturnValue(mockCountDocuments);

      const result = await queryAuditLogs({
        event_type: 'auth.login',
        user_email: 'test@example.com',
        limit: 10,
        offset: 0,
      });

      expect(AuditLog.find).toHaveBeenCalledWith({
        event_type: 'auth.login',
        user_email: 'test@example.com',
      });
      expect(result).toEqual({
        logs: mockLogs,
        total: 1,
        hasMore: false,
      });
    });

    it('should handle date range filters', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      const mockCountDocuments = {
        exec: jest.fn().mockResolvedValue(0),
      };

      (AuditLog.find as jest.Mock).mockReturnValue(mockFind);
      (AuditLog.countDocuments as jest.Mock).mockReturnValue(mockCountDocuments);

      await queryAuditLogs({
        start_date: startDate,
        end_date: endDate,
      });

      expect(AuditLog.find).toHaveBeenCalledWith({
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    });
  });

  describe('getAuditStats', () => {
    it('should return audit statistics', async () => {
      const mockAggregateResults = [
        { _id: 'auth.login', count: 10 },
        { _id: 'auth.logout', count: 5 },
      ];

      const mockSeverityResults = [
        { _id: 'low', count: 12 },
        { _id: 'medium', count: 3 },
      ];

      // Mock countDocuments to return values directly
      (AuditLog.countDocuments as jest.Mock)
        .mockResolvedValueOnce(15) // total events
        .mockResolvedValueOnce(8); // recent activity
      (AuditLog.aggregate as jest.Mock)
        .mockResolvedValueOnce(mockAggregateResults) // events by type
        .mockResolvedValueOnce(mockSeverityResults); // events by severity

      const result = await getAuditStats('company123', 30);

      expect(result).toEqual({
        total_events: 15,
        events_by_type: {
          'auth.login': 10,
          'auth.logout': 5,
        },
        events_by_severity: {
          low: 12,
          medium: 3,
        },
        recent_activity: 8,
      });
    });
  });

  describe('Convenience functions', () => {
    it('should log auth events with appropriate severity', async () => {
      const mockAuditLog = {
        _id: 'audit123',
        event_type: 'auth.login_failed',
        severity: 'medium',
        user_email: 'test@example.com',
        timestamp: new Date(),
      };

      (AuditLog.create as jest.Mock).mockResolvedValue(mockAuditLog);

      await logAuthEvent('auth.login_failed', 'test@example.com', 'user123', {
        reason: 'invalid_password',
      });

      expect(AuditLog.create).toHaveBeenCalledWith({
        event_type: 'auth.login_failed',
        severity: 'medium',
        user_email: 'test@example.com',
        user_id: 'user123',
        details: {
          reason: 'invalid_password',
        },
        timestamp: expect.any(Date),
      });
    });

    it('should log security events', async () => {
      const mockAuditLog = {
        _id: 'audit123',
        event_type: 'security.suspicious_activity',
        severity: 'high',
        timestamp: new Date(),
      };

      (AuditLog.create as jest.Mock).mockResolvedValue(mockAuditLog);

      await logSecurityEvent('security.suspicious_activity', 'high', {
        ip_address: '192.168.1.1',
        reason: 'multiple_failed_attempts',
      });

      expect(AuditLog.create).toHaveBeenCalledWith({
        event_type: 'security.suspicious_activity',
        severity: 'high',
        details: {
          ip_address: '192.168.1.1',
          reason: 'multiple_failed_attempts',
        },
        timestamp: expect.any(Date),
      });
    });

    it('should log user events', async () => {
      const mockAuditLog = {
        _id: 'audit123',
        event_type: 'user.created',
        severity: 'low',
        user_id: 'user123',
        user_email: 'test@example.com',
        timestamp: new Date(),
      };

      (AuditLog.create as jest.Mock).mockResolvedValue(mockAuditLog);

      await logUserEvent('user.created', 'user123', 'test@example.com', {
        role: 'member',
      });

      expect(AuditLog.create).toHaveBeenCalledWith({
        event_type: 'user.created',
        severity: 'low',
        user_id: 'user123',
        user_email: 'test@example.com',
        details: {
          role: 'member',
        },
        timestamp: expect.any(Date),
      });
    });

    it('should log system events', async () => {
      const mockAuditLog = {
        _id: 'audit123',
        event_type: 'system.error',
        severity: 'high',
        timestamp: new Date(),
      };

      (AuditLog.create as jest.Mock).mockResolvedValue(mockAuditLog);

      await logSystemEvent('system.error', 'high', {
        component: 'auth_service',
        error: 'Database connection failed',
      });

      expect(AuditLog.create).toHaveBeenCalledWith({
        event_type: 'system.error',
        severity: 'high',
        details: {
          component: 'auth_service',
          error: 'Database connection failed',
        },
        timestamp: expect.any(Date),
      });
    });
  });
}); 
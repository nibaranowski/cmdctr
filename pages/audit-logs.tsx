import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_email?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  details?: Record<string, any>;
  timestamp: string;
  createdAt: string;
}

interface AuditStats {
  total_events: number;
  events_by_type: Record<string, number>;
  events_by_severity: Record<string, number>;
  recent_activity: number;
}

const AuditLogsPage: NextPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    event_type: '',
    severity: '',
    user_email: '',
    limit: '50',
    offset: '0',
  });

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditStats();
  }, [filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/audit-logs?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      const response = await fetch('/api/audit-logs?stats=true&days=30');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch audit stats:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: '0', // Reset offset when filters change
    }));
  };

  const loadMore = () => {
    const newOffset = parseInt(filters.offset) + parseInt(filters.limit);
    setFilters(prev => ({
      ...prev,
      offset: newOffset.toString(),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Audit Logs - cmdctr</title>
        <meta name="description" content="View system audit logs and security events" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-2 text-gray-600">
            Monitor security events, user actions, and system activities
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Events</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total_events}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <p className="text-3xl font-bold text-green-600">{stats.recent_activity}</p>
              <p className="text-sm text-gray-500">Last 24 hours</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">High Severity</h3>
              <p className="text-3xl font-bold text-red-600">
                {(stats.events_by_severity.high || 0) + (stats.events_by_severity.critical || 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Event Types</h3>
              <p className="text-3xl font-bold text-purple-600">
                {Object.keys(stats.events_by_type).length}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                value={filters.event_type}
                onChange={(e) => handleFilterChange('event_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Events</option>
                <option value="auth.login">Login</option>
                <option value="auth.logout">Logout</option>
                <option value="auth.login_failed">Login Failed</option>
                <option value="auth.magic_link_sent">Magic Link Sent</option>
                <option value="auth.magic_link_used">Magic Link Used</option>
                <option value="auth.session_created">Session Created</option>
                <option value="auth.session_revoked">Session Revoked</option>
                <option value="user.created">User Created</option>
                <option value="security.suspicious_activity">Suspicious Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email
              </label>
              <input
                type="email"
                value={filters.user_email}
                onChange={(e) => handleFilterChange('user_email', e.target.value)}
                placeholder="Filter by email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limit
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Audit Logs</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No audit logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.event_type.replace('auth.', '').replace('user.', '').replace('security.', '').replace('system.', '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.user_email || log.user_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ip_address || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.details ? (
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:text-blue-800">
                              View Details
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {logs.length > 0 && logs.length >= parseInt(filters.limit) && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage; 
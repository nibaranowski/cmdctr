import { useEffect, useState } from 'react';

interface EnvStatus {
  backend: number;
  frontend: number;
  coverage: number;
}

interface TestStatus {
  dev: EnvStatus;
  staging: EnvStatus;
  prod: EnvStatus;
}

const getColor = (value: number) => (value >= 90 ? 'green' : 'red');

export default function TestDashboard() {
  const [status, setStatus] = useState<TestStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/test-status');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      setError('Failed to fetch test status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>{error}</div>;
  if (!status) return <div style={{ padding: 40 }}>No data</div>;

  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Test Dashboard</h1>
      <button onClick={fetchStatus} style={{ marginBottom: 24, padding: '8px 16px', borderRadius: 4, border: '1px solid #ccc', background: '#f9f9f9', cursor: 'pointer' }}>Refresh</button>
      <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 600 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Environment</th>
            <th style={{ textAlign: 'center', padding: 8 }}>Backend</th>
            <th style={{ textAlign: 'center', padding: 8 }}>Frontend</th>
            <th style={{ textAlign: 'center', padding: 8 }}>Coverage</th>
          </tr>
        </thead>
        <tbody>
          {(['dev', 'staging', 'prod'] as const).map((env) => (
            <tr key={env}>
              <td style={{ padding: 8, fontWeight: 600 }}>{env.toUpperCase()}</td>
              <td style={{ padding: 8, textAlign: 'center', color: getColor(status[env].backend) }}>{status[env].backend}%</td>
              <td style={{ padding: 8, textAlign: 'center', color: getColor(status[env].frontend) }}>{status[env].frontend}%</td>
              <td style={{ padding: 8, textAlign: 'center', color: getColor(status[env].coverage) }}>{status[env].coverage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 24, color: '#888' }}>Auto-refreshes every 30 seconds.</p>
    </div>
  );
} 
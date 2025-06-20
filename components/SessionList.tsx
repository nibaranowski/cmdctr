import React from 'react';

interface Session {
  id: string;
  device: string;
  lastActive: string;
  current: boolean;
}

interface SessionListProps {
  sessions: Session[];
  loading?: boolean;
  error?: string;
  onRevoke?: (id: string) => void;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, loading, error, onRevoke }) => {
  if (loading) return <div role="status" style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: 24 }}>{error}</div>;
  return (
    <ul style={{ listStyle: 'none', padding: 0, maxWidth: 400, margin: '0 auto' }}>
      {sessions.map((session) => (
        <li key={session.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 8, borderBottom: '1px solid #eee' }}>
          <span>{session.device}</span>
          <span style={{ color: '#888', fontSize: 12 }}>{session.lastActive}</span>
          {session.current && <span style={{ color: '#0070f3', fontWeight: 500 }}>Current</span>}
          <button
            type="button"
            onClick={() => onRevoke && onRevoke(session.id)}
            style={{ marginLeft: 'auto', padding: 8, borderRadius: 4, background: '#fff', border: '1px solid #ccc' }}
            aria-label={`Revoke ${session.device}`}
          >
            Revoke
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SessionList; 
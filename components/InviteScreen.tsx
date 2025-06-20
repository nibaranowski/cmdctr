import React from 'react';

interface InviteScreenProps {
  expired?: boolean;
  error?: string;
  loading?: boolean;
}

const InviteScreen: React.FC<InviteScreenProps> = ({ expired, error, loading }) => {
  if (loading) return <div role="status" style={{ padding: 24 }}>Loading...</div>;
  if (expired) return <div style={{ color: 'gray', padding: 24 }}>Invite expired</div>;
  if (error) return <div style={{ color: 'red', padding: 24 }}>{error}</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', padding: 24 }}>
      <h2>You've been invited!</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <button type="button" style={{ padding: 8, borderRadius: 4, background: '#222', color: '#fff' }}>Accept</button>
        <button type="button" style={{ padding: 8, borderRadius: 4, background: '#fff', border: '1px solid #ccc' }}>Decline</button>
      </div>
    </div>
  );
};

export default InviteScreen; 
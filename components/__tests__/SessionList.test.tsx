import { render, screen, fireEvent } from '@testing-library/react';

import SessionList from '../SessionList';

describe('SessionList', () => {
  const sessions = [
    { id: '1', device: 'MacBook', lastActive: '2024-06-20', current: true },
    { id: '2', device: 'iPhone', lastActive: '2024-06-19', current: false }
  ];

  it('renders session list', () => {
    render(<SessionList sessions={sessions} />);
    expect(screen.getByText(/MacBook/)).toBeInTheDocument();
    expect(screen.getByText(/iPhone/)).toBeInTheDocument();
  });
  it('shows loading state', () => {
    render(<SessionList loading sessions={[]} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('shows error state', () => {
    render(<SessionList error="Session error" sessions={[]} />);
    expect(screen.getByText(/session error/i)).toBeInTheDocument();
  });
  it('can revoke a session', () => {
    const onRevoke = jest.fn();
    render(<SessionList sessions={sessions} onRevoke={onRevoke} />);
    fireEvent.click(screen.getAllByText(/revoke/i)[1]);
    expect(onRevoke).toHaveBeenCalledWith('2');
  });
  it('is accessible', () => {
    render(<SessionList sessions={sessions} />);
    expect(screen.getAllByRole('button', { name: /revoke/i }).length).toBeGreaterThan(0);
  });
}); 
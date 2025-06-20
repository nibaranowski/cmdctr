import InviteScreen from '../InviteScreen';

describe('InviteScreen', () => {
  it('renders accept and decline buttons', () => {
    render(<InviteScreen />);
    expect(screen.getByText(/accept/i)).toBeInTheDocument();
    expect(screen.getByText(/decline/i)).toBeInTheDocument();
  });
  it('shows expired state', () => {
    render(<InviteScreen expired />);
    expect(screen.getByText(/expired/i)).toBeInTheDocument();
  });
  it('shows error state', () => {
    render(<InviteScreen error="Invite error" />);
    expect(screen.getByText(/invite error/i)).toBeInTheDocument();
  });
  it('shows loading state', () => {
    render(<InviteScreen loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('is accessible', () => {
    render(<InviteScreen />);
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
  });
}); 
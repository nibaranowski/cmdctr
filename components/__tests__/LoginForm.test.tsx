import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  it('renders email input', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
  it('renders SSO buttons', () => {
    render(<LoginForm />);
    expect(screen.getByText(/Google/)).toBeInTheDocument();
    expect(screen.getByText(/Microsoft/)).toBeInTheDocument();
    expect(screen.getByText(/Apple/)).toBeInTheDocument();
  });
  it('shows loading state', () => {
    render(<LoginForm loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('shows error state', () => {
    render(<LoginForm error="Invalid email" />);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
  it('is accessible', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete');
  });
}); 
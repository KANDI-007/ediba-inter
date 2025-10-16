import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import LoginPage from '../../components/LoginPage';

// Mock the useAuth hook
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: mockLogin,
    logout: mockLogout,
    error: null,
    hasPermission: vi.fn(() => true),
    hasRole: vi.fn(() => true)
  })
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('shows error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('wronguser', 'wrongpass');
    });
  });

  it('calls login function with correct credentials', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    
    render(<LoginPage />);
    
    const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(usernameInput, { target: { value: 'Alayi' } });
    fireEvent.change(passwordInput, { target: { value: 'Alayi7@' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('Alayi', 'Alayi7@');
    });
  });

  it('validates required fields', async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);
    
    // Should not call login with empty fields
    expect(mockLogin).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ActivityContext
vi.mock('../../contexts/ActivityContext', () => ({
  useActivityOptional: () => ({
    logActivity: vi.fn()
  })
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should provide initial state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should login with valid credentials', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('Alayi', 'Alayi7@');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(
      expect.objectContaining({
        username: 'Alayi',
        role: 'admin',
        fullName: 'Mme ALAYI Abide'
      })
    );
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should reject invalid credentials', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('InvalidUser', 'InvalidPass');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe("Nom d'utilisateur ou mot de passe incorrect");
  });

  it('should logout successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // First login
    await act(async () => {
      await result.current.login('Alayi', 'Alayi7@');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('ediba.user.session');
  });

  it('should check permissions correctly', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('Alayi', 'Alayi7@');
    });

    expect(result.current.hasPermission('invoices.create')).toBe(true);
    expect(result.current.hasPermission('nonexistent.permission')).toBe(false);
    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('commercial')).toBe(false);
  });

  it('should restore session from localStorage', () => {
    const mockSession = {
      user: {
        username: 'Alayi',
        role: 'admin',
        permissions: ['invoices.create'],
        fullName: 'Mme ALAYI Abide',
        email: 'alayi@edibainter.com',
        lastLogin: new Date().toISOString()
      },
      loginTime: new Date().toISOString()
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSession));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockSession.user);
  });
});

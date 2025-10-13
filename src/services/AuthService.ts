// import { User } from '../types';

// export class AuthService {
//   private static baseUrl = '/api/v1/auth';

//   static async login(credentials: { email: string; password: string }) {
//     // Simulate API call with mock data
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     if (credentials.email === 'demo@funjok.com' && credentials.password === 'demo123') {
//       const user: User = {
//         id: '1',
//         email: credentials.email,
//         username: 'demo_user',
//         firstName: 'Demo',
//         lastName: 'User',
//         avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400',
//         isOnline: true,
//         lastSeen: new Date(),
//         isVerified: true,
//         isPremium: true,
//         createdAt: new Date('2023-01-01'),
//       };

//       return {
//         user,
//         token: 'mock_jwt_token',
//         refreshToken: 'mock_refresh_token',
//       };
//     }

//     throw new Error('Invalid credentials');
//   }

//   static async register(userData: { email: string; password: string; firstName: string; lastName: string }) {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     const user: User = {
//       id: Date.now().toString(),
//       email: userData.email,
//       username: userData.email.split('@')[0],
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       isOnline: true,
//       lastSeen: new Date(),
//       isVerified: false,
//       isPremium: false,
//       createdAt: new Date(),
//     };

//     return {
//       user,
//       token: 'mock_jwt_token',
//       refreshToken: 'mock_refresh_token',
//     };
//   }

//   static async logout() {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return { success: true };
//   }

//   static async refreshToken(refreshToken: string) {
//     // Simulate token refresh
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return {
//       token: 'new_mock_jwt_token',
//       refreshToken: 'new_mock_refresh_token',
//     };
//   }

//   static async forgotPassword(email: string) {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { message: 'Password reset email sent' };
//   }

//   static async resetPassword(token: string, newPassword: string) {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { message: 'Password reset successful' };
//   }

//   static async verifyEmail(token: string) {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return { message: 'Email verified successfully' };
//   }

//   static async requestOTP(phoneNumber: string) {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { message: 'OTP sent to your phone' };
//   }

//   static async verifyOTP(phoneNumber: string, otp: string) {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     if (otp === '123456') {
//       return { success: true };
//     }
//     throw new Error('Invalid OTP');
//   }
// }




import { User } from '../types';

export class AuthService {
  //private static baseUrl = '/api/v1/auth'; //http://127.0.0.1:8000/
  private static baseUrl = 'http://127.0.0.1:8000/auth'; //

  static async login(credentials: { email: string; password: string }) {
    try {
      console.error('Login this.baseUrl:', this.baseUrl);
      const response = await fetch(`${this.baseUrl}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store tokens in localStorage or secure storage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      console.error('Login data:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username || userData.email.split('@')[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();

      // Store tokens if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${this.baseUrl}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      // Clear tokens regardless of response
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');

      if (!response.ok) {
        console.warn('Logout request failed, but tokens cleared locally');
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if request fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      return { success: true };
    }
  }

  static async refreshToken(refreshToken?: string) {
    try {
      const token = refreshToken || localStorage.getItem('refreshToken');

      if (!token) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseUrl}/refresh-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: token }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      // Update stored tokens
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  static async forgotPassword(email: string) {
    try {
      const response = await fetch(`${this.baseUrl}/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send password reset email');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  static async resetPassword(token: string, newPassword: string) {
    try {
      const response = await fetch(`${this.baseUrl}/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  static async verifyEmail(token: string) {
    try {
      const response = await fetch(`${this.baseUrl}/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  static async requestOTP(phoneNumber: string) {
    try {
      const response = await fetch(`${this.baseUrl}/request-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Request OTP error:', error);
      throw error;
    }
  }

  static async verifyOTP(phoneNumber: string, otp: string) {
    try {
      const response = await fetch(`${this.baseUrl}/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  // Utility methods
  static getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getAuthToken();
      if (!token) return null;

      const response = await fetch(`${this.baseUrl}/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          try {
            await this.refreshToken();
            return this.getCurrentUser(); // Retry with new token
          } catch {
            this.logout(); // Clear invalid tokens
            return null;
          }
        }
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Interceptor for API calls that need authentication
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized and we have a refresh token, try to refresh
    if (response.status === 401 && localStorage.getItem('refreshToken')) {
      try {
        await this.refreshToken();
        const newToken = this.getAuthToken();

        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } catch {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }
}
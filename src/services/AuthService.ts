import { User } from '../types';

export class AuthService {
  private static baseUrl = '/api/v1/auth';

  static async login(credentials: { email: string; password: string }) {
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'demo@funjok.com' && credentials.password === 'demo123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        username: 'demo_user',
        firstName: 'Demo',
        lastName: 'User',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400',
        isOnline: true,
        lastSeen: new Date(),
        isVerified: true,
        isPremium: true,
        createdAt: new Date('2023-01-01'),
      };

      return {
        user,
        token: 'mock_jwt_token',
        refreshToken: 'mock_refresh_token',
      };
    }
    
    throw new Error('Invalid credentials');
  }

  static async register(userData: { email: string; password: string; firstName: string; lastName: string }) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      username: userData.email.split('@')[0],
      firstName: userData.firstName,
      lastName: userData.lastName,
      isOnline: true,
      lastSeen: new Date(),
      isVerified: false,
      isPremium: false,
      createdAt: new Date(),
    };

    return {
      user,
      token: 'mock_jwt_token',
      refreshToken: 'mock_refresh_token',
    };
  }

  static async logout() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }

  static async refreshToken(refreshToken: string) {
    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      token: 'new_mock_jwt_token',
      refreshToken: 'new_mock_refresh_token',
    };
  }

  static async forgotPassword(email: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Password reset email sent' };
  }

  static async resetPassword(token: string, newPassword: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Password reset successful' };
  }

  static async verifyEmail(token: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: 'Email verified successfully' };
  }

  static async requestOTP(phoneNumber: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'OTP sent to your phone' };
  }

  static async verifyOTP(phoneNumber: string, otp: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (otp === '123456') {
      return { success: true };
    }
    throw new Error('Invalid OTP');
  }
}
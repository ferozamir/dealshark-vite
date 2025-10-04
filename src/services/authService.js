import { api, API_ENDPOINTS, tokenManager } from './api.js';

// Authentication service
export const authService = {
  // Individual user authentication
  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.success && response.data.tokens) {
        // Store tokens
        tokenManager.setTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );

        return {
          success: true,
          user: response.data.user,
          tokens: response.data.tokens,
        };
      }

      throw new Error('Login failed. Invalid response from server.');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.',
      };
    }
  },

  // Business user authentication
  businessLogin: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.BUSINESS_LOGIN, {
        email,
        password,
      });

      if (response.success && response.data.tokens) {
        // Store tokens
        tokenManager.setTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );

        return {
          success: true,
          user: response.data.user,
          business: response.data.user.business_profile,
          tokens: response.data.tokens,
        };
      }

      throw new Error('Business login failed. Invalid response from server.');
    } catch (error) {
      console.error('Business login error:', error);
      return {
        success: false,
        error: error.message || 'Business login failed. Please try again.',
      };
    }
  },

  // Individual user registration
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER_USER, {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone_number: userData.phone_number,
        user_type: userData.userType || 'customer',
        password: userData.password,
        confirm_password: userData.confirm_password,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Registration successful. Please verify your email.',
          user: response.data.user,
        };
      }

      throw new Error('Registration failed. Invalid response from server.');
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed. Please try again.',
      };
    }
  },

  // Business registration with deal
  businessRegister: async (businessData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.BUSINESS_REGISTER, businessData);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Business registration successful. Please verify your email.',
          business: response.data.business,
          user: response.data.user,
        };
      }

      throw new Error('Business registration failed. Invalid response from server.');
    } catch (error) {
      console.error('Business registration error:', error);
      return {
        success: false,
        error: error.message || 'Business registration failed. Please try again.',
      };
    }
  },

  // OTP verification
  verifyOTP: async (email, otpCode, otpType = 'email') => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp_code: otpCode,
        otp_type: otpType,
      });

      if (response.success) {
        // If OTP verification includes tokens, store them
        if (response.data.tokens) {
          tokenManager.setTokens(
            response.data.tokens.access,
            response.data.tokens.refresh
          );
        }

        return {
          success: true,
          message: response.data.message || 'OTP verified successfully.',
          user: response.data.user,
          business: response.data.user?.business_profile,
        };
      }

      throw new Error('OTP verification failed. Invalid response from server.');
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.message || 'OTP verification failed. Please try again.',
      };
    }
  },

  // Resend OTP
  resendOTP: async (email, otpType = 'email') => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
        email,
        otp_type: otpType,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'OTP sent successfully.',
        };
      }

      throw new Error('Failed to resend OTP. Invalid response from server.');
    } catch (error) {
      console.error('Resend OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to resend OTP. Please try again.',
      };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);

      if (response.success) {
        return {
          success: true,
          profile: response.data,
        };
      }

      throw new Error('Failed to fetch profile. Invalid response from server.');
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch profile. Please try again.',
      };
    }
  },

  // Get user profile by ID (public)
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.USER_PROFILE(userId));

      if (response.success) {
        return {
          success: true,
          profile: response.data,
        };
      }

      throw new Error('Failed to fetch user profile. Invalid response from server.');
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch user profile. Please try again.',
      };
    }
  },

  // Get business profile
  getBusinessProfile: async (businessId) => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.BUSINESS_PROFILE(businessId));

      if (response.success) {
        return {
          success: true,
          profile: response.data,
        };
      }

      throw new Error('Failed to fetch business profile. Invalid response from server.');
    } catch (error) {
      console.error('Get business profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch business profile. Please try again.',
      };
    }
  },

  // Update business profile
  updateBusiness: async (businessId, updateData) => {
    try {
      const response = await api.patch(API_ENDPOINTS.AUTH.UPDATE_BUSINESS(businessId), updateData);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Business updated successfully.',
          business: response.data,
        };
      }

      throw new Error('Failed to update business. Invalid response from server.');
    } catch (error) {
      console.error('Update business error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update business. Please try again.',
      };
    }
  },

  // Logout
  logout: () => {
    tokenManager.clearTokens();
    return {
      success: true,
      message: 'Logged out successfully.',
    };
  },

  // Check authentication status
  isAuthenticated: () => {
    return tokenManager.isAuthenticated();
  },

  // Get current token
  getCurrentToken: () => {
    return tokenManager.getAccessToken();
  },
};

export default authService;

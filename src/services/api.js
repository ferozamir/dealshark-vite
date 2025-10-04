// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER_USER: '/auth/register/user/',
    BUSINESS_LOGIN: '/auth/business/login/',
    BUSINESS_REGISTER: '/auth/business/register/',
    VERIFY_OTP: '/auth/verify-otp/',
    RESEND_OTP: '/auth/resend-otp/',
    PROFILE: '/auth/profile/',
    USER_PROFILE: (userId) => `/auth/user/${userId}/profile`,
    BUSINESS_PROFILE: (businessId) => `/auth/business/${businessId}/profile/`,
    UPDATE_BUSINESS: (businessId) => `/auth/business/${businessId}/update_business/`,
  },
  
  // Deals
  DEALS: {
    CREATE: '/deals/',
    GET_MY_DEALS: '/deals/my/',
    GET_DEAL: (dealId) => `/deals/${dealId}/`,
    GET_ALL_DEALS: '/deals/all/',
    GET_DEALS_BY_BUSINESS: (businessId) => `/deals/${businessId}/by-business/`,
    DEAL_POSTER_OPTIONS: '/deals/deal-poster/options/',
  },
  
  // Referrals
  REFERRALS: {
    SUBSCRIBE: '/referrals/subscribe/',
    UNSUBSCRIBE: '/referrals/unsubscribe/',
    MY_SUBSCRIBERS: (businessId) => `/referrals/${businessId}/subscribers`,
    MY_SUBSCRIPTIONS: '/referrals/my-subscriptions',
  },
  
  // Upload
  UPLOAD: '/upload/',
};

// Token management
class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  setTokens(accessToken, refreshToken = null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated() {
    return !!this.accessToken;
  }
}

// Create token manager instance
export const tokenManager = new TokenManager();

// Base fetch wrapper with error handling
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  if (tokenManager.isAuthenticated()) {
    config.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Token expired or invalid
        tokenManager.clearTokens();
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (response.status === 403) {
        throw new Error('Access forbidden. You do not have permission to perform this action.');
      }
      
      if (response.status === 404) {
        throw new Error('Resource not found.');
      }
      
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Handle API-specific error messages
      if (data && typeof data === 'object' && data.error) {
        throw new Error(data.error);
      }
      
      if (data && typeof data === 'object' && data.message) {
        throw new Error(data.message);
      }
      
      throw new Error(`Request failed with status ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};

// HTTP method helpers
export const api = {
  get: (url, options = {}) => apiRequest(url, { method: 'GET', ...options }),
  post: (url, data, options = {}) => apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }),
  put: (url, data, options = {}) => apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }),
  patch: (url, data, options = {}) => apiRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  }),
  delete: (url, options = {}) => apiRequest(url, { method: 'DELETE', ...options }),
};

// Form data helper for file uploads
export const apiFormData = async (url, formData, options = {}) => {
  const config = {
    headers: {
      // Don't set Content-Type for FormData, let browser set it with boundary
      ...options.headers,
    },
    method: options.method || 'POST',
    body: formData,
    ...options,
  };

  // Add authorization header if token exists
  if (tokenManager.isAuthenticated()) {
    config.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        tokenManager.clearTokens();
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (data && typeof data === 'object' && data.error) {
        throw new Error(data.error);
      }
      
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Upload Error:', error);
    throw error;
  }
};

export default api;

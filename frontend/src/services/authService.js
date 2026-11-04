import api from './api';

// Translate an Axios error into a user-friendly Error object.
const friendlyError = (error, context) => {
  if (error.response) {
    const status = error.response.status;
    const serverMsg = error.response.data?.message || '';

    if (context === 'login') {
      if (status === 401) return new Error('Invalid email or password.');
      if (status === 403) return new Error('Access denied. Your account may be suspended.');
      if (status === 422) return new Error(serverMsg || 'Please check your inputs and try again.');
      return new Error(serverMsg || 'Login failed. Please try again.');
    }

    if (context === 'register') {
      if (
        status === 409 ||
        (status === 400 && serverMsg.toLowerCase().includes('already exists')) ||
        (status === 400 && serverMsg.toLowerCase().includes('duplicate'))
      ) {
        return new Error('An account with this email already exists. Please log in.');
      }
      if (status === 422) return new Error(serverMsg || 'Please check your inputs and try again.');
      return new Error(serverMsg || 'Registration failed. Please try again.');
    }

    return new Error(serverMsg || 'Something went wrong. Please try again.');
  }

  if (error.request) {
    return new Error('Unable to connect to the server. Please check your connection and try again.');
  }

  // Already a friendly Error (re-thrown from within the try block)
  return error;
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      // Handle both response shapes:
      // { success, data: { token, user } } and { success, token, user }
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;

      if (data?.success && token && user) {
        return { success: true, token, user };
      }

      throw new Error(data?.message || 'Login failed. Please try again.');
    } catch (error) {
      // Don't re-wrap an error we threw ourselves above
      if (!error.response && !error.request) throw error;
      throw friendlyError(error, 'login');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data;

      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;

      if (data?.success && token && user) {
        return { success: true, token, user };
      }

      throw new Error(data?.message || 'Registration failed. Please try again.');
    } catch (error) {
      if (!error.response && !error.request) throw error;
      throw friendlyError(error, 'register');
    }
  },

  getCurrentUser: async () => {
    // Calls the backend with the stored JWT — no localStorage fallback
    const response = await api.get('/auth/me');
    return response.data?.data || null;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Network errors on logout are acceptable
    } finally {
      localStorage.removeItem('wedplan_token');
      localStorage.removeItem('wedplan_user');
    }
  }
};

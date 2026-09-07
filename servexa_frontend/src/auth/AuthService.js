import { authAPI } from '../api';
import { Navigate } from 'react-router-dom';    

const AuthService = {
  // ✅ Register a new user
  register: async (email, password, role, tenantId) => {
    try {
      const response = await authAPI.register({ email, password, role, tenantId });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Store only the token, not email
    login: (token) => {
    if (!token || token.split(".").length !== 3) {
        console.error("Invalid token received:", token);
        return;
    }

    localStorage.setItem("token", token);
},


  // ✅ Logout with confirmation & redirect
  logout: () => {
    localStorage.removeItem("token");
  },

  // ✅ Check if a token exists and is valid
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token || token.split(".").length !== 3) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const expiryTime = payload.exp * 1000;
      if (Date.now() >= expiryTime) {
        AuthService.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      AuthService.logout();
      return false;
    }
  },

  // ✅ Get user role from token
  getUserRole: () => {
    const token = localStorage.getItem("token");
    if (!token || token.split(".").length !== 3) return "null";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || "null";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "null";
    }
  },

   // ✅ Get tenant ID from token
  getTenantId: () => {
    const token = localStorage.getItem("token");
    if (!token || token.split(".").length !== 3) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.tenantId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // ✅ Retrieve token for debugging purposes (Optional)
  getToken: () => {
    return localStorage.getItem("token");
  },

  // ✅ Manually clear the token (for debugging purposes)
  clearToken: () => {
    localStorage.removeItem("token");
  },

  // ✅ Attach token to API requests
  getAuthHeader: () => {
    const token = localStorage.getItem("token");
    return token && token.split(".").length === 3 ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default AuthService;
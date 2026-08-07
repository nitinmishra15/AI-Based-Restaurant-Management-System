import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// The port 5244 is the default HTTP port for our ASP.NET Core API.
// Change this to match your backend port if needed (e.g., https://localhost:7198 for HTTPS)
const API_BASE_URL = 'https://localhost:44383/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to handle and format network errors cleanly
  const getCleanErrorMessage = (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message && error.message.toLowerCase().includes("network")) {
      return "Failed to connect to the authentication service. Please verify that the backend API is running.";
    }
    return error.message || "An unexpected error occurred.";
  };

  // Check if a user session exists when the app initializes
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      // Attach the token to all future Axios requests globally:
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // 30-minute absolute session timeout for User accounts only
  useEffect(() => {
    if (user && (user.role === "User" || user.Role === "User")) {
      const loginTimeStr = localStorage.getItem('loginTime');
      const loginTime = loginTimeStr ? parseInt(loginTimeStr) : Date.now();
      if (!loginTimeStr) {
        localStorage.setItem('loginTime', loginTime.toString());
      }

      const elapsed = Date.now() - loginTime;
      const remaining =  30 * 60 * 1000 - elapsed;

      if (remaining <= 0) {
        logout();
        window.location.href = "/";
      } else {
        const timerId = setTimeout(() => {
          logout();
          window.location.href = "/";
        }, remaining);
        return () => clearTimeout(timerId);
      }
    }
  }, [user]);

  const checkCustomerMobile = async (mobileNumber) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/customer-login`, {
        mobileNumber: mobileNumber,
        otp: "",
      });
      const data = response.data;
      return {
        success: true,
        isRegistered: data.isRegistered !== undefined ? data.isRegistered : data.IsRegistered,
        otpSent: data.otpSent !== undefined ? data.otpSent : data.OtpSent,
        message: data.message !== undefined ? data.message : data.Message
      };
    } catch (error) {
      return {
        success: false,
        isRegistered: false,
        otpSent: false,
        message: getCleanErrorMessage(error),
      };
    }
  };

  const verifyCustomerOtp = async (mobileNumber, otp) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/customer-login`, {
        mobileNumber: mobileNumber,
        otp: otp,
      });

      const data = response.data;
      const token = data.token !== undefined ? data.token : data.Token;
      const userProfile = data.user !== undefined ? data.user : data.User;

      if (token) {
        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("token", token);
        localStorage.setItem("loginTime", Date.now().toString());
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userProfile);
      }

      return {
        success: true,
        token,
        user: userProfile,
        isRegistered: data.isRegistered !== undefined ? data.isRegistered : data.IsRegistered,
        otpSent: data.otpSent !== undefined ? data.otpSent : data.OtpSent,
        message: data.message !== undefined ? data.message : data.Message
      };
    } catch (error) {
      return {
        success: false,
        message: getCleanErrorMessage(error),
      };
    }
  };

  const registerCustomer = async ({ mobileNumber, name, email, otp = "" }) => {
    try {
      console.log("Registering customer:", mobileNumber, name, email, "OTP:", otp);
      const response = await axios.post(`${API_BASE_URL}/customer-login`, {
        mobileNumber: mobileNumber,
        username: name, // Maps React name -> Backend Username
        email: email,
        otp: otp
      });

      const data = response.data;
      const token = data.token !== undefined ? data.token : data.Token;
      const userProfile = data.user !== undefined ? data.user : data.User;

      // Automatically store token on success
      if (token) {
        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("token", token);
        localStorage.setItem("loginTime", Date.now().toString());
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userProfile);
      }

      return {
        success: true,
        token,
        user: userProfile,
        isRegistered: data.isRegistered !== undefined ? data.isRegistered : data.IsRegistered,
        otpSent: data.otpSent !== undefined ? data.otpSent : data.OtpSent,
        message: data.message !== undefined ? data.message : data.Message
      };
    } catch (error) {
      return {
        success: false,
        message: getCleanErrorMessage(error),
      };
    }
  };

  const login = async (username, password) => {
    try {
      console.log(username,password);
      console.log(`${API_BASE_URL}/staff-login`);
      // Sends a request to our ASP.NET Core Staff Login endpoint
      const response = await axios.post(`${API_BASE_URL}/staff-login`, { 
        username, 
        password 
      });
      
      // Extract the JWT token and user profile returned by the backend
      const { token, user: userProfile } = response.data;
      
      // Save details in browser local storage to maintain session on refresh
      localStorage.setItem('user', JSON.stringify(userProfile));
      localStorage.setItem('token', token);
      
      // Set default authorization header for all subsequent Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update local React state
      setUser(userProfile);
      
      return { success: true, message: "Logged in successfully!!" };
    } catch (error) {
      // Return server-side error message if authentication fails
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid Username or Password.' 
      };
    }
  };

  const [staffList, setStaffList] = useState([]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff`);
      setStaffList(response.data || []);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const addStaff = async (staffData) => {
    try {
      await axios.post(`${API_BASE_URL}/create-chef`, staffData);
      await fetchStaff();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const updateStaff = async (id, staffData) => {
    try {
      await axios.put(`${API_BASE_URL}/staff/${id}`, staffData);
      await fetchStaff();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteStaff = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/staff/${id}`);
      await fetchStaff();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      checkCustomerMobile, 
      verifyCustomerOtp, 
      registerCustomer,
      staffList,
      fetchStaff,
      addStaff,
      updateStaff,
      deleteStaff
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for easier access across your app
export const useAuth = () => useContext(AuthContext);
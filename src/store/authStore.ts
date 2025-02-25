import { create } from 'zustand';
import axios from 'axios';
import { router } from 'expo-router';

interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const API_URL = 'https://api.escuelajs.co/api/v1';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      
      // Get user profile
      const userResponse = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      set({ user: userResponse.data, isLoading: false });
      
      // Navigate to the main app after successful login
      router.replace('/(tabs)');
    } catch (error) {
      set({ error: 'Invalid credentials', isLoading: false });
    }
  },
  signup: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(`${API_URL}/users`, {
        email,
        password,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      });
      
      // After signup, login automatically
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      
      const userResponse = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      set({ user: userResponse.data, isLoading: false });
      
      
      router.replace('/(tabs)');
    } catch (error) {
      set({ error: 'Registration failed', isLoading: false });
    }
  },
  logout: () => {
    set({ user: null });
    router.replace('/login');
  },
}));
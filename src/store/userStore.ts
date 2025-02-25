import { create } from 'zustand';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: string;
  avatar: string;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (user: Omit<User, 'id' | 'role'>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const API_URL = 'https://api.escuelajs.co/api/v1';

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/users`);
      set({ users: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch users', isLoading: false });
    }
  },
  createUser: async (user) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(`${API_URL}/users`, user);
     
      await get().fetchUsers();
    } catch (error) {
      set({ error: 'Failed to create user', isLoading: false });
    }
  },
  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${API_URL}/users/${id}`);
      
      const users = get().users.filter(user => user.id !== id);
      set({ users, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to delete user', isLoading: false });
    }
  },
}));
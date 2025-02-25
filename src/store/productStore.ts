import { create } from 'zustand';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (offset?: number, limit?: number) => Promise<void>;
}

const API_URL = 'https://api.escuelajs.co/api/v1';

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async (offset = 0, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products?offset=${offset}&limit=${limit}`);
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },
}));
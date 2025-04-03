import { create } from 'zustand';
import { Product } from '@/shared/api/api.types';

interface CreateOrderState {
    loading: boolean;
    error: string | null;
    selectedProduct: Product | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSelectedProduct: (product: Product | null) => void;
    resetState: () => void;
}

export const useCreateOrderStore = create<CreateOrderState>((set) => ({
    loading: false,
    error: null,
    selectedProduct: null,
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    resetState: () => set({ loading: false, error: null, selectedProduct: null }),
})); 
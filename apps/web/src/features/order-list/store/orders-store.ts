import { create } from 'zustand';
import { Order } from '@/shared/api/api.types';

interface OrdersState {
    orders: Order[];
    loading: boolean;
    error: string | null;
    setOrders: (orders: Order[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
    orders: [],
    loading: false,
    error: null,
    setOrders: (orders: Order[]) => set({ orders }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
})); 
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => set({ user: null, token: null }),
}));

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p._id !== id),
    })),

  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p._id === id ? updatedProduct : p
      ),
    })),
}));

export const useAlertStore = create((set) => ({
  alerts: [],
  isLoading: false,
  error: null,

  setAlerts: (alerts) => set({ alerts }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a._id !== id),
    })),

  updateAlert: (id, updatedAlert) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a._id === id ? updatedAlert : a
      ),
    })),
}));

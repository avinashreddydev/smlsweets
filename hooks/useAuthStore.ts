import { create } from 'zustand';

interface User {
    phoneNumber: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    phoneNumber: string;
    isLoading: boolean;

    // Actions
   
    setPhoneNumber: (phone: string) => void;
    login: (phone: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    phoneNumber: '',
    isLoading: false,

    
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

    login: (phoneNumber) => set({
        user: { phoneNumber, name: 'Guest User' },
        phoneNumber: ''
    }),

    logout: () => set({ user: null, phoneNumber: '' }),
    setLoading: (isLoading) => set({ isLoading }),
}));

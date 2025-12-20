import { create } from 'zustand';

type AuthStep = 'PHONE' | 'OTP';

interface User {
    phoneNumber: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    isOpen: boolean;
    step: AuthStep;
    phoneNumber: string;
    isLoading: boolean;

    // Actions
    openAuth: () => void;
    closeAuth: () => void;
    setStep: (step: AuthStep) => void;
    setPhoneNumber: (phone: string) => void;
    login: (phone: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isOpen: false,
    step: 'PHONE',
    phoneNumber: '',
    isLoading: false,

    openAuth: () => set({ isOpen: true, step: 'PHONE', phoneNumber: '' }),
    closeAuth: () => set({ isOpen: false }),
    setStep: (step) => set({ step }),
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

    login: (phoneNumber) => set({
        user: { phoneNumber, name: 'Guest User' },
        isOpen: false,
        step: 'PHONE',
        phoneNumber: ''
    }),

    logout: () => set({ user: null }),
    setLoading: (isLoading) => set({ isLoading }),
}));

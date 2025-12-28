import { create } from 'zustand';

interface ComplaintStore {
    isComplaintOpen: boolean;
    activeComplaintId: string | null;
    openComplaint: (id?: string) => void;
    closeComplaint: () => void;
}

export const useComplaintStore = create<ComplaintStore>((set) => ({
    isComplaintOpen: false,
    activeComplaintId: null,
    openComplaint: (id) => set({ isComplaintOpen: true, activeComplaintId: id || null }),
    closeComplaint: () => set({ isComplaintOpen: false }),
}));

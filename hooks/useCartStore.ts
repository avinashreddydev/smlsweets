import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/lib/storekit';

// Helper to get price
const getPrice = (item: CartItem) => {
    if (item.variantId) {
        const v = item.product.variants?.find(v => v.id === item.variantId);
        if (v) return v.price;
    }
    return item.product.variants?.[0]?.price || 0;
}

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    addItem: (product: Product, quantity?: number, variantId?: string) => void;
    removeItem: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isCartOpen: false,
            addItem: (product: Product, quantity = 1, variantId?: string) => {
                set((state) => {
                    // Find existing item with same product ID AND same variant ID
                    const existing = state.items.find((item) =>
                        item.product.id === product.id && item.variantId === variantId
                    );
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                (item.product.id === product.id && item.variantId === variantId)
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                            isCartOpen: true, // Auto-open cart on add
                        };
                    }
                    return {
                        items: [...state.items, { product, quantity, variantId }],
                        isCartOpen: true, // Auto-open cart on add
                    };
                });
            },
            removeItem: (productId: string, variantId?: string) => {
                set((state) => ({
                    items: state.items.filter((item) =>
                        !(item.product.id === productId && item.variantId === variantId)
                    ),
                }));
            },
            updateQuantity: (productId: string, quantity: number, variantId?: string) => {
                if (quantity < 1) return {};
                set((state) => ({
                    items: state.items.map((item) =>
                        (item.product.id === productId && item.variantId === variantId)
                            ? { ...item, quantity } : item
                    ),
                }));
            },
            clearCart: () => {
                set({ items: [] });
            },
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items }), // Don't persist isCartOpen
        }
    )
);

// Helper helper to get total price outside of store if needed, or derived here
export const getCartTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
        return total + getPrice(item) * item.quantity;
    }, 0);
};

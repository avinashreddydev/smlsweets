"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";




export default function CartDrawer() {
    const { items, isCartOpen, closeCart, removeItem, updateQuantity } = useCartStore();
    const { user } = useAuthStore();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isCartOpen]);

    const cartTotal = items.reduce((total, item) => {
        let price = item.product.variants?.[0]?.price || 0;
        if (item.variantId) {
            const v = item.product.variants?.find((v) => v.id === item.variantId);
            if (v) price = v.price;
        }
        return total + price * item.quantity;
    }, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#FFFDF5] z-[70] shadow-2xl flex flex-col border-l border-black/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-black/10">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-black">Cart</h2>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors text-black"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>



                        {/* Cart Header if items exist, or just 'Cart' label */}
                        <div className="px-6 pt-6 pb-2">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Your Bag ({items.length})</h3>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <span className="text-4xl mb-4">🛒</span>
                                    <p className="font-bold uppercase tracking-widest text-sm">Cart is empty</p>
                                </div>
                            ) : (
                                items.map(({ product, quantity, variantId }) => {
                                    const variant = product.variants?.find((v) => v.id === variantId) || product.variants?.[0];
                                    const price = variant?.price || 0;
                                    const imageUrl = product.image?.[0] || "https://placehold.co/100x100?text=No+Image";

                                    return (
                                        <div key={`${product.id}-${variantId}`} className="flex gap-4 group">
                                            <div className="relative w-20 h-24 bg-white shadow-sm flex-shrink-0">
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold uppercase tracking-tight text-sm pr-4">
                                                            {product.name}
                                                        </h3>
                                                        <span className="font-bold text-sm">₹{price * quantity}</span>
                                                    </div>
                                                    {variant && (
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                                            {variant.quantity} {variant.unit}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex items-center gap-3 border border-black/20 bg-white px-2 py-1">
                                                        <button
                                                            onClick={() => quantity > 1 && updateQuantity(product.id, quantity - 1, variantId)}
                                                            className="w-4 h-4 flex items-center justify-center hover:text-gray-500 text-black"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-xs font-mono w-4 text-center text-black">{quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(product.id, quantity + 1, variantId)}
                                                            className="w-4 h-4 flex items-center justify-center hover:text-gray-500 text-black"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(product.id, variantId)}
                                                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-black underline decoration-red-500/30 underline-offset-2"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-black/10 bg-white/50">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Total</span>
                                    <span className="text-3xl font-black tracking-tighter">₹{cartTotal}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-300 shadow-xl"
                                >
                                    Checkout
                                </Link>
                                <button
                                    onClick={() => { closeCart(); }}
                                    className="block w-full text-center mt-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black"
                                >
                                    View Cart Page
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

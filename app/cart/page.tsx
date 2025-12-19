"use client";

import { useCartStore } from "@/hooks/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    // Calculate total on the fly
    const cartTotal = items.reduce((total, item) => {
        let price = item.product.variants?.[0]?.price || 0;
        // If variantId is present, try to find specific price
        if (item.variantId) {
            const v = item.product.variants?.find(v => v.id === item.variantId);
            if (v) price = v.price;
        }
        return total + price * item.quantity;
    }, 0);

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white">
                <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6 text-center">
                    Cart Empty
                </h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-center font-mono text-sm uppercase tracking-widest">
                    Your collection is waiting to be started.
                </p>
                <Link
                    href="/"
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden bg-black px-8 font-medium text-white transition-all duration-300 hover:w-40 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                    <span className="mr-2 text-sm font-bold uppercase tracking-widest">Start Shopping</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#FFFDF5] px-4 md:px-8 py-12 lg:py-24">
            <h1 className="text-5xl lg:text-9xl font-black uppercase tracking-tighter mb-12 lg:mb-24 text-black opacity-90">
                Your Cart
            </h1>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                <div className="lg:col-span-8">
                    <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-black/20 text-xs font-bold uppercase tracking-widest text-black mb-8">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>

                    <div className="space-y-0">
                        {items.map(({ product, quantity, variantId }) => {
                            const variant = product.variants?.find(v => v.id === variantId) || product.variants?.[0];
                            const price = variant?.price || 0;
                            const imageUrl = product.image?.[0] || "https://placehold.co/100x100?text=No+Image";

                            return (
                                <div
                                    key={`${product.id}-${variantId}`}
                                    className="py-8 border-b border-black/10 group"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                                        {/* Product Info */}
                                        <div className="lg:col-span-6 flex gap-6 items-center">
                                            <div className="relative w-24 h-32 bg-white flex-shrink-0 shadow-sm">
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold uppercase tracking-tight text-black mb-1">
                                                    {product.name}
                                                </h3>
                                                {variant && (
                                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                                        {variant.quantity} {variant.unit}
                                                    </p>
                                                )}
                                                <button
                                                    onClick={() => removeItem(product.id, variantId)}
                                                    className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 underline decoration-red-500/30 underline-offset-4"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mobile Price Display */}
                                        <div className="flex justify-between items-center lg:hidden border-t border-black/5 pt-4 mt-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Price</span>
                                            <span className="text-lg font-medium">₹{price}</span>
                                        </div>

                                        {/* Desktop Price */}
                                        <div className="hidden lg:block lg:col-span-2 text-center text-lg font-medium text-gray-800">
                                            ₹{price}
                                        </div>

                                        {/* Quantity Control */}
                                        <div className="flex justify-between lg:justify-center items-center lg:col-span-2 border-t lg:border-t-0 border-black/5 pt-4 lg:pt-0">
                                            <span className="lg:hidden text-xs font-bold uppercase tracking-widest text-gray-400">Qty</span>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => quantity > 1 && updateQuantity(product.id, quantity - 1, variantId)}
                                                    className="w-8 h-8 flex items-center justify-center border border-black/10 text-black hover:bg-black hover:text-white transition-colors bg-white shadow-sm"
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-mono text-lg">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity + 1, variantId)}
                                                    className="w-8 h-8 flex items-center justify-center border border-black/10 text-black hover:bg-black hover:text-white transition-colors bg-white shadow-sm"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="flex justify-between items-center lg:block lg:col-span-2 text-right border-t lg:border-t-0 border-black/5 pt-4 lg:pt-0">
                                            <span className="lg:hidden text-xs font-bold uppercase tracking-widest text-gray-400">Total</span>
                                            <span className="text-xl font-bold text-black">₹{price * quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-4 mt-12 lg:mt-0">
                    <div className="bg-white p-8 lg:p-12 sticky top-24 border-l-4 border-yellow-400 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.02)]">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm uppercase tracking-widest text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm uppercase tracking-widest text-gray-600">
                                <span>Shipping</span>
                                <span>{cartTotal > 500 ? 'Free' : 'Calculated next'}</span>
                            </div>
                        </div>

                        <div className="border-t border-black/10 pt-6 mb-8">
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg font-bold uppercase tracking-tight">Total</span>
                                <span className="text-5xl font-black tracking-tighter text-black">₹{cartTotal}</span>
                            </div>
                            <p className="text-right text-xs text-gray-400 mt-2 uppercase tracking-widest">Inluding Taxes</p>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full bg-black text-white text-center py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-300 shadow-xl"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

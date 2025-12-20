"use client";

import { useCartStore } from "@/hooks/useCartStore";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    // Calculate total on the fly
    const cartTotal = items.reduce((total, item) => {
        let price = item.product.variants?.[0]?.price || 0;
        if (item.variantId) {
            const v = item.product.variants?.find(v => v.id === item.variantId);
            if (v) price = v.price;
        }
        return total + price * item.quantity;
    }, 0);

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#FFFDF5]">
                <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6 text-center">
                    Cart Empty
                </h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-center font-mono text-sm uppercase tracking-widest">
                    Your collection is waiting to be started.
                </p>
                <Link
                    href="/"
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden bg-black px-8 font-medium text-white transition-all duration-300 hover:bg-yellow-400 hover:text-black shadow-xl"
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
                <div className="lg:col-span-8 space-y-8">
                    {items.map(({ product, quantity, variantId }) => {
                        const variant = product.variants?.find(v => v.id === variantId) || product.variants?.[0];
                        const price = variant?.price || 0;
                        const imageUrl = product.image?.[0] || "https://placehold.co/100x100?text=No+Image";

                        return (
                            <div key={`${product.id}-${variantId}`} className="group border-b border-black/10 pb-8 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start gap-4">
                                    {/* Group 1: Image + Info + Remove */}
                                    <div className="flex gap-4 md:gap-6">
                                        {/* Image */}
                                        <div className="relative w-24 h-24 bg-white flex-shrink-0 shadow-sm border border-black/5">
                                            <Image
                                                src={imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Info & Remove */}
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight text-black leading-tight mb-1">
                                                    {product.name}
                                                </h3>
                                                {variant && (
                                                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500">
                                                        {variant.quantity} {variant.unit}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeItem(product.id, variantId)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-black underline decoration-red-500/30 underline-offset-4 text-left"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Group 2: Price + Quantity */}
                                    <div className="flex flex-col items-end gap-2 md:gap-4">
                                        <span className="text-lg md:text-xl font-bold">₹{price * quantity}</span>

                                        {/* Quantity Pill */}
                                        <div className="flex items-center gap-2 md:gap-3 border border-black/20 bg-white px-2 py-1 md:px-3 md:py-2">
                                            <button
                                                onClick={() => quantity > 1 && updateQuantity(product.id, quantity - 1, variantId)}
                                                className="w-4 h-4 flex items-center justify-center hover:text-gray-500 text-black text-sm md:text-lg"
                                            >
                                                -
                                            </button>
                                            <span className="text-xs md:text-sm font-mono w-4 md:w-6 text-center text-black">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity + 1, variantId)}
                                                className="w-4 h-4 flex items-center justify-center hover:text-gray-500 text-black text-sm md:text-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Section */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 p-8 border border-black/10 bg-white/50 backdrop-blur-sm">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-6">Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm uppercase tracking-widest text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-black font-bold">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm uppercase tracking-widest text-gray-500">
                                <span>Shipping</span>
                                <span className="text-black font-bold">{cartTotal > 500 ? 'Free' : 'Calculated next'}</span>
                            </div>
                        </div>

                        <div className="border-t border-black/10 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Total</span>
                                <span className="text-4xl font-black tracking-tighter">₹{cartTotal}</span>
                            </div>
                            <p className="text-right text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Including Taxes</p>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-300 shadow-xl"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

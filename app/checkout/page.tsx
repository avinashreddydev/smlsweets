"use client";

import { useState } from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { createOrder } from "@/lib/storekit";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate total on the fly
    const cartTotal = items.reduce((total, item) => {
        let price = item.product.variants?.[0]?.price || 0;
        if (item.variantId) {
            const v = item.product.variants?.find(v => v.id === item.variantId);
            if (v) price = v.price;
        }
        return total + price * item.quantity;
    }, 0);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: {
            line1: "",
            city: "",
            state: "",
            postal_code: "",
            country: "US", // Default
        },
    });

    if (items.length === 0 && !success) {
        if (typeof window !== "undefined") {
            router.push("/cart");
        }
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const orderPayload = {
            isGuestCheckout: true,
            customerEmail: formData.email,
            customerName: formData.name,
            shippingAddress: formData.address,
            billingAddress: formData.address, // Simplifying for guest
            items: items.map((item) => {
                const variant = item.product.variants?.find(v => v.id === item.variantId) || item.product.variants?.[0];
                return {
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: variant?.price || 0,
                }
            }),
            currency: "MXN",
        };

        try {
            await createOrder(orderPayload);
            setSuccess(true);
            clearCart();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#FFFDF5]">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-8">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter mb-6 text-center text-black">
                    Order Confirmed
                </h1>
                <p className="text-gray-500 mb-12 max-w-md mx-auto text-center font-mono text-sm uppercase tracking-widest">
                    Confirmation sent to {formData.email}
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-black text-white px-12 py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-all hover:-translate-y-1 shadow-xl"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#FFFDF5] px-4 md:px-8 py-12 lg:py-24">
            <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter mb-12 lg:mb-24 text-black opacity-90">
                Checkout
            </h1>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                {/* Form Section */}
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-8 border-b border-black/10 pb-4 text-black">
                        Shipping Details
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-6 mb-8 text-sm font-bold uppercase tracking-wide">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-3 outline-none transition-colors font-medium placeholder:text-gray-300 rounded-none text-black"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="JOHN DOE"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-3 outline-none transition-colors font-medium placeholder:text-gray-300 rounded-none text-black"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="JOHN@EXAMPLE.COM"
                                />
                            </div>
                        </div>

                        <div className="space-y-8 pt-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Address Line 1</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-3 outline-none transition-colors font-medium placeholder:text-gray-300 rounded-none text-black"
                                    value={formData.address.line1}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value } })}
                                    placeholder="123 MAIN ST"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-3 outline-none transition-colors font-medium placeholder:text-gray-300 rounded-none text-black"
                                        value={formData.address.city}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                        placeholder="NEW YORK"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">State / Province</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-3 outline-none transition-colors font-medium placeholder:text-gray-300 rounded-none text-black"
                                        value={formData.address.state}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                        placeholder="NY"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-3 outline-none transition-colors font-medium placeholder:text-gray-300 rounded-none text-black"
                                        value={formData.address.postal_code}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postal_code: e.target.value } })}
                                        placeholder="10001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Country</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black py-3 outline-none transition-colors font-medium appearance-none rounded-none text-black"
                                            value={formData.address.country}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-5 mt-12 text-sm font-bold uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Processing..." : `Pay ₹${(cartTotal).toFixed(0)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary - Swiss Layout */}
                <div className="lg:col-span-5 order-1 lg:order-2 mb-12 lg:mb-0">
                    <div className="bg-white border border-black p-8 lg:p-10 sticky top-24">
                        <div className="flex justify-between items-end border-b border-black pb-6 mb-8">
                            <h2 className="text-xl font-bold uppercase tracking-widest leading-none">
                                Your<br />Order
                            </h2>
                            <span className="font-mono text-xs">{items.length} ITEMS</span>
                        </div>

                        <div className="space-y-8 mb-8 custom-scrollbar max-h-[500px] overflow-y-auto">
                            {items.map(({ product, quantity, variantId }) => {
                                const variant = product.variants?.find(v => v.id === variantId) || product.variants?.[0];
                                const price = variant?.price || 0;
                                const imageUrl = product.image?.[0] || "https://placehold.co/100x100?text=No+Image";

                                return (
                                    <div key={`${product.id}-${variantId}`} className="group flex gap-6 items-start">
                                        <div className="relative w-20 h-24 bg-gray-100 shrink-0 border border-black/10 overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h4 className="font-bold uppercase text-sm tracking-wider text-black truncate mb-1">{product.name}</h4>
                                            {variant && (
                                                <p className="text-xs font-mono text-gray-500 uppercase tracking-tight mb-2">
                                                    {variant.quantity} {variant.unit}
                                                </p>
                                            )}
                                            <div className="text-xs font-bold border border-black inline-block px-2 py-0.5">
                                                QTY: {quantity}
                                            </div>
                                        </div>
                                        <div className="font-mono text-sm pt-1">
                                            ₹{(price * quantity).toFixed(0)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-black">
                            <div className="flex justify-between text-xs uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="font-mono">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
                                <span>Shipping</span>
                                <span>Calculated next</span>
                            </div>

                            <div className="flex justify-between items-baseline pt-6 border-t border-black mt-6">
                                <div>
                                    <span className="block text-3xl font-black uppercase tracking-tighter leading-none">Total</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">INR (Inc. taxes)</span>
                                </div>
                                <span className="text-5xl font-black tracking-tighter">₹{cartTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

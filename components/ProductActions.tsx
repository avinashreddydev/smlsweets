"use client";

import { useState } from "react";
import { Product } from "@/lib/storekit";
import { useCartStore } from "@/hooks/useCartStore";

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    // 1. Initialize state with the default variant or the first one
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants?.find((v) => v.isDefault) || product.variants?.[0]
    );

    const addItem = useCartStore((state) => state.addItem);
    const [isAdding, setIsAdding] = useState(false);

    // If no variants exist (edge case), handle gracefully or assume simple product
    if (!selectedVariant) return null;

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product, 1, selectedVariant.id);
        setTimeout(() => setIsAdding(false), 1000);
    };

    return (
        <div className="flex flex-col gap-8 mb-12 border-t border-black pt-8">
            {/* Dynamic Price & Stock Display */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Price</span>
                    <span className="text-3xl font-medium tracking-tight">
                        ₹{selectedVariant.price}
                    </span>
                </div>

                <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Stock</span>
                    <span className="text-lg">
                        Available
                    </span>
                </div>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
                <div>
                    <span className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Select Option</span>
                    <div className="flex flex-wrap gap-4">
                        {product.variants.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={`px-6 py-3 border text-sm uppercase tracking-wide transition-all ${selectedVariant.id === v.id
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-200 hover:border-black text-black'
                                    }`}
                            >
                                {v.quantity} {v.unit}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`
                    w-full py-4 px-8 font-bold text-sm uppercase tracking-widest text-white transition-all duration-200
                    ${isAdding
                        ? 'bg-gray-800'
                        : 'bg-black hover:bg-gray-900'
                    }
                `}
            >
                {isAdding ? "Added to Cart" : "Add to Cart"}
            </button>

            <div className="pt-8 border-t border-gray-100 flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>Secure Checkout</span>
                <span>Free Shipping &gt; ₹500</span>
                <span>Freshness Guaranteed</span>
            </div>
        </div>
    );
}

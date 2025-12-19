"use client";

import { useState } from "react";
import { Product } from "@/lib/storekit";
import { useCartStore } from "@/hooks/useCartStore";

export default function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product);

        // Simple visual feedback
        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`
        w-full py-4 px-8 font-bold text-sm uppercase tracking-widest text-white transition-all duration-200
        ${isAdding
                    ? 'bg-gray-800'
                    : 'bg-black hover:bg-gray-900 group-hover:bg-gray-900'
                }
      `}
        >
            {isAdding ? (
                <span className="flex items-center justify-center gap-2">
                    Added
                </span>
            ) : (
                "Add to Cart"
            )}
        </button>
    );
}

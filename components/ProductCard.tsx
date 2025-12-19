"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/storekit";

export default function ProductCard({ product }: { product: Product }) {
    const price = product.variants?.[0];
    // Fallback image if no media provided
    const imageUrl = product.image?.[0] || "https://placehold.co/600x400?text=No+Image";

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                {/* Main Image */}
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Secondary Image (if exists) reveals on hover - mocked for now or could use image[1] if available */}
                {product.image && product.image[1] && (
                    <Image
                        src={product.image[1]}
                        alt={product.name}
                        fill
                        className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                )}

                {product.hotSale && (
                    <span className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                        Hot
                    </span>
                )}
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-black tracking-tight leading-none mb-1 group-hover:underline decoration-1 underline-offset-4">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                        {product.category || "Sweet"}
                    </p>
                </div>
                <span className="text-lg font-medium text-black">
                    {price ? `₹${price.price}` : "N/A"}
                </span>
            </div>
        </Link>
    );
}

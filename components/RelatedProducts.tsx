import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/storekit";
import type { StorekitProduct } from "@/lib/types";

interface RelatedProductsProps {
    currentProductId: string;
}

export default async function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    // Fetch all products - assuming getProducts returns StorekitProduct[]
    const allProducts = await getProducts();

    // Filter out current product and randomly select 4
    const filteredProducts = allProducts.filter((p: StorekitProduct) => p.id !== currentProductId);
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
    const relatedProducts = shuffled.slice(0, 4);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-24 px-8 lg:px-24">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-16">
                    <h2 className="text-4xl lg:text-6xl font-bold text-black tracking-tighter leading-[0.9] mb-4">
                        You might also like
                    </h2>
                    <p className="text-gray-500 text-sm uppercase tracking-widest">
                        Handpicked selections
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {relatedProducts.map((product: StorekitProduct, index: number) => {
                        // Get default variant or first variant
                        const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];

                        // Get product image or placeholder
                        const productImage = product.image && product.image.length > 0
                            ? product.image[0]
                            : "https://placehold.co/400x500?text=No+Image";

                        // Calculate discounted price if discount exists
                        const discountedPrice = defaultVariant
                            ? defaultVariant.price * (1 - defaultVariant.discount / 100)
                            : 0;

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className={`group ${index >= 2 ? 'hidden lg:block' : ''}`}
                            >
                                <div className="relative aspect-[1/1] bg-gray-100 overflow-hidden mb-6">
                                    {/* Hot Sale Badge */}
                                    {product.hotSale && (
                                        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 text-xs uppercase tracking-wider">
                                            Hot Sale
                                        </div>
                                    )}

                                    {/* Discount Badge */}
                                    {defaultVariant && defaultVariant.discount > 0 && (
                                        <div className="absolute top-4 right-4 z-10 bg-black text-white px-3 py-1 text-xs uppercase tracking-wider">
                                            {defaultVariant.discount}% OFF
                                        </div>
                                    )}

                                    {/* Out of Stock Overlay */}
                                    {/* {defaultVariant && defaultVariant.stock === 0 && (
                                        <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                                            <span className="text-black font-bold text-sm uppercase tracking-wider">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )} */}

                                    {/* Product Image */}
                                    <Image
                                        src={productImage}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out aspect-[1/1]"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight text-black group-hover:text-gray-700 transition-colors">
                                        {product.name}
                                    </h3>

                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {product.description || "Handcrafted with perfection"}
                                    </p>

                                    {defaultVariant && (
                                        <div className="pt-2 space-y-1">
                                            {/* Price Display */}
                                            <div className="flex items-baseline gap-2">
                                                {defaultVariant.discount > 0 ? (
                                                    <>
                                                        <span className="text-lg font-semibold text-black">
                                                            ₹{discountedPrice.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ₹{defaultVariant.price.toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-semibold text-black">
                                                        ₹{defaultVariant.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Unit and Quantity Info */}
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                                {defaultVariant.quantity} {defaultVariant.unit}
                                            </p>

                                            {/* Low Stock Warning */}
                                            {defaultVariant.stock > 0 && defaultVariant.stock <= 5 && (
                                                <p className="text-xs text-red-500 font-medium">
                                                    Only {defaultVariant.stock} left in stock
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Link */}
                <div className="mt-16 text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500 hover:text-black transition-colors group"
                    >
                        <span>View all products</span>
                        <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
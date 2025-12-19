import { getProduct, getProducts } from "@/lib/storekit";
import AddToCartButton from "@/components/AddToCartButton";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";

export const revalidate = 60;

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;
        const product = await getProduct(id);

        if (!product) {
            console.warn(`[Metadata] Product not found: ${id}`);
            return {
                title: "Product Not Found",
                description: "The product you are looking for does not exist.",
                openGraph: {
                    title: "Product Not Found",
                    description: "The product you are looking for does not exist.",
                },
            };
        }

        return {
            title: product.name,
            description: product.description || `Buy ${product.name} - Handcrafted authentic Indian sweets.`,
            openGraph: {
                title: product.name,
                description: product.description || `Buy ${product.name} - Handcrafted authentic Indian sweets.`,
                url: `/products/${product.id}`,
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: product.description || `Buy ${product.name} - Handcrafted authentic Indian sweets.`,
            }
        };
    } catch (error) {
        console.error("[Metadata] Error generating metadata:", error);
        return {
            title: "Error",
            description: "An error occurred while loading the product.",
        };
    }
}

// Optional: specific static params generation for better build performance if product list is small
export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        id: product.id,
    }));
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    const price = defaultVariant;
    const images = product.image && product.image.length > 0
        ? product.image
        : ["https://placehold.co/800x600?text=No+Image"];

    return (
        <div className="min-h-screen bg-white">
            <div className="lg:grid lg:grid-cols-2">
                {/* Image Section - Sticky Desktop */}
                <div className="relative bg-gray-100 lg:h-screen lg:sticky lg:top-0">
                    <ProductGallery
                        images={images}
                        productName={product.name}
                        hotSale={product.hotSale}
                    />
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-24 flex flex-col justify-center min-h-[50vh]">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-4 mb-8 text-sm uppercase tracking-widest text-gray-500">
                            <Link href="/" className="hover:text-black transition-colors">Home</Link>
                            <span>/</span>
                            <span>{product.category || "Sweet"}</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-black mb-8 tracking-tighter leading-[0.9]">
                            {product.name}
                        </h1>



                        <div className="prose prose-lg text-gray-600 mb-12 leading-relaxed font-sans">
                            <p>{product.description || "A timeless classic, handcrafted with perfection."}</p>
                        </div>

                        <ProductActions product={product} />

                    </div>
                </div>
            </div>
        </div>
    );
}

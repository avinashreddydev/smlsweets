import { getProducts, getCategories } from "@/lib/storekit";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";

import Footer from "@/components/Footer";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const featuredProduct = products.length > 0 ? products[0] : null;

  return (
    <>
      <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">

        {/* Category Collections - International Grid */}
        {categories?.map((catData) => {
          const categoryName = catData.category;
          const categoryProducts = products.filter(
            (p) => p.category?.toLowerCase() === categoryName.toLowerCase()
          );

          if (categoryProducts.length === 0) return null;

          return (

            <section key={categoryName} className="py-24 px-4 sm:px-8 border-b border-black">
              <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-16">
                  <h2 className="text-4xl font-bold uppercase tracking-tighter leading-none">
                    {categoryName} <br /> Collection
                  </h2>
                  <p className="hidden md:block text-sm font-mono uppercase tracking-widest max-w-xs text-right">
                    Curated selection of <br />
                    finest {categoryName}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
                  {categoryProducts.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id} className="group block">
                      <div className="relative aspect-[1/1] bg-gray-100 mb-6 overflow-hidden">
                        <Image
                          src={product.image?.[0] || "https://placehold.co/600x800?text=No+Image"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Minimalist Price Tag */}
                        <div className="absolute top-4 right-4 bg-white px-3 py-1">
                          <span className="text-xs font-bold font-mono">
                            ₹{product.variants?.[0]?.price || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold uppercase tracking-tight mb-1 group-hover:underline decoration-2 underline-offset-4">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">
                            {product.variants?.[0]?.quantity} {product.variants?.[0]?.unit}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div >
      <Footer />
    </>
  );
}

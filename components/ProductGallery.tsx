"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

interface ProductGalleryProps {
    images: string[];
    productName: string;
    hotSale?: boolean;
}

export default function ProductGallery({ images, productName, hotSale }: ProductGalleryProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((api: any) => {
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="h-full flex flex-col">
            <div className="relative flex-1 bg-gray-100 overflow-hidden w-full aspect-[4/5] lg:aspect-auto group/gallery">
                {/* Embla Viewport */}
                <div className="absolute inset-0" ref={emblaRef}>
                    <div className="flex h-full">
                        {images.map((src, index) => (
                            <div key={index} className="relative w-full h-full flex-shrink-0 min-w-0">
                                <Image
                                    src={src}
                                    alt={`${productName} - View ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className="absolute left-0 top-0 bottom-0 px-4 hover:bg-black/5 transition-colors focus:outline-none flex items-center group/arrow z-10"
                            aria-label="Previous image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-transparent group-hover/gallery:text-black/50 group-hover/arrow:text-black transition-colors" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-0 top-0 bottom-0 px-4 hover:bg-black/5 transition-colors focus:outline-none flex items-center group/arrow z-10"
                            aria-label="Next image"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-transparent group-hover/gallery:text-black/50 group-hover/arrow:text-black transition-colors" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => scrollTo(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${selectedIndex === idx ? "bg-black scale-125" : "bg-black/20 hover:bg-black/40"
                                        }`}
                                    aria-label={`Go to image ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {hotSale && (
                    <div className="absolute top-8 left-8 bg-black text-white text-xs font-bold px-4 py-2 uppercase tracking-widest z-10 pointer-events-none">
                        Hot Sale
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="hidden lg:flex gap-4 p-6 bg-white border-t border-gray-100 overflow-x-auto">
                    {images.map((src, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`relative w-20 h-20 flex-shrink-0 transition-opacity ${selectedIndex === index ? "opacity-100 ring-1 ring-black" : "opacity-50 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={src}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

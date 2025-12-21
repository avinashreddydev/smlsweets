"use client";

import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import { useEffect, useState } from "react";
import { LoginButton } from "@/components/auth/PhoneLoginDrawer";


export default function Header() {
    const items = useCartStore((state) => state.items);
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tighter uppercase text-black hover:opacity-50 transition-opacity"
                >
                    SRI MAHALAKSHMI SWEETS
                </Link>

                <nav className="flex items-center gap-8">
                    <Link href="/about" className="hidden md:block text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                        About
                    </Link>


                    {/* Login / Profile Button */}
                    {mounted && (
                        user ? (
                            <Link href="/profile" className="text-sm font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors flex items-center gap-2">
                                <span className="hidden md:inline">Profile</span>
                                <span className="md:hidden">👤</span>
                            </Link>
                        ) : (

                            <LoginButton />
                            // <button
                            //     onClick={() => setView("login")}
                            //     className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors relative"
                            // >
                            //     Login
                            // </FamilyDrawerButton>
                        )
                    )}

                    <button
                        onClick={() => useCartStore.getState().openCart()}
                        className="relative group p-2 hover:opacity-50 transition-opacity"
                        aria-label="Shopping Cart"
                    >
                        <div className="flex items-center gap-2">

                            <div className="block text-black">
                                {/* Simple minimalist bag icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                            </div>
                        </div>
                        {
                            mounted && itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )
                        }
                    </button >
                </nav >
            </div >
        </header >
    );
}

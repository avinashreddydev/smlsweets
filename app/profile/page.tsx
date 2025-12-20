"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();


    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-[#FFFDF5] border-b border-black py-20 px-4 sm:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 relative">
                        <span className="relative z-10">My Account</span>
                        <div className="absolute -bottom-4 left-0 w-24 h-4 bg-yellow-400 -z-0" />
                    </h1>
                    <p className="text-xl font-mono uppercase tracking-widest text-gray-500">
                        Welcome back, <span className="text-black font-bold">+91 {user.phoneNumber}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="p-6 border border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-3xl">
                                👤
                            </div>
                            <h3 className="font-bold uppercase tracking-tight text-lg mb-1">{user.name}</h3>
                            <p className="text-sm text-gray-500 font-mono mb-6">+91 {user.phoneNumber}</p>

                            <button
                                onClick={() => {
                                    logout();
                                    router.push("/");
                                }}
                                className="w-full py-3 border-2 border-black font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        <nav className="space-y-4">
                            {['Orders', 'Addresses', 'Wishlist', 'Settings'].map((item) => (
                                <button
                                    key={item}
                                    className="block w-full text-left py-2 px-4 font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-yellow-400"
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-12">
                        {/* Orders Section */}
                        <section>
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                                Recent Orders
                                <span className="text-xs font-mono font-normal bg-black text-white px-2 py-1 rounded-full">0</span>
                            </h2>

                            <div className="border border-dashed border-gray-300 p-12 text-center rounded-lg">
                                <div className="text-4xl mb-4">📦</div>
                                <h3 className="font-bold uppercase tracking-wide mb-2">No orders yet</h3>
                                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                                    Start filling your bag with our handcrafted sweets.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-yellow-400 hover:text-black transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        </section>

                        {/* Account Details */}
                        <section>
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Account Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 border border-gray-200 hover:border-black transition-colors">
                                    <h4 className="font-bold uppercase tracking-wide text-xs text-gray-400 mb-2">Mobile Number</h4>
                                    <p className="font-mono text-lg">+91 {user.phoneNumber}</p>
                                </div>
                                <div className="p-6 border border-gray-200 hover:border-black transition-colors">
                                    <h4 className="font-bold uppercase tracking-wide text-xs text-gray-400 mb-2">Email Address</h4>
                                    <p className="font-mono text-lg text-gray-400 italic">Not set</p>
                                    <button className="text-xs font-bold uppercase tracking-widest mt-2 underline">Add Email</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

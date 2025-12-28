"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Clock, Home, MapPin, Package, Truck, Loader2 } from "lucide-react";
import { useComplaintStore } from "@/hooks/useComplaintStore";
import { use, useEffect, useState } from "react";

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // In a real scenario, we'd pass the ID: /api/orders/${id}
                // In a real scenario, we'd pass the ID: /api/orders?id=${id}
                const res = await fetch(`/api/orders?orderId=${id}`);
                if (!res.ok) throw new Error("Failed to fetch order");
                const data = await res.json();
                console.log(data);
                setOrder(data.data);
            } catch (err) {
                console.error(err);
                setError("Unable to load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount / 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-8 text-center text-black">
                <div className="relative mb-8">
                    <div className="w-16 h-16 border-4 border-black/10 rounded-full" />
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 animate-pulse">
                    Retrieving Order Details
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Please wait while we fetch your information
                </p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-8 text-center text-black">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
                    <Clock size={32} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-red-600">
                    {error || "Order Not Found"}
                </h2>
                <Link
                    href="/"
                    className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFDF5] text-black pt-20 lg:pt-32 pb-24 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-black/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-green-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                                <Check size={12} strokeWidth={3} />
                                {order.status}
                            </span>
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                                {formatDate(order.createdAt)}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Order #{order.orderNumber.split('-')[1]}
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-2">
                            ID: {order.orderId}
                        </p>
                    </div>

                    <Link href="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black/10 px-6 py-3 hover:bg-black hover:text-white transition-all">
                        <Home size={14} className="mb-0.5" />
                        Return Home
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Main Content - Items */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Tracker (Visual Only) */}
                        <div className="border border-black/10 p-8 bg-white/50 backdrop-blur-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Clock size={16} />
                                Order Status
                            </h3>
                            <div className="relative flex justify-between">
                                {/* Line */}
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />

                                {/* Steps */}
                                {["Placed", "Confirmed", "Shipped", "Delivered"].map((step, i) => {
                                    const active = i <= 1; // Mocking 'Confirmed' state
                                    return (
                                        <div key={step} className="flex flex-col items-center gap-3 bg-[#FFFDF5] px-2">
                                            <div className={`w-4 h-4 rounded-full border-2 ${active ? 'bg-black border-black' : 'bg-white border-gray-300'}`} />
                                            <span className={`text-[10px] uppercase font-bold tracking-wider ${active ? 'text-black' : 'text-gray-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Items List */}
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-black pb-4">
                                <Package size={16} />
                                Items ({order.items.length})
                            </h3>
                            <div className="space-y-6">
                                {order.items.map((item: any) => (
                                    <div key={item.productId} className="flex gap-6 group items-start">

                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h4 className="text-lg font-bold uppercase tracking-tight leading-none mb-1">
                                                        {item.productName}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                                                        {item.variantLabel} × {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold font-mono text-sm">
                                                        {formatMoney(item.lineTotal.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* Cost Summary */}

                            <h3 className="text-sm border-t border-black font-black uppercase tracking-widest my-4 pt-4">
                                Total
                            </h3>
                            <div className="space-y-3 font-mono text-xs uppercase text-gray-500 tracking-wide">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-black font-bold">{formatMoney(order.pricing.subtotal.amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>SGST</span>
                                    <span className="text-black font-bold">{formatMoney(order.pricing.sgst.amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>CGST</span>
                                    <span className="text-black font-bold">{formatMoney(order.pricing.cgst.amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-black font-bold">{formatMoney(order.pricing.deliveryFee.amount)}</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t-2 border-dashed border-black flex justify-between items-end">
                                <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
                                <span className="text-3xl font-black tracking-tighter">
                                    {formatMoney(order.pricing.grandTotal.amount)}
                                </span>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                    {order.payment.method} — {order.payment.status}
                                </span>

                            </div>
                        </div>



                    </div>

                    {/* Sidebar - Summary & Details */}
                    <div className="lg:col-span-4 space-y-8">



                        {/* Customer Details */}
                        <div className="border border-black/10 p-8 bg-gray-50">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-black/10 pb-4 flex items-center gap-2">
                                <MapPin size={16} />
                                Shipping To
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-bold uppercase tracking-tight text-sm mb-1">{order.customer.customerName}</p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide leading-relaxed">
                                        {order.shippingAddress.line1}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                        {order.shippingAddress.postal_code}<br />
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Contact</p>
                                    <p className="text-xs font-mono">{order.customer.customerEmail}</p>
                                    <p className="text-xs font-mono">{order.customer.customerNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="border border-black/10 p-8 bg-black text-white">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4">
                                Need Help?
                            </h3>
                            <p className="text-xs text-gray-400 mb-4 leading-relaxed font-medium">
                                Have an issue with your order? Our support team is here to help you.
                            </p>
                            <button onClick={() => useComplaintStore.getState().openComplaint()} className="block w-full bg-white text-black text-center py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

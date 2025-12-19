import Link from "next/link";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-24 lg:py-32">
                <div className="grid md:grid-cols-[200px_1fr] gap-12">
                    {/* Sidebar Navigation */}
                    <nav className="hidden md:block">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6 border-b border-black pb-2">Legal</h3>
                        <ul className="space-y-3 text-sm font-bold">
                            <li><Link href="/T&C" className="text-black hover:underline decoration-2">Terms & Conditions</Link></li>
                            <li><Link href="/privacy_policy" className="text-black hover:underline decoration-2">Privacy Policy</Link></li>
                            <li><Link href="/return_policy" className="text-black hover:underline decoration-2">Return Policy</Link></li>
                            <li><Link href="/refund_policy" className="text-black hover:underline decoration-2">Refund Policy</Link></li>
                            <li><Link href="/shipping_policy" className="text-black hover:underline decoration-2">Shipping Policy</Link></li>
                        </ul>
                    </nav>

                    {/* Content Area */}
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

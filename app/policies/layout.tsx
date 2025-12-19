import Link from "next/link";

export default function PoliciesLayout({
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
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Legal</h3>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/policies/terms_conditions" className="hover:underline">Terms & Conditions</Link></li>
                            <li><Link href="/policies/privacy_policy" className="hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/policies/return_policy" className="hover:underline">Return Policy</Link></li>
                            <li><Link href="/policies/refund_policy" className="hover:underline">Refund Policy</Link></li>
                            <li><Link href="/policies/shipping_policy" className="hover:underline">Shipping Policy</Link></li>
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

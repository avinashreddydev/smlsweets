export default function Footer() {
    return (
        <footer className="bg-black text-white py-32 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-3xl font-bold mb-6 tracking-tight">
                        SRI<br />
                        MAHA<br />
                        LAKSHMI SWEETS
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg max-w-md">
                        We believe in the purity of ingredients. No preservatives. No shortcuts. Just the finest ghee, saffron, and nuts, crafted with techniques passed down through generations.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm uppercase tracking-widest text-gray-500">
                    <div>
                        <span className="block text-white mb-2">Location</span>
                        <a
                            href="https://maps.app.goo.gl/Ayk32poaiPL1Ldau8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors block"
                        >
                            Naidupet, Guntur,<br />
                            Andhra Pradesh 522007,<br />
                            India
                        </a>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                        <span className="block text-white mb-2">Contact</span>
                        <a href="tel:+919948819097" className="block hover:text-white transition-colors mb-1">
                            +91 99488 19097
                        </a>
                        <a href="mailto:hello@smlsweets.com" className="block hover:text-white transition-colors break-all">
                            hello@smlsweets.com
                        </a>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                        <span className="block text-white mb-2">Legal</span>
                        <ul className="space-y-1">
                            <li><a href="/T&C" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                            <li><a href="/privacy_policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/return_policy" className="hover:text-white transition-colors">Return Policy</a></li>
                            <li><a href="/refund_policy" className="hover:text-white transition-colors">Refund Policy</a></li>
                            <li><a href="/shipping_policy" className="hover:text-white transition-colors">Shipping Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}
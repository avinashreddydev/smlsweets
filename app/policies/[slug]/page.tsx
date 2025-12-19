import { notFound } from "next/navigation";

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return [
        { slug: "terms_conditions" },
        { slug: "privacy_policy" },
        { slug: "return_policy" },
        { slug: "refund_policy" },
        { slug: "shipping_policy" },
    ];
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const title = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return {
        title: `${title} | Sri Mahalakshmi Sweets`,
    };
}

const POLICIES: Record<string, { title: string; content: string }> = {
    "terms_conditions": {
        title: "Terms & Conditions",
        content: `
            <p>Welcome to Sri Mahalakshmi Sweets. By accessing our website, you agree to these terms and conditions. Please read them carefully.</p>
            <h3>1. General</h3>
            <p>Sri Mahalakshmi Sweets is situated at Naidupet, Guntur, Andhra Pradesh 522007, India. We are the bearer of GST Number: <strong>[GST_IN_PLACEHOLDER]</strong>. These terms govern your use of our website and purchase of products.</p>
            <h3>2. Products</h3>
            <p>We ensure that all our sweets and savouries are handcrafted with the finest ingredients. However, due to the artisanal nature of our products, slight variations in appearance may occur.</p>
            <h3>3. Orders & Payments</h3>
            <p>All orders are subject to acceptance and availability. Prices are inclusive of applicable taxes.</p>
            <h3>4. Intellectual Property</h3>
            <p>All content on this website, including text, graphics, logos, and images, is the property of Sri Mahalakshmi Sweets.</p>
        `
    },
    "privacy_policy": {
        title: "Privacy Policy",
        content: `
            <p>At Sri Mahalakshmi Sweets, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p>
            <h3>1. Information Collection</h3>
            <p>We collect information such as your name, address, email, and phone number when you place an order or sign up for our newsletter.</p>
            <h3>2. Use of Information</h3>
            <p>Your information is used strictly for processing orders, improving our services, and communicating with you regarding your purchases.</p>
            <h3>3. Data Security</h3>
            <p>We implement robust security measures to protect your data. We do not sell or share your personal information with third parties for marketing purposes.</p>
            <h3>4. Contact</h3>
            <p>For privacy concerns, please contact us at hello@smlsweets.com.</p>
        `
    },
    "return_policy": {
        title: "Return Policy",
        content: `
            <p>Sri Mahalakshmi Sweets strives to provide the highest quality products. Due to the perishable nature of food items, the following return policy applies:</p>
            <h3>1. Perishable Goods</h3>
            <p>We do not accept returns on sweets, savouries, or other perishable food items once delivered, except in cases of damage or incorrect delivery.</p>
            <h3>2. Damaged Items</h3>
            <p>If you receive a damaged or tampered package, please contact us immediately at +91 99488 19097 or hello@smlsweets.com with photographic evidence within 24 hours of delivery.</p>
        `
    },
    "refund_policy": {
        title: "Refund Policy",
        content: `
            <p>We value your satisfaction. Our refund policy is as follows:</p>
            <h3>1. Eligibility</h3>
            <p>Refunds are initiated only for orders where the product is proven to be damaged, spoiled during transit, or if the wrong item was delivered.</p>
            <h3>2. Process</h3>
            <p>Once your claim is validated, we will initiate a refund to your original method of payment. Please allow 5-7 business days for the transaction to reflect.</p>
            <h3>3. Cancellations</h3>
            <p>Orders can only be cancelled within 1 hour of placement. Once processed, orders cannot be cancelled or refunded.</p>
        `
    },
    "shipping_policy": {
        title: "Shipping Policy",
        content: `
            <p>We deliver authentic Guntur sweets worldwide.</p>
            <h3>1. Domestic Shipping</h3>
            <p>We ship across India via standard courier partners. Delivery typically takes 2-5 business days depending on the location.</p>
            <h3>2. International Shipping</h3>
            <p>International orders are shipped via express logistics. Delivery times vary by country and customs clearance.</p>
            <h3>3. Packaging</h3>
            <p>All items are packed securely to ensure freshness and prevent damage during transit.</p>
            <h3>4. Tracking</h3>
            <p>Once shipped, you will receive a tracking number via email/SMS to monitor your package.</p>
        `
    }
};

export default async function PolicyPage({ params }: Props) {
    const { slug } = await params;
    const policy = POLICIES[slug];

    if (!policy) {
        notFound();
    }

    return (
        <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-p:text-gray-600 prose-li:text-gray-600">
            <h1 className="text-4xl font-black mb-12 border-b border-black pb-8">{policy.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: policy.content }} />

            <div className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
                <p>
                    <strong>Sri Mahalakshmi Sweets</strong><br />
                    Naidupet, Guntur, Andhra Pradesh 522007, India<br />
                    GST IN: [GST_IN_PLACEHOLDER]
                </p>
            </div>
        </article>
    );
}

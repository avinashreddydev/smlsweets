import { Metadata } from "next";
import { PolicyPageContent } from "@/components/PolicyPageContent";

export const metadata: Metadata = {
    title: "Shipping Policy | Sri Mahalakshmi Sweets",
};

export default function ShippingPage() {
    return <PolicyPageContent policyKey="shipping-policy" />;
}

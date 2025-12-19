import { Metadata } from "next";
import { PolicyPageContent } from "@/components/PolicyPageContent";

export const metadata: Metadata = {
    title: "Refund Policy | Sri Mahalakshmi Sweets",
};

export default function RefundPage() {
    return <PolicyPageContent policyKey="refund-policy" />;
}

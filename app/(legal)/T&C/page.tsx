import { Metadata } from "next";
import { PolicyPageContent } from "@/components/PolicyPageContent";

export const metadata: Metadata = {
    title: "Terms & Conditions | Sri Mahalakshmi Sweets",
};

export default function TermsPage() {
    return <PolicyPageContent policyKey="terms-conditions" />;
}

import { Metadata } from "next";
import { PolicyPageContent } from "@/components/PolicyPageContent";

export const metadata: Metadata = {
    title: "Privacy Policy | Sri Mahalakshmi Sweets",
};

export default function PrivacyPage() {
    return <PolicyPageContent policyKey="privacy-policy" />;
}

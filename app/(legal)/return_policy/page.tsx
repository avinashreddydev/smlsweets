import { Metadata } from "next";
import { PolicyPageContent } from "@/components/PolicyPageContent";

export const metadata: Metadata = {
    title: "Return Policy | Sri Mahalakshmi Sweets",
};

export default function ReturnPage() {
    return <PolicyPageContent policyKey="return-policy" />;
}

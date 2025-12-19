import { notFound } from "next/navigation";
import { POLICIES } from "@/lib/policy-content";

interface PolicyPageProps {
    policyKey: string;
}

export function PolicyPageContent({ policyKey }: PolicyPageProps) {
    const policy = POLICIES[policyKey];

    if (!policy) {
        notFound();
    }

    return (
        <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
            <h1 className="text-4xl font-black mb-12 border-b border-black pb-8 text-black">{policy.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: policy.content }} />

            <div className="mt-16 pt-8 border-t border-black text-sm text-black">
                <p>
                    <strong>Sri Mahalakshmi Sweets</strong><br />
                    Naidupet, Guntur, Andhra Pradesh 522007, India<br />
                    GST IN: [GST_IN_PLACEHOLDER]
                </p>
            </div>
        </article>
    );
}

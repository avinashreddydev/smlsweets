"use client";

import ComplaintChat from "@/components/ComplaintChat";
import { useParams } from "next/navigation";

export default function ComplaintPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-8rem)]">
            <div className="bg-white border border-black/10 shadow-xl rounded-2xl overflow-hidden h-full flex flex-col">
                {/* Desktop Page Header */}
                <div className="bg-[#FFFDF5] border-b border-black/10 p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-tight text-black">Support Ticket</h1>
                        <p className="text-sm text-gray-500 mt-1">Ref: #{id}</p>
                    </div>
                    {/* Status badge maybe? */}
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest rounded-full">
                        Open
                    </span>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 overflow-hidden">
                    <ComplaintChat complaintId={id} />
                </div>
            </div>
        </div>
    );
}
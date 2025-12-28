"use client";

import { Send, Paperclip, Smile } from "lucide-react";
import { useEffect, useRef } from "react";

interface ComplaintChatProps {
    complaintId: string | null;
}

export default function ComplaintChat({ complaintId }: ComplaintChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat on mount and viewport resize
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();

        const handleResize = () => {
            // Tiny timeout to allow layout to settle
            setTimeout(scrollToBottom, 100);
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", handleResize);
        }
        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#FFFDF5]">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f8f8]">
                {/* Mock Messages */}
                <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                        <p className="text-sm text-gray-800">Hello! How can we help you with your order today?</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">10:00 AM</span>
                    </div>
                </div>

                <div className="flex justify-center my-4">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest text-[10px]">Today</span>
                </div>

                {/* Helper div to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input Area */}
            <div className="p-4 bg-white border-t border-black/10">
                <form className="flex gap-2 items-center" onSubmit={(e) => e.preventDefault()}>
                    <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                        />
                        <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Smile size={18} />
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

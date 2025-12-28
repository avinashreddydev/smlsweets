"use client";

import { useComplaintStore } from "@/hooks/useComplaintStore";
import { Drawer } from "vaul";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import { Link, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ComplaintChat from "./ComplaintChat";
import { useAuthStore } from "@/hooks/useAuthStore";
import { usePreventScroll } from "@/hooks/usePreventScroll";

const messages = [
    { "role": "ai", "content": "Hello, how can I help you?" },
    { "role": "user", "content": "I want to complain about the product." },

    { "role": "ai", "content": "I'm sorry to hear that. Could you please tell me what went wrong with the product?" },
    { "role": "user", "content": "The product I received is damaged and not working properly." },

    { "role": "ai", "content": "That's frustrating. May I know when you purchased the product and your order ID?" },
    { "role": "user", "content": "I purchased it three days ago. My order ID is ORD12345." },

    { "role": "ai", "content": "Thank you for the details. Did the damage occur during delivery, or was it defective when you opened it?" },
    { "role": "user", "content": "It was already damaged when I opened the package." },

    { "role": "ai", "content": "I understand. I've registered your complaint and our support team will contact you shortly to arrange a replacement or refund." }
];

export default function ComplaintsDrawer() {
    const { isComplaintOpen, closeComplaint, activeComplaintId } = useComplaintStore();
    const { user } = useAuthStore();

    const { width, height } = useWindowSize();

    const [chatMessages, setChatMessages] = useState(messages);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Use robust scroll prevention (handles iOS keyboard quirks)
    usePreventScroll({ isDisabled: !isComplaintOpen });

    // Handle mobile keyboard height adjustment
    const drawerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll helper
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { role: "user", content: inputValue.trim() };
        setChatMessages(prev => [...prev, userMsg]);
        setInputValue("");
        scrollToBottom();

        // Keep focus
        setTimeout(() => {
            inputRef.current?.focus();
        }, 10);

        // Simulate AI response
        setIsTyping(true);
        setTimeout(() => {
            const aiMsg = {
                role: "ai",
                content: "i am a dummy assistant, not yet production, will talk to you soon"
            };
            setChatMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
            scrollToBottom();
        }, 1500);
    };

    useEffect(() => {
        if (isComplaintOpen) {
            scrollToBottom();
            // Focus on open
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isComplaintOpen]);

    useEffect(() => {
        if (!isComplaintOpen) return;

        const handleResize = () => {
            if (window.visualViewport && drawerRef.current) {
                const visualViewportHeight = window.visualViewport.height;
                // Calculate difference to position right above keyboard
                // window.innerHeight is the full layout height.
                // visualViewport.height is the visible area.
                // The difference is essentially the keyboard height (plus top bars if any).
                const diffFromInitial = window.innerHeight - visualViewportHeight;

                // Set height to the visual viewport height
                drawerRef.current.style.height = `${visualViewportHeight}px`;
                // Set bottom to the difference (keyboard height) so it acts as "pushed up"
                // Max(0) ensures we don't go negative
                drawerRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;

                // Auto scroll on resize
                scrollToBottom();
            }
        };

        if (window.visualViewport) {
            handleResize(); // Set initial
            window.visualViewport.addEventListener("resize", handleResize);
            window.visualViewport.addEventListener("scroll", handleResize);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", handleResize);
                window.visualViewport.removeEventListener("scroll", handleResize);
            }
        };
    }, [isComplaintOpen]);

    return (
        <AnimatePresence>
            {isComplaintOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeComplaint}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm dvh"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        // Removed top-0 and added bottom-0 as base. 
                        // The inline styles will override height and bottom position.
                        className="fixed right-0 w-full md:w-[450px] bg-[#FFFDF5] z-[70] shadow-2xl flex flex-col border-l border-black/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-black/10">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-black">Support Chat</h2>
                            <button
                                onClick={closeComplaint}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors text-black"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 space-y-4 py-6">
                            {chatMessages.map((msg, index) => {
                                const isAi = msg.role === "ai";
                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}
                                    >
                                        <div
                                            className={`
                                                max-w-[85%] p-4 text-sm font-medium leading-relaxed
                                                ${isAi
                                                    ? "bg-white border border-black/5 text-black rounded-2xl rounded-tl-none shadow-sm"
                                                    : "bg-black text-white rounded-2xl rounded-tr-none shadow-sm"
                                                }
                                            `}
                                        >
                                            <p>{msg.content}</p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-2 px-1">
                                            {isAi ? "Agent" : "You"}
                                        </span>
                                    </div>
                                );
                            })}
                            {isTyping && (
                                <div className="flex flex-col items-start">
                                    <div className="bg-white border border-black/5 text-black rounded-2xl rounded-tl-none shadow-sm p-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-6 border-t border-black/10 bg-white/80 backdrop-blur-md sticky bottom-0 z-10 w-full">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 border border-black/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black text-base bg-white placeholder:text-gray-400 font-medium"
                                />
                                <button
                                    onMouseDown={(e) => e.preventDefault()}
                                    onTouchStart={(e) => e.preventDefault()}
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="w-12 h-12 flex-shrink-0 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
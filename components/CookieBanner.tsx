"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already accepted cookies
        const hasAccepted = localStorage.getItem("cookie_consent")
        if (!hasAccepted) {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const acceptCookies = () => {
        localStorage.setItem("cookie_consent", "true")
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="mx-auto max-w-screen-xl bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 md:flex items-center justify-between gap-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-wider">Cookie Policy</h3>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-prose">
                        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our{" "}
                        <Link href="/privacy_policy" className="underline underline-offset-2 hover:text-black text-gray-900 font-bold">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
                <div className="mt-6 md:mt-0 flex items-center gap-4 shrink-0">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black px-4 py-2"
                    >
                        Decline
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}

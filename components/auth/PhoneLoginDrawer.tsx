"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    File,
    Image,
    Trash,
    Upload,
    XCircle,
} from "lucide-react"

import { Phone, Lock } from "lucide-react"
import { z } from "zod"
import {
    FamilyDrawerAnimatedContent,
    FamilyDrawerAnimatedWrapper,
    FamilyDrawerButton,
    FamilyDrawerClose,
    FamilyDrawerContent,
    FamilyDrawerHeader,
    FamilyDrawerOverlay,
    FamilyDrawerPortal,
    FamilyDrawerRoot,
    FamilyDrawerSecondaryButton,
    FamilyDrawerTrigger,
    FamilyDrawerViewContent,
    useFamilyDrawer,
    type ViewsRegistry,
} from "@/components/ui/family-drawer";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Drawer } from "vaul";

// ============================================================================
// Example 2: Custom Views via Props
// ============================================================================

const phoneSchema = z.string().length(10, "Phone number must be exactly 10 digits")

function CustomDefaultView() {
    const { setView } = useFamilyDrawer()
    const phoneId = useId()
    const [error, setError] = useState<string | null>(null)
    const { phoneNumber, setPhoneNumber } = useAuthStore()

    const handleGetOTP = () => {
        const result = phoneSchema.safeParse(phoneNumber)
        console.log(result)
        if (result.success) {
            setError(null)
            setView("otp")
        } else {
            setError(result.error.issues[0].message)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
        if (error) setError(null)
    }

    return (
        <div>
            <div className="px-2 pl-2">
                <div className="mt-4 space-y-4 pt-2">
                    <div>
                        <label
                            htmlFor={phoneId}
                            className="text-[15px] font-semibold text-foreground md:font-medium"
                        >
                            Enter your phone number
                        </label>
                        <input
                            id={phoneId}
                            type="text"
                            inputMode="numeric"
                            placeholder="Phone Number"
                            maxLength={10}
                            minLength={10}
                            onChange={handleChange}
                            value={phoneNumber}
                            className={`mt-4 w-full text-3xl font-mono rounded-lg border px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-black/5 ${error ? "border-red-500" : "border-border"}`}
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-7">
                <FamilyDrawerSecondaryButton
                    onClick={handleGetOTP}
                    className="w-full bg-black text-white hover:bg-black/90"
                >
                    Get OTP
                </FamilyDrawerSecondaryButton>
            </div>
        </div>
    )
}

const SuccessView = () => {
    const { login, phoneNumber } = useAuthStore()

    const handleClose = () => {
        login(phoneNumber)
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Login Successful!</h3>
            <p className="mb-8 text-muted-foreground">
                You have successfully logged in with +91 {phoneNumber}
            </p>
            <FamilyDrawerSecondaryButton
                onClick={handleClose}
                className="w-full bg-black text-white hover:bg-black/90"
            >
                Continue
            </FamilyDrawerSecondaryButton>
        </div>
    )
}

function OTPView() {
    const { setView } = useFamilyDrawer()
    const { login, phoneNumber } = useAuthStore()
    const otpId = useId()

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // slight delay to ensure animation has started/layout is ready
        const timer = setTimeout(() => {
            inputRef.current?.focus()
        }, 50)
        return () => clearTimeout(timer)
    }, [])

    const handleVerify = () => {
        setView("success")
    }

    return (
        <div>
            <div className="px-2">
                <div className="mt-0 space-y-4 pt-2">
                    <div>
                        <label
                            htmlFor={otpId}
                            className="text-normal font-semibold text-foreground md:font-medium"
                        >
                            Enter 4-digit code sent to
                            <br />
                            {`+91 ${phoneNumber}`}
                        </label>
                        <div className="mt-2">
                            <input
                                ref={inputRef}
                                id={otpId}
                                autoFocus
                                type="text"
                                inputMode="numeric"
                                placeholder="1234"
                                maxLength={4}
                                className="w-full text-center text-3xl tracking-[1em] font-mono rounded-lg border border-border py-3 bg-background focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-7 flex gap-4">
                    <FamilyDrawerSecondaryButton
                        onClick={() => setView("default")}
                        className="bg-gray-200 text-black/50 hover:bg-gray-400 text-black"
                    >
                        Back
                    </FamilyDrawerSecondaryButton>
                    <FamilyDrawerSecondaryButton
                        onClick={handleVerify}
                        className="bg-black text-white hover:bg-black/90"
                    >
                        Verify
                    </FamilyDrawerSecondaryButton>
                </div>
            </div>
        </div>
    )
}

const customViews: ViewsRegistry = {
    default: CustomDefaultView,
    otp: OTPView,
    success: SuccessView
}





const LoginButton = () => {
    return (
        <FamilyDrawerRoot views={customViews}>
            <FamilyDrawerTrigger className="!relative !top-auto !left-auto !-translate-y-0 !-translate-x-0 block h-[44px] !border-none !bg-transparent !font-bold px-4 py-2 font-medium text-foreground transition-colors hover:bg-accent  focus-visible:shadow-focus-ring-button md:font-medium cursor-pointer text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors relative">
                LOGIN
            </FamilyDrawerTrigger>
            <FamilyDrawerPortal>
                <FamilyDrawerOverlay />
                <FamilyDrawerContent>
                    <div className="sr-only">
                        <Drawer.Title>Phone Login</Drawer.Title>
                        <Drawer.Description>Login with your phone number</Drawer.Description>
                    </div>
                    <FamilyDrawerClose />
                    <FamilyDrawerAnimatedWrapper>
                        <FamilyDrawerAnimatedContent>
                            <FamilyDrawerViewContent />
                        </FamilyDrawerAnimatedContent>
                    </FamilyDrawerAnimatedWrapper>
                </FamilyDrawerContent>
            </FamilyDrawerPortal>
        </FamilyDrawerRoot>
    );
}


export { LoginButton };

"use client"

import { useId } from "react"
import { Phone, Lock } from "lucide-react"

import {
    FamilyDrawerAnimatedContent,
    FamilyDrawerAnimatedWrapper,
    FamilyDrawerClose,
    FamilyDrawerContent,
    FamilyDrawerHeader,
    FamilyDrawerOverlay,
    FamilyDrawerPortal,
    FamilyDrawerRoot,
    FamilyDrawerSecondaryButton,
    FamilyDrawerViewContent,
    useFamilyDrawer,
    type ViewsRegistry,
} from "@/components/ui/family-drawer"
import { useAuthStore } from "@/hooks/useAuthStore"

function PhoneNumberInputView() {
    const { setView } = useFamilyDrawer()
    const { phoneNumber, setPhoneNumber, setStep } = useAuthStore()
    const inputId = useId()

    const handleGetOTP = () => {
        if (phoneNumber.length === 10) {
            setStep('OTP')
            setView("otp")
        }
    }

    return (
        <div>
            <div className="px-2">
                <FamilyDrawerHeader
                    icon={<Phone className="size-8" />}
                    title="Phone Number"
                    description="Enter your phone number to login."
                />
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-6">
                <div>
                    <label
                        htmlFor={inputId}
                        className="text-[15px] font-semibold text-foreground md:font-medium"
                    >
                        Phone Number
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                            <span>🇮🇳</span>
                            <span>+91</span>
                        </div>
                        <input
                            id={inputId}
                            type="tel"
                            placeholder="98765 43210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="flex-1 rounded-lg border border-border px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
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

function OTPView() {
    const { setView } = useFamilyDrawer()
    const { login, phoneNumber, closeAuth } = useAuthStore()
    const otpId = useId()

    const handleVerify = () => {
        login(phoneNumber)
        // Additional cleanup managed by store, but we can animate out here
        // The store's 'isOpen' will false, which closes the drawer
    }

    return (
        <div>
            <div className="px-2">
                <FamilyDrawerHeader
                    icon={<Lock className="size-8" />}
                    title="OTP Verification"
                    description={`Enter 4-digit code sent to +91 ${phoneNumber}`}
                />
            </div>
            <div className="mt-6 space-y-4 border-t border-border pt-6">
                <div>
                    <label
                        htmlFor={otpId}
                        className="text-[15px] font-semibold text-foreground md:font-medium"
                    >
                        Enter OTP
                    </label>
                    <div className="mt-2">
                        <input
                            id={otpId}
                            type="text"
                            inputMode="numeric"
                            placeholder="1234"
                            maxLength={4}
                            className="w-full text-center text-2xl tracking-[1em] font-mono rounded-lg border border-border px-3 py-4 bg-background focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-7 flex gap-4">
                <FamilyDrawerSecondaryButton
                    onClick={() => setView("default")}
                    className="flex-1 bg-gray-100 text-gray-900 hover:bg-gray-200"
                >
                    Back
                </FamilyDrawerSecondaryButton>
                <FamilyDrawerSecondaryButton
                    onClick={handleVerify}
                    className="flex-1 bg-black text-white hover:bg-black/90"
                >
                    Verify
                </FamilyDrawerSecondaryButton>
            </div>
        </div>
    )
}

const PhoneLoginViews: ViewsRegistry = {
    default: PhoneNumberInputView,
    otp: OTPView
}

import { Drawer } from "vaul"

// NOTE: This drawer is completely controlled by the useAuthStore
export function PhoneLoginDrawer() {
    const { isOpen, closeAuth, step } = useAuthStore()

    // Determine default view based on store state if needed, though 'default' is usually safer start logic
    // We can rely on 'setView' inside the components to navigate.

    return (
        <FamilyDrawerRoot
            views={PhoneLoginViews}
            defaultView={step === 'OTP' ? 'otp' : 'default'}
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) closeAuth()
            }}
        >
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
    )
}

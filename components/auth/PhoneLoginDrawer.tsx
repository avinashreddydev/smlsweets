"use client"

import { useState, useId } from "react"
import { Phone, Lock } from "lucide-react"
import { z } from "zod"

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

const phoneSchema = z.string().length(10, "Phone number must be exactly 10 digits")

function PhoneNumberInputView() {
    const { setView } = useFamilyDrawer()
    const { phoneNumber, setPhoneNumber, setStep } = useAuthStore()
    const inputId = useId()
    const [error, setError] = useState<string | null>(null)

    const handleGetOTP = () => {
        const result = phoneSchema.safeParse(phoneNumber)

        if (result.success) {
            setError(null)
            setStep('OTP')
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


            <div className="mt-6 space-y-4  ">
                <div>
                    {/* <FamilyDrawerHeader
                        title="Phone Number"
                        description="Enter your phone number to login."
                        icon={<Phone className="size-4 text-black" />}
                        className="m-0 space-y-1  text-sm "
                    /> */}

                    <h2 className="text-2xl font-bold">Enter Phone Number</h2>
                </div>

                <div className="mt-2 space-y-1">
                    <div>
                        <div className="">
                            <input
                                id={inputId}
                                type="text"
                                inputMode="numeric"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={handleChange}
                                maxLength={10}
                                minLength={10}
                                className={`w-full px-3 text-3xl font-mono rounded-lg border py-3 bg-background focus:outline-none focus:ring-2 focus:ring-black/5 ${error ? "border-red-500" : "border-border"
                                    }`}
                            />
                        </div>
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

function OTPView() {
    const { setView } = useFamilyDrawer()
    const { login, phoneNumber, setStep } = useAuthStore()
    const otpId = useId()

    const handleVerify = () => {
        login(phoneNumber)
        // Additional cleanup managed by store, but we can animate out here
        // The store's 'isOpen' will false, which closes the drawer
    }

    return (
        <div>
            <div className="mt-2 space-y-4 ">
                <div>
                    <label
                        htmlFor={otpId}
                        className="text-xl font-semibold text-foreground md:font-medium"
                    >
                        Enter 4-digit code sent to
                        <br />
                        {`+91 ${phoneNumber}`}
                    </label>
                    <div className="mt-2">
                        <input
                            id={otpId}
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
                    onClick={() => {
                        setStep("PHONE")
                        setView("default")
                    }}
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

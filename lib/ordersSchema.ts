import { z } from "zod";

/**
 * -----------------------------
 * Helpers
 * -----------------------------
 */
export const CurrencyCodeSchema = z.string().min(3).max(3); // e.g. "INR"

export const MoneySchema = z
    .object({
        amount: z.number().int().nonnegative(), // minor units (paise)
        currency: CurrencyCodeSchema,
    })
    .strict();

export const ISODateTimeSchema = z.string().datetime({ offset: true }); // "2025-12-23T15:11:30.000Z"

/**
 * -----------------------------
 * Notes
 * -----------------------------
 */
export const CustomerNoteSchema = z
    .object({
        message: z.string().min(1),
        at: ISODateTimeSchema,
    })
    .strict();

export const InternalNoteSchema = z
    .object({
        message: z.string().min(1),
        at: ISODateTimeSchema,
        storeId: z.string().min(1),
        userId: z.string().min(1),
    })
    .strict();

export const OrderNotesSchema = z
    .object({
        customerNotes: z.array(CustomerNoteSchema).default([]),
        internalNotes: z.array(InternalNoteSchema).default([]),
    })
    .strict();

/**
 * -----------------------------
 * Items
 * -----------------------------
 */
export const OrderItemSchema = z
    .object({
        productId: z.string().min(1),
        productSlug: z.string().min(1),
        productName: z.string().min(1),

        variantId: z.string().min(1),
        variantLabel: z.string().min(1),

        sku: z.string().min(1),
        quantity: z.number().int().positive(),

        unitPrice: MoneySchema,
        discount: MoneySchema,
        tax: MoneySchema,
        lineTotal: MoneySchema,

        imageUrl: z.string().url(),

        // Item-level notes
        customerItemNotes: z.array(CustomerNoteSchema).default([]),
        internalItemNotes: z.array(InternalNoteSchema).default([]),

        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict();

/**
 * -----------------------------
 * Customer
 * -----------------------------
 */
export const CustomerSchema = z
    .object({
        customerId: z.string().min(1),
        customerName: z.string().min(1),
        customerNumber: z.string().min(1),
        customerEmail: z.string().email().optional(),
    })
    .strict();

/**
 * -----------------------------
 * Pricing / Discounts
 * -----------------------------
 */
export const AppliedDiscountSchema = z
    .object({
        type: z.enum(["COUPON", "PROMOTION", "MANUAL", "OTHER"]).default("OTHER"),
        code: z.string().nullable(),
        title: z.string().nullable(),
        amount: MoneySchema,
        scope: z.enum(["ORDER", "ITEM"]),
        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict();

export const PricingSchema = z
    .object({
        currency: CurrencyCodeSchema,

        subtotal: MoneySchema,
        itemDiscountTotal: MoneySchema,
        couponDiscountTotal: MoneySchema,

        packingFee: MoneySchema,
        deliveryFee: MoneySchema,

        taxTotal: MoneySchema,
        roundingAdjustment: MoneySchema,

        grandTotal: MoneySchema,

        appliedDiscounts: z.array(AppliedDiscountSchema).default([]),

        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict();

/**
 * -----------------------------
 * Payment / Refunds
 * -----------------------------
 */
export const RefundSchema = z
    .object({
        refundId: z.string().min(1),
        status: z
            .enum(["NONE", "PENDING", "PROCESSED", "FAILED", "CANCELLED"])
            .default("NONE"),
        amount: MoneySchema,

        providerRefundId: z.string().nullable(),
        reason: z.string().nullable(),
        processedAt: ISODateTimeSchema.nullable(),

        storeId: z.string().min(1),
        userId: z.string().min(1),

        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict();

export const PaymentSchema = z
    .object({
        method: z.enum(["COD", "ONLINE", "UPI", "CARD", "NETBANKING"]).default("COD"),
        status: z
            .enum(["NOT_REQUIRED", "PENDING", "PAID", "FAILED", "REFUNDED"])
            .default("NOT_REQUIRED"),

        amountDue: MoneySchema,
        amountPaid: MoneySchema,

        provider: z.string().nullable(),
        providerPaymentId: z.string().nullable(),
        providerOrderId: z.string().nullable(),

        paymentLink: z.string().url().nullable(),
        upiQrImageUrl: z.string().url().nullable(),
        upiDeepLink: z.string().url().nullable(),

        paidAt: ISODateTimeSchema.nullable(),
        failedAt: ISODateTimeSchema.nullable(),

        refunds: z.array(RefundSchema).default([]),

        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict();

/**
 * -----------------------------
 * Order
 * -----------------------------
 */
export const OrderStatusSchema = z.enum([
    "PLACED",
    "CONFIRMED",
    "IN_KITCHEN",
    "READY",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "FAILED",
    "REFUNDED",
]);

export const FulfillmentTypeSchema = z.enum(["ASAP", "SCHEDULED", "PERIODICAL"]);

export const OrderSchema = z
    .object({
        orderId: z.string().min(1),
        orderNumber: z.string().min(1),

        customer: CustomerSchema,

        status: OrderStatusSchema,
        fulfillmentType: FulfillmentTypeSchema,

        items: z.array(OrderItemSchema).min(1),

        // Order-level notes
        orderNotes: OrderNotesSchema,

        pricing: PricingSchema,
        payment: PaymentSchema,

        deliveryId: z.string().nullable(),

        complaintIds: z.array(z.string().min(1)).default([]),
        eventIds: z.array(z.string().min(1)).default([]),

        createdAt: ISODateTimeSchema,
        updatedAt: ISODateTimeSchema,
        updatedBy: z
            .object({
                storeId: z.string().min(1),
                userId: z.string().min(1),
            })
            .strict(),

        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict();

/**
 * -----------------------------
 * API Response Wrapper (optional)
 * -----------------------------
 */
export const OrderResponseSchema = z
    .object({
        success: z.boolean(),
        data: z.array(OrderSchema),
        message: z.string().optional(),
    })
    .strict();




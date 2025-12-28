import { z } from "zod";
import { CustomerSchema } from "./ordersSchema";
/**
 * Reuse from Order schema (DO NOT redefine)
 *
 * export const CustomerSchema = z.object({
 *   customerId: z.string().min(1),
 *   customerName: z.string().min(1),
 *   customerNumber: z.string().min(1),
 *   customerEmail: z.string().email().optional(),
 * }).strict();
 */

/**
 * -----------------------------
 * Helpers
 * -----------------------------
 */
export const ISODateTimeSchema = z.string().datetime({ offset: true });
export const IdSchema = z.string().min(1);

/**
 * -----------------------------
 * Role formats
 * -----------------------------
 * Allowed roles:
 * - "customer" | "system" | "developer" | "tool_call"
 * - "ai_agent:<id>" | "user:<id>" | "developer:<id>"
 */
export const AgentRoleSchema = z.string().regex(/^ai_agent:[^:\s]+$/);
export const UserRoleSchema = z.string().regex(/^user:[^:\s]+$/);
export const DeveloperIdRoleSchema = z.string().regex(/^developer:[^:\s]+$/);

export const StaticRoleSchema = z.enum(["customer", "system", "developer", "tool_call"]);

export const RoleSchema = z.union([
    StaticRoleSchema,
    AgentRoleSchema,
    UserRoleSchema,
    DeveloperIdRoleSchema,
]);

/**
 * tool_call must be triggered by: ai_agent:<id> | user:<id> | developer:<id>
 */
export const TriggeredByRoleSchema = z.union([
    AgentRoleSchema,
    UserRoleSchema,
    DeveloperIdRoleSchema,
]);

export const TriggeredBySchema = z
    .object({
        role: TriggeredByRoleSchema,
        messageId: z.string().min(1).optional(),
        traceId: z.string().min(1).optional(),
    })
    .strict();

/**
 * -----------------------------
 * Multimodal content parts
 * content can be string | parts[]
 * -----------------------------
 */
export const ContentTextPartSchema = z
    .object({
        type: z.literal("text"),
        text: z.string(),
    })
    .strict();

export const ContentImageUrlPartSchema = z
    .object({
        type: z.literal("image_url"),
        image_url: z
            .object({
                url: z.string().min(1),
            })
            .strict(),
    })
    .strict();

export const ContentImagePartSchema = z
    .object({
        type: z.literal("image"),
        image: z.string().min(1), // url or path
    })
    .strict();

export const ContentAudioPartSchema = z
    .object({
        type: z.literal("audio"),
        audio: z.string().min(1), // url or path
    })
    .strict();

export const ContentVideoPartSchema = z
    .object({
        type: z.literal("video"),
        path: z.array(z.string().min(1)).min(1), // frames
    })
    .strict();

export const ContentFilePartSchema = z
    .object({
        type: z.literal("file"),
        file_id: z.string().min(1),
        filename: z.string().min(1).optional(),
        mime_type: z.string().min(1).optional(),
    })
    .strict();

export const ContentPartSchema = z.union([
    ContentTextPartSchema,
    ContentImageUrlPartSchema,
    ContentImagePartSchema,
    ContentAudioPartSchema,
    ContentVideoPartSchema,
    ContentFilePartSchema,
]);

export const MessageContentSchema = z.union([
    z.string(),
    z.array(ContentPartSchema).min(1),
]);

/**
 * -----------------------------
 * Complaint Message schema
 * -----------------------------
 * - role: custom roles
 * - content: string | parts[]
 * - if role === "tool_call" => triggeredBy required (ai_agent/user/developer:<id>)
 */
export const ComplaintMessageSchema = z
    .object({
        role: RoleSchema,
        content: MessageContentSchema,

        at: ISODateTimeSchema.optional(),

        triggeredBy: TriggeredBySchema.optional(),

        // optional function call payloads (if you want tool calling)
        tool_calls: z
            .array(
                z
                    .object({
                        name: z.string().min(1),
                        arguments: z.union([z.string(), z.record(z.string(), z.unknown())]),
                    })
                    .strict()
            )
            .optional(),

        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict()
    .superRefine((msg, ctx) => {
        const isToolCallRole = msg.role === "tool_call";

        if (isToolCallRole && !msg.triggeredBy) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["triggeredBy"],
                message: "triggeredBy is required when role is tool_call",
            });
        }

        if (!isToolCallRole && msg.triggeredBy) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["triggeredBy"],
                message: "triggeredBy is only allowed when role is tool_call",
            });
        }

        // Optional strictness:
        // If it's tool_call, require tool_calls
        if (isToolCallRole && (!msg.tool_calls || msg.tool_calls.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["tool_calls"],
                message: "tool_calls must be present when role is tool_call",
            });
        }

        // If not tool_call, tool_calls should not exist
        if (!isToolCallRole && msg.tool_calls) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["tool_calls"],
                message: "tool_calls is only allowed when role is tool_call",
            });
        }
    });

/**
 * -----------------------------
 * Complaint schema (denormalized customer)
 * -----------------------------
 */
export const ComplaintSchema = z
    .object({
        complaintId: IdSchema,

        orderId: IdSchema,

        // ✅ denormalized snapshot for fast reads — reuse the same schema
        customer: CustomerSchema,

        // variants involved in this complaint (empty allowed if order-level)
        itemVariantIds: z.array(IdSchema).default([]),

        messages: z.array(ComplaintMessageSchema).default([]),

        status: z
            .enum(["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER", "RESOLVED", "CLOSED"])
            .default("OPEN"),

        createdAt: ISODateTimeSchema,
        updatedAt: ISODateTimeSchema,

        // who last updated complaint (store staff / agent / customer)
        updatedBy: z
            .object({
                role: z.union([z.literal("customer"), AgentRoleSchema, UserRoleSchema, DeveloperIdRoleSchema]),
            })
            .strict()
            .optional(),

        metadata: z.record(z.string(), z.unknown()).default({}),
    })
    .strict();

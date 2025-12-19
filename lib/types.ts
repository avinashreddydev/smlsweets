// lib/schemas/storekit.ts
import { z } from "zod";

export const StorekitVariantSchema = z.object({
    id: z.string(),
    sku: z.string().nullable(),
    price: z.number(),
    stock: z.number(),
    discount: z.number(),
    unit: z.string(),          // or z.enum(["GRAMS", "PIECES", ...]) if you know them
    quantity: z.number(),
    isDefault: z.boolean(),
    position: z.number(),
    barcode: z.string().nullable(),
    createdAt: z.string(),     // you can transform to Date if you prefer
    updatedAt: z.string(),
    productId: z.string(),
});

export const StorekitProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.array(z.string().url()),
    hotSale: z.boolean(),
    status: z.string(),        // narrow later if backend defines enum
    category: z.string(),
    createdAt: z.string(),
    storeId: z.string(),
    variants: z.array(StorekitVariantSchema),
});

export const StorekitProductResponseSchema = z.object({
    success: z.boolean(),
    data: StorekitProductSchema,
    message: z.string(),
});

// Inferred TS types (optional, but handy)
export type StorekitVariant = z.infer<typeof StorekitVariantSchema>;
export type StorekitProduct = z.infer<typeof StorekitProductSchema>;
export type StorekitProductResponse = z.infer<typeof StorekitProductResponseSchema>;




export const ProductListVariantSchema = z.object({
    price: z.number(),
    stock: z.number(),
    discount: z.number(),
});

export const ProductListItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    variants: z.array(ProductListVariantSchema),
    image: z.array(z.string().url()),
    status: z.string(),      // or z.enum(["ACTIVE", "INACTIVE", ...])
    category: z.string(),
    createdAt: z.string(),   // or z.coerce.date() if you want Date
});

export const ProductCategoryFilterSchema = z.object({
    name: z.string(),
    count: z.number(),
});

export const ProductListPaginationSchema = z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    totalCount: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
    limit: z.number(),
});

export const ProductListFiltersSchema = z.object({
    categories: z.array(ProductCategoryFilterSchema),
});

export const ProductListAppliedFiltersSchema = z.object({
    category: z.string().nullable(),
    search: z.string().nullable(),
    inStock: z.boolean(),
    sortBy: z.string(),                 // or z.enum(["createdAt", "price", ...])
    sortOrder: z.enum(["asc", "desc"]), // from your example it's "desc"
});

export const ProductListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(ProductListItemSchema),
    pagination: ProductListPaginationSchema,
    filters: ProductListFiltersSchema,
    appliedFilters: ProductListAppliedFiltersSchema,
    message: z.string(),
});

// Inferred types (optional if you prefer using these instead of manual interfaces):
export type ProductListVariant = z.infer<typeof ProductListVariantSchema>;
export type ProductListItem = z.infer<typeof ProductListItemSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;




export const CategoryCountSchema = z.object({
    _count: z.object({
        category: z.number(),
    }),
    category: z.string(),
});

export const CategoriesResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(CategoryCountSchema),
    message: z.string(),
});

// Inferred types (optional)
export type CategoryCount = z.infer<typeof CategoryCountSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

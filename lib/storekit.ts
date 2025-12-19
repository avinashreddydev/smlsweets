import {
    StorekitProduct,
    StorekitProductResponseSchema,
    CategoriesResponseSchema,
    CategoryCount,
    CategoriesResponse
} from "./types";

const API_URL = "https://api.storekit.app";
const API_KEY = process.env.STOREKIT_API_KEY;

if (!API_KEY) {
    console.warn("Missing STOREKIT_API_KEY environment variable");
} else {
    console.log("StoreKit API key loaded successfully");
}

const headers = {
    "X-Api-Key": API_KEY || "",
    "Content-Type": "application/json",
};

export async function getProducts(): Promise<StorekitProduct[]> {
    console.log("[StoreKit] Fetching products...");
    try {
        const res = await fetch(`${API_URL}/v1/products`, { headers, method: "GET" });
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        const json = await res.json();
        console.log(`[StoreKit] Fetched ${json.data?.length || 0} products`);
        return json.data || [];
    } catch (error) {
        console.error("[StoreKit] Error fetching products:", error);
        return [];
    }
}

export async function getProduct(id: string): Promise<StorekitProduct | null> {
    console.log(`[StoreKit] Fetching product: ${id}`);
    try {
        const res = await fetch(`${API_URL}/v1/products/${id}`, { headers, method: "GET" });
        if (!res.ok) {
            console.warn(`[StoreKit] Product not found: ${id}`);
            return null;
        }
        const json = await res.json();

        const parsed = StorekitProductResponseSchema.safeParse(json);
        if (!parsed.success) {
            console.error("[StoreKit] Validation failed for product:", parsed.error);
            return null;
        }

        console.log(`[StoreKit] Successfully fetched product: ${parsed.data.data.name}`);
        return parsed.data.data;
    } catch (error) {
        console.error(`[StoreKit] Error fetching product ${id}:`, error);
        return null;
    }
}

export async function createOrder(orderData: any) {
    console.log("[StoreKit] Creating order...", { email: orderData.customerEmail, itemCount: orderData.items.length });
    try {
        const res = await fetch(`${API_URL}/v1/order`, {
            method: "POST",
            headers,
            body: JSON.stringify(orderData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("[StoreKit] Order creation failed:", errorData);
            throw new Error(errorData.message || "Failed to create order");
        }

        const data = await res.json();
        console.log("[StoreKit] Order created successfully:", data.id);
        return data;
    } catch (error) {
        console.error("[StoreKit] Error creating order:", error);
        throw error;
    }
}

export async function getCategories(): Promise<CategoriesResponse["data"] | null> {
    console.log("[StoreKit] Fetching categories...");
    try {
        const res = await fetch(`${API_URL}/v1/categories`, { headers, method: "GET" });
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
        const json = await res.json();

        const parsed = CategoriesResponseSchema.safeParse(json);
        if (!parsed.success) {
            console.error("[StoreKit] Validation error for categories:", parsed.error);
            return null;
        }

        console.log(`[StoreKit] Fetched ${parsed.data.data.length} categories`);
        return parsed.data.data;
    } catch (error) {
        console.error("[StoreKit] Error fetching categories:", error);
        return null;
    }
}

// Re-export types for consumers
export type Product = StorekitProduct;
export type Category = CategoryCount;

export interface CartItem {
    product: Product;
    quantity: number;
    variantId?: string;
}
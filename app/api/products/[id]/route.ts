import { NextRequest, NextResponse } from "next/server";
import { StorekitProductResponseSchema } from "@/lib/types";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const API_URL = "https://api.storekit.app";
    const API_KEY = process.env.STOREKIT_API_KEY;

    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    try {
        const res = await fetch(`${API_URL}/v1/products/${id}`, {
            headers: {
                "X-Api-Key": API_KEY,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch product" }, { status: res.status });
        }

        const json = await res.json();
        const parsed = StorekitProductResponseSchema.safeParse(json);

        if (!parsed.success) {
            console.error("Validation failed:", parsed.error);
            return NextResponse.json({ error: "Invalid API response" }, { status: 502 });
        }

        return NextResponse.json(parsed.data);
    } catch (error) {
        console.error("Error in product proxy:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Product } from "@/lib/storekit";

export function useProducts() {
    return useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products");
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        },
    });
}

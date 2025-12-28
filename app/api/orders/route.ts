import { NextResponse } from 'next/server';
import { postOrder, PostOrderRequest } from '@/lib/storekit';
import { id } from 'zod/v4/locales';


// Mock Data Structure fitting the requested Schema roughly
const SAMPLE_ORDER1 = {
    orderId: "ord_112313131",
    orderNumber: "ORD-2024-0821",
    createdAt: "2024-12-23T15:11:30.000Z",
    status: "CONFIRMED",
    customer: {
        customerName: "Avinash Reddy",
        customerEmail: "avinashreddy@idio.in",
        customerNumber: "+91 98765 43210"
    },
    fulfillmentType: "ASAP",
    items: [
        {
            productId: "prod_1",
            productName: "Mysore Pak",
            variantLabel: "500g Box",
            quantity: 2,
            imageUrl: "https://placehold.co/400x500/png?text=Mysore+Pak",
            unitPrice: { amount: 85000, currency: "INR" }, // in paise
            lineTotal: { amount: 170000, currency: "INR" }
        },
        {
            productId: "prod_2",
            productName: "Kaju Katli",
            variantLabel: "250g Gift Pack",
            quantity: 1,
            imageUrl: "https://placehold.co/400x500/png?text=Kaju+Katli",
            unitPrice: { amount: 45000, currency: "INR" },
            lineTotal: { amount: 45000, currency: "INR" }
        }
    ],
    pricing: {
        subtotal: { amount: 215000, currency: "INR" },
        sgst: { amount: 10750, currency: "INR" },
        cgst: { amount: 10750, currency: "INR" },
        deliveryFee: { amount: 5000, currency: "INR" },
        grandTotal: { amount: 230750, currency: "INR" }
    },
    payment: {
        method: "ONLINE",
        status: "PAID",
        transactionId: "TXN_PHONEPE_998877"
    },
    shippingAddress: {
        line1: "123 Main St, Tech Park",
        city: "Hyderabad",
        state: "Telangana",
        postal_code: "500081",
        country: "India"
    }
};


const SAMPLE_ORDER2 = {
    orderId: "ord_1234121231",
    orderNumber: "ORD-2024-0821",
    createdAt: "2024-12-23T15:11:30.000Z",
    status: "CONFIRMED",
    customer: {
        customerName: "Avinash Reddy",
        customerEmail: "avinashreddy@idio.in",
        customerNumber: "+91 98765 43210"
    },
    fulfillmentType: "ASAP",
    items: [
        {
            productId: "prod_1",
            productName: "Mysore Pak",
            variantLabel: "500g Box",
            quantity: 2,
            imageUrl: "https://placehold.co/400x500/png?text=Mysore+Pak",
            unitPrice: { amount: 85000, currency: "INR" }, // in paise
            lineTotal: { amount: 170000, currency: "INR" }
        },
        {
            productId: "prod_2",
            productName: "Kaju Katli",
            variantLabel: "250g Gift Pack",
            quantity: 1,
            imageUrl: "https://placehold.co/400x500/png?text=Kaju+Katli",
            unitPrice: { amount: 45000, currency: "INR" },
            lineTotal: { amount: 45000, currency: "INR" }
        }
    ],
    pricing: {
        subtotal: { amount: 215000, currency: "INR" },
        sgst: { amount: 10750, currency: "INR" },
        cgst: { amount: 10750, currency: "INR" },
        deliveryFee: { amount: 5000, currency: "INR" },
        grandTotal: { amount: 230750, currency: "INR" }
    },
    payment: {
        method: "ONLINE",
        status: "PAID",
        transactionId: "TXN_PHONEPE_998877"
    },
    shippingAddress: {
        line1: "123 Main St, Tech Park",
        city: "Hyderabad",
        state: "Telangana",
        postal_code: "500081",
        country: "India"
    }
};


const SAMPLE_ORDER3 = {
    orderId: "ord_122132123",
    orderNumber: "ORD-2024-0821",
    createdAt: "2024-12-23T15:11:30.000Z",
    status: "CONFIRMED",
    customer: {
        customerName: "Avinash Reddy",
        customerEmail: "avinashreddy@idio.in",
        customerNumber: "+91 98765 43210"
    },
    fulfillmentType: "ASAP",
    items: [
        {
            productId: "prod_1",
            productName: "Mysore Pak",
            variantLabel: "500g Box",
            quantity: 2,
            imageUrl: "https://placehold.co/400x500/png?text=Mysore+Pak",
            unitPrice: { amount: 85000, currency: "INR" }, // in paise
            lineTotal: { amount: 170000, currency: "INR" }
        },
        {
            productId: "prod_2",
            productName: "Kaju Katli",
            variantLabel: "250g Gift Pack",
            quantity: 1,
            imageUrl: "https://placehold.co/400x500/png?text=Kaju+Katli",
            unitPrice: { amount: 45000, currency: "INR" },
            lineTotal: { amount: 45000, currency: "INR" }
        }
    ],
    pricing: {
        subtotal: { amount: 215000, currency: "INR" },
        sgst: { amount: 10750, currency: "INR" },
        cgst: { amount: 10750, currency: "INR" },
        deliveryFee: { amount: 5000, currency: "INR" },
        grandTotal: { amount: 230750, currency: "INR" }
    },
    payment: {
        method: "ONLINE",
        status: "PAID",
        transactionId: "TXN_PHONEPE_998877"
    },
    shippingAddress: {
        line1: "123 Main St, Tech Park",
        city: "Hyderabad",
        state: "Telangana",
        postal_code: "500081",
        country: "India"
    }
};


const SAMPLE_ORDERS = [SAMPLE_ORDER1, SAMPLE_ORDER2, SAMPLE_ORDER3];


// Create a random delay of 2 to 5 seconds and return the sample order
export async function GET(request: Request) {

    console.log("GET request received", request.url);

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    console.log("Order ID", orderId);

    // if no id, return all orders

    const delay = Math.floor(Math.random() * 3000) + 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (!orderId) {
        return NextResponse.json({ success: true, data: SAMPLE_ORDERS }, { status: 200 });
    }
    else {
        // Select a random order
        const randomIndex = Math.floor(Math.random() * SAMPLE_ORDERS.length);
        return NextResponse.json({ success: true, data: SAMPLE_ORDERS[randomIndex] }, { status: 200 });
    }

}


export async function POST(request: Request) {

    const delay = Math.floor(Math.random() * 3000) + 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
        const body: PostOrderRequest = await request.json();

        // Basic validation could be done here, but postOrder and the external API handle most of it

        const result = await postOrder(body);

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
        console.error('API Error creating order:', error);

        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}




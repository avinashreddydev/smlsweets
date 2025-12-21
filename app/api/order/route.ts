import { NextResponse } from 'next/server';
import { postOrder, PostOrderRequest } from '@/lib/storekit';

export async function POST(request: Request) {
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

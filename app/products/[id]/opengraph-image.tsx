import { ImageResponse } from 'next/og';
import { getProduct } from '@/lib/storekit';

// Image metadata
export const alt = 'Sri Mahalakshmi Sweets';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const product = await getProduct(id);

        if (!product) {
            // Fallback for product not found
            return new ImageResponse(
                (
                    <div
                        style={{
                            fontSize: 64,
                            background: 'linear-gradient(to bottom right, #f59e0b, #d97706)',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '80px',
                        }}
                    >
                        <div style={{ fontSize: 96, marginBottom: 20 }}>🍬</div>
                        <div>Sri Mahalakshmi Sweets</div>
                        <div style={{ fontSize: 36, fontWeight: 'normal', marginTop: 20 }}>
                            Product Not Found
                        </div>
                    </div>
                ),
                {
                    ...size,
                }
            );
        }

        // Get product image
        const productImage = product.image && product.image.length > 0
            ? product.image[0]
            : null;

        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'linear-gradient(to bottom right, #fffbeb, #fef3c7)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '60px 80px',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    {/* Left side - Product info */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            paddingRight: productImage ? '40px' : '0',
                        }}
                    >
                        {/* Brand name */}
                        <div
                            style={{
                                fontSize: 28,
                                color: '#92400e',
                                marginBottom: 20,
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                            }}
                        >
                            SRI MAHALAKSHMI SWEETS
                        </div>

                        {/* Product name */}
                        <div
                            style={{
                                fontSize: 72,
                                fontWeight: 'bold',
                                color: '#1f2937',
                                marginBottom: 20,
                                lineHeight: 1.1,
                                display: 'flex',
                            }}
                        >
                            {product.name}
                        </div>

                        {/* Product description */}
                        {product.description && (
                            <div
                                style={{
                                    fontSize: 28,
                                    color: '#4b5563',
                                    lineHeight: 1.4,
                                    display: 'flex',
                                }}
                            >
                                {product.description.substring(0, 120)}
                                {product.description.length > 120 ? '...' : ''}
                            </div>
                        )}

                        {/* Hot sale badge */}
                        {product.hotSale && (
                            <div
                                style={{
                                    marginTop: 30,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        background: '#dc2626',
                                        color: 'white',
                                        padding: '12px 24px',
                                        borderRadius: '9999px',
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        display: 'flex',
                                    }}
                                >
                                    🔥 HOT SALE
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side - Product image */}
                    {productImage && (
                        <div
                            style={{
                                width: '400px',
                                height: '400px',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                display: 'flex',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                            }}
                        >
                            <img
                                src={productImage}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    )}
                </div>
            ),
            {
                ...size,
            }
        );
    } catch (error) {
        console.error('[OG Image] Error generating image:', error);

        // Fallback error image
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 64,
                        background: 'linear-gradient(to bottom right, #f59e0b, #d97706)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                >
                    <div style={{ fontSize: 96, marginBottom: 20 }}>🍬</div>
                    <div>Sri Mahalakshmi Sweets</div>
                </div>
            ),
            {
                ...size,
            }
        );
    }
}

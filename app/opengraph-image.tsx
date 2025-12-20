import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Sri Mahalakshmi Sweets - Authentic, handcrafted Indian sweets';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Decorative elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '40px',
                        fontSize: 120,
                        opacity: 0.15,
                        display: 'flex',
                    }}
                >
                    🍬
                </div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        fontSize: 120,
                        opacity: 0.15,
                        display: 'flex',
                    }}
                >
                    🧁
                </div>

                {/* Main content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '80px',
                    }}
                >
                    {/* Brand emoji icon */}
                    <div
                        style={{
                            fontSize: 120,
                            marginBottom: 40,
                            display: 'flex',
                        }}
                    >
                        🍯
                    </div>

                    {/* Brand name */}
                    <div
                        style={{
                            fontSize: 96,
                            fontWeight: 'bold',
                            color: '#1f2937',
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                            marginBottom: 30,
                            textTransform: 'uppercase',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ display: 'flex' }}>Sri Mahalakshmi</div>
                        <div style={{ display: 'flex', fontSize: 110 }}>Sweets</div>
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: 36,
                            color: '#92400e',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: 20,
                            display: 'flex',
                        }}
                    >
                        Authentic · Handcrafted · Traditional
                    </div>

                    {/* Description */}
                    <div
                        style={{
                            fontSize: 28,
                            color: '#78350f',
                            maxWidth: '800px',
                            lineHeight: 1.4,
                            display: 'flex',
                        }}
                    >
                        Experience the taste of tradition with our premium collection of Indian sweets
                    </div>

                    {/* Decorative line */}
                    <div
                        style={{
                            width: '200px',
                            height: '4px',
                            background: '#f59e0b',
                            marginTop: 40,
                            borderRadius: '2px',
                            display: 'flex',
                        }}
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

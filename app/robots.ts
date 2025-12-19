import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://smlsweets.com'; // Replace with actual domain when known, or use env var

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/checkout', '/cart'], // Disallow checkout and admin routes if any
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

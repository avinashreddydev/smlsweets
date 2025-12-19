import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/storekit';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://smlsweets.com'; // Replace with actual domain

    // Static routes
    const routes = [
        '',
        '/about',
        '/cart',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic products
    const products = await getProducts();
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...productRoutes];
}

import { MetadataRoute } from 'next';
import { getServiceCategoriesAction } from '@/app/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const categories = await getServiceCategoriesAction();
    const baseUrl = 'https://hellofixo.in';

    // Static routes
    const staticRoutes = [
        '',
        '/partner/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic service category routes
    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/book/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes];
}

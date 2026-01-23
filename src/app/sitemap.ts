import { MetadataRoute } from 'next';
import { getServiceCategoriesAction } from '@/app/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const categories = await getServiceCategoriesAction();
    const baseUrl = 'https://hellofixo.in';
    const now = new Date();

    // Static routes with proper priorities
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/partner/register`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/wallet`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/history`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // Dynamic service category routes
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/book/${category.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes];
}

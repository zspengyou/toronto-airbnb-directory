import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Disallow API routes
    },
    sitemap: 'https://your-domain.com/sitemap.xml', // Replace with your actual domain
  };
} 
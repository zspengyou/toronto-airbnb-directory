import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Disallow API routes
    },
    sitemap: 'https://toronto-airbnb-directory.vercel.app/sitemap.xml', // Replace with your actual domain
  };
} 
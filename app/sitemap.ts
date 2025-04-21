import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://toronto-airbnb-directory.vercel.app/', // Replace with your actual domain
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
} 
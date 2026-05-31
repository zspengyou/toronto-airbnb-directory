import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://airbnbreply.com/airbnb-directory', // Replace with your actual domain
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
} 
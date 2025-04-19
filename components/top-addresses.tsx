'use client';

import { useEffect, useState } from 'react';

interface AddressCount {
  address: string;
  count: number;
}

export function TopAddresses() {
  const [topAddresses, setTopAddresses] = useState<AddressCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopAddresses = async () => {
      try {
        const response = await fetch('/api/top-addresses');
        if (!response.ok) {
          throw new Error('Failed to fetch top addresses');
        }
        const data = await response.json();
        setTopAddresses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAddresses();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 ">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 ">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Top 5 Airbnb Building</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number of Listings
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topAddresses.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                  {item.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 text-center">
                  {item.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
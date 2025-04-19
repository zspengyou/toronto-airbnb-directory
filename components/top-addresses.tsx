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
      <div className="text-center py-1">
        <p className="text-gray-500 text-xs">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-1">
        <p className="text-red-500 text-xs">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h2 className="text-sm font-semibold">Top 5 Addresses</h2>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topAddresses.map((item, index) => (
              <tr key={index}>
                <td className="px-2 py-1 whitespace-nowrap text-[10px] text-gray-900">
                  {item.address}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-[10px] text-gray-900">
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
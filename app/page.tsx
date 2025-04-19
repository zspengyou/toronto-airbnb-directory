'use client';

import { useState } from 'react';
import { SearchForm } from '@/components/search-form';
import { ResultsTable } from '@/components/results-table';
import { TopAddresses } from '@/components/top-addresses';
import { searchProperties, RentalProperty } from '@/lib/utils';

export default function Home() {
  const [results, setResults] = useState<RentalProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (unit: string, address: string) => {
    setIsLoading(true);
    try {
      const { results, total } = await searchProperties(unit || undefined, address || undefined);
      setResults(results);
      setTotal(total);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Toronto Airbnb Directory</h1>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SearchForm onSearch={handleSearch} />
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              <ResultsTable results={results} total={total} />
            )}
          </div>
          <div>
            <TopAddresses />
          </div>
        </div>
      </div>
    </main>
  );
}

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

  const handleSearch = async (unit: string, address: string, registrationNumber: string) => {
    setIsLoading(true);
    try {
      const { results, total } = await searchProperties(
        unit || undefined, 
        address || undefined,
        registrationNumber || undefined
      );
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Toronto Airbnb Directory</h1>
        <p className="mt-2 text-gray-600">
          Search and find registered short-term rental properties in Toronto. View operator registration numbers, addresses, units, and property types.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section aria-labelledby="search-section" className="lg:col-span-2">
          <h2 id="search-section" className="sr-only">Search Properties</h2>
          <SearchForm onSearch={handleSearch} />
          {isLoading ? (
            <div className="text-center py-8" role="status" aria-label="Loading results">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <ResultsTable results={results} total={total} />
          )}
        </section>

        <section aria-labelledby="top-addresses-section">
          <h2 id="top-addresses-section" className="sr-only">Top Addresses</h2>
          <TopAddresses />
        </section>
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-gray-600">Have questions or feedback?</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="mailto:zspengyou@gmail.com"
              className="text-blue-600 hover:text-blue-800 hover:underline"
              aria-label="Contact us via email"
            >
              Contact Us
            </a>
            <span className="text-gray-400">|</span>
            <a 
              href="https://x.com/dev_jayzhou"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
              aria-label="Follow us on Twitter"
            >
              Follow on X
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

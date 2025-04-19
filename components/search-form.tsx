'use client';

import { useState } from 'react';
import { Input } from './ui/input';

interface SearchFormProps {
  onSearch: (unit: string, address: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [unit, setUnit] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(unit, address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit" className="block text-sm font-medium mb-1">
            Unit Number
          </label>
          <Input
            id="unit"
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Enter unit number"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter street address"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
} 
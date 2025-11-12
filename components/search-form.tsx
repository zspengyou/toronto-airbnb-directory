'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from './ui/input';

interface SearchFormProps {
  onSearch: (unit: string, address: string, registrationNumber: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [unit, setUnit] = useState('');
  const [address, setAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [allAddresses, setAllAddresses] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch all addresses once when component mounts
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/addresses');
        if (response.ok) {
          const data = await response.json();
          setAllAddresses(data);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  // Filter addresses based on input
  const filteredAddresses = useMemo(() => {
    if (address.length < 2) return [];
    const query = address.toLowerCase();
    return allAddresses
      .filter(addr => addr.toLowerCase().includes(query))
      .slice(0, 30);
  }, [address, allAddresses]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(unit, address, registrationNumber);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAddress(suggestion);
    setShowSuggestions(false);
    onSearch(unit, suggestion, registrationNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="unit" className="block text-sm font-medium mb-1">
            Unit Number (Optional)
          </label>
          <Input
            id="unit"
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="eg: 1008"
          />
        </div>
        <div className="relative" ref={suggestionsRef}>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="eg: 12 York St"
          />
          {showSuggestions && filteredAddresses.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {filteredAddresses.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium mb-1">
            Registration Number (Optional)
          </label>
          <Input
            id="registrationNumber"
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="eg: 24-000001"
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
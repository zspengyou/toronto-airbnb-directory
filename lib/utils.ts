import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface RentalProperty {
  _id: string;
  operator_registration_number: string;
  address: string;
  unit: string;
  postal_code: string;
  property_type: string;
  ward_number: string;
  ward_name: string;
}

export async function searchProperties(unit?: string, address?: string): Promise<{
  results: RentalProperty[];
  total: number;
}> {
  const params = new URLSearchParams();
  if (unit) params.append('unit', unit);
  if (address) params.append('address', address);

  const response = await fetch(`/api/search?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to search properties');
  }

  return response.json();
}

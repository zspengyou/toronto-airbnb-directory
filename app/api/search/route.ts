import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const unit = searchParams.get('unit') || undefined;
  const address = searchParams.get('address') || undefined;

  try {
    const filePath = path.join(process.cwd(), 'data', 'short-term-rental-registrations-data.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    
    const results = lines.slice(1)
      .map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header as keyof RentalProperty] = values[index] || '';
          return obj;
        }, {} as RentalProperty);
      })
      .filter(property => {
        if (unit && property.unit !== unit) return false;
        if (address && !property.address.toLowerCase().includes(address.toLowerCase())) return false;
        return true;
      });

    return NextResponse.json({
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    );
  }
} 
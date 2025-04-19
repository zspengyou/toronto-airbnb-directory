import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface AddressCount {
  address: string;
  count: number;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'short-term-rental-registrations-data.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    const addressIndex = headers.indexOf('address');
    
    // Count occurrences of each address
    const addressCounts = new Map<string, number>();
    
    lines.slice(1).forEach(line => {
      const values = line.split(',');
      const address = values[addressIndex];
      if (address) {
        addressCounts.set(address, (addressCounts.get(address) || 0) + 1);
      }
    });
    
    // Convert to array and sort by count
    const topAddresses: AddressCount[] = Array.from(addressCounts.entries())
      .map(([address, count]) => ({ address, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json(topAddresses);
  } catch (error) {
    console.error('Error getting top addresses:', error);
    return NextResponse.json(
      { error: 'Failed to get top addresses' },
      { status: 500 }
    );
  }
} 
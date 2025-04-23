import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
 
  try {
    const filePath = path.join(process.cwd(), 'data', 'short-term-rental-registrations-data.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    ;;
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    const addressIndex = headers.indexOf('address');
    
    // Get unique addresses and filter based on query
    const addresses = new Set<string>();
    lines.slice(1).forEach(line => {
      const values = line.split(',');
      const address = values[addressIndex];
      if (address && address.toLowerCase().includes(query)) {
        addresses.add(address);
      }
    });

    return NextResponse.json(Array.from(addresses).slice(0, 10)); // Limit to 10 suggestions
  } catch (error) {
    console.error('Error getting addresses:', error);
    return NextResponse.json(
      { error: 'Failed to get addresses' },
      { status: 500 }
    );
  }
} 
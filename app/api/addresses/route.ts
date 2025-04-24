import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'short-term-rental-registrations-data.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    const addressIndex = headers.indexOf('address');
    
    // Get all unique addresses
    const addresses = new Set<string>();
    lines.slice(1).forEach(line => {
      const values = line.split(',');
      const address = values[addressIndex];
      if (address) {
        addresses.add(address);
      }
    });

    return NextResponse.json(Array.from(addresses));
  } catch (error) {
    console.error('Error getting addresses:', error);
    return NextResponse.json(
      { error: 'Failed to get addresses' },
      { status: 500 }
    );
  }
} 
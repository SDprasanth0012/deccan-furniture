import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY;

export function validateApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get('x-api-key');

  if (apiKey !== API_KEY) {
    return NextResponse.json({ message: 'Invalid API key' }, { status: 403 });
  }

  return null; // No response means API key is valid
}

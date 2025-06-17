// app/api/analytics/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import { endpoints } from '../route';

export async function GET() {
  try {
    const response = await axios.get(endpoints.heatmap);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}

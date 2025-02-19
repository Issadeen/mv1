import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: { params?: string[] } }) {
  try {
    const params = await Promise.resolve(context.params);
    if (!params?.params || params.params.length < 2) {
      return new NextResponse('Invalid parameters', { status: 400 });
    }

    const [type, id] = params.params;
    const embedUrl = `https://vidsrc.xyz/embed/${type}/${id}`;

    const response = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://vidsrc.xyz/'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self'",
      }
    });

  } catch (error) {
    console.error('Stream error:', error);
    return new NextResponse('Error fetching stream', { status: 500 });
  }
}

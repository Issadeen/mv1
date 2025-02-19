import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { params: string[] } }) {
  const [type, id] = params.params;
  const embedUrl = `https://vidsrc.xyz/embed/${type}/${id}`;

  try {
    return NextResponse.json({ url: embedUrl });
  } catch (error) {
    console.error('Error fetching stream:', error);
    return NextResponse.json({ error: 'Failed to fetch stream' }, { status: 500 });
  }
}

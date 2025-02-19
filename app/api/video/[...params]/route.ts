import { NextResponse } from 'next/server';

async function fetchVideoSource(type: string, id: string) {
  const videoUrl = `https://vidsrc.xyz/embed/${type}/${id}`;
  
  try {
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video page');
    }

    const html = await response.text();
    
    // Try multiple patterns to find video source
    const patterns = [
      /sources:\s*\[\s*{\s*file:\s*"([^"]+)"/,
      /file:\s*"([^"]+)"/,
      /src="([^"]+)"/
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        // Validate URL
        try {
          new URL(match[1]);
          return match[1];
        } catch (e) {
          continue;
        }
      }
    }

    // If no source found, return iframe URL as fallback
    return videoUrl;

  } catch (error) {
    console.error('Error fetching video:', error);
    // Return embed URL as fallback
    return videoUrl;
  }
}

export async function GET(request: Request, { params }: { params: { params: string[] } }) {
  const [type, id] = params.params;

  if (!type || !id) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const videoSource = await fetchVideoSource(type, id);
    
    if (!videoSource) {
      return NextResponse.json({ error: 'Video source not found' }, { status: 404 });
    }

    return NextResponse.json({ url: videoSource });
  } catch (error) {
    console.error('Error processing video request:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

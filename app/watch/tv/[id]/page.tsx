'use client';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorDisplay from '@/app/components/ErrorDisplay';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { use } from 'react';
import VideoPlayer from '@/app/components/VideoPlayer';

export default function WatchTVPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [showDetails, setShowDetails] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${resolvedParams.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        if (!response.ok) throw new Error('TV Show not found');
        const data = await response.json();
        setShowDetails(data);

        // Fetch video URL from your API endpoint
        const videoResponse = await fetch(`/api/vidsrc/tv/${resolvedParams.id}`);
        if (!videoResponse.ok) throw new Error('Failed to load video source');
        const videoData = await videoResponse.json();
        setVideoUrl(videoData.url);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load TV show');
        setIsLoading(false);
      }
    };

    fetchShowDetails();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="relative">
        {/* Back Button */}
        <Link href="/tv-shows" className="absolute top-4 left-4 z-10">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm">
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to TV Shows
          </button>
        </Link>

        {/* Video Player */}
        <div className="aspect-video w-full max-h-[90vh]">
          {videoUrl ? (
            <VideoPlayer videoUrl={videoUrl} title={showDetails.name} />
          ) : (
            <p className="text-white text-center">Video source not available.</p>
          )}
        </div>

        {/* Show Details */}
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold mb-4">{showDetails.name}</h1>
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                <span>{new Date(showDetails.first_air_date).getFullYear()}</span>
                <span>•</span>
                <span>{showDetails.number_of_seasons} Season{showDetails.number_of_seasons > 1 ? 's' : ''}</span>
                <span>•</span>
                <span className="text-emerald-400">★ {showDetails.vote_average.toFixed(1)}</span>
              </div>
              <p className="text-gray-300 mb-6">{showDetails.overview}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {showDetails.genres.map((genre: any) => (
                  <span 
                    key={genre.id}
                    className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-400 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              {/* Seasons List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Seasons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showDetails.seasons.map((season: any) => (
                    <div 
                      key={season.id}
                      className="flex gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
                        alt={season.name}
                        className="w-20 h-30 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{season.name}</h3>
                        <p className="text-sm text-gray-400">
                          {season.episode_count} Episodes • {new Date(season.air_date).getFullYear()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${showDetails.poster_path}`}
                  alt={showDetails.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useMovies } from '@/app/context/MoviesContext';
import VideoPlayer from '@/app/components/VideoPlayer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorDisplay from '@/app/components/ErrorDisplay';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { use } from 'react';

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${resolvedParams.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        if (!response.ok) throw new Error('Movie not found');
        const data = await response.json();
        setMovieDetails(data);

        // Update to use new stream API
        const videoResponse = await fetch(`/api/stream/movie/${resolvedParams.id}`);
        if (!videoResponse.ok) throw new Error('Failed to load video source');
        const videoData = await videoResponse.json();
        setVideoUrl(videoData.url);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie');
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
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
      <div className="relative pt-16">
        {/* Video Player Container */}
        <div 
          className="fixed inset-0 z-20 bg-black"
          onClick={(e) => e.preventDefault()}
        >
          {videoUrl ? (
            <VideoPlayer videoUrl={videoUrl} title={movieDetails?.title || ''} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="lg" />
            </div>
          )}
          <Link 
            href="/movies" 
            className="absolute top-4 left-4 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
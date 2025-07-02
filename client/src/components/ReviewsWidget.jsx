import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';

const GOOGLE_MAPS_LINK = 'https://maps.app.goo.gl/zQP672PxXMDuJ4QP7';

const ReviewsWidget = () => {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setBusinessData(result.data);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to load reviews');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => 
      prev === businessData.reviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => 
      prev === 0 ? businessData.reviews.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-md p-6 max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Reviews</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchReviews}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!businessData || !businessData.reviews || businessData.reviews.length === 0) {
    return (
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-md p-6 max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Available</h3>
          <p className="text-gray-600">Check back later for customer reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Business Header - More Compact */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900">
              <a 
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {businessData.name}
              </a>
            </h1>
            <div className="flex items-center space-x-2">
              <StarRating rating={businessData.rating} size="w-5 h-5" />
              <span className="text-lg font-semibold text-gray-900">
                {businessData.rating}
              </span>
              <span className="text-sm text-gray-600">
                ({businessData.user_ratings_total})
              </span>
            </div>
          </div>
          {businessData.address && (
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <svg 
                className="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M10 0C6.134 0 3 3.134 3 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
              </svg>
              {businessData.address}
            </a>
          )}
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="p-4">
              <ReviewCard review={businessData.reviews[currentReviewIndex]} />
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={prevReview}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-r-lg p-2 shadow-md transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={nextReview}
              className="bg-white/80 hover:bg-white text-gray-700 rounded-l-lg p-2 shadow-md transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-2 left-0 right-0">
            <div className="flex justify-center space-x-2">
              {businessData.reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentReviewIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Google Link */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm text-gray-600">Reviews are updated daily</span>
            </div>
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              <span>View Business Profile</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsWidget; 
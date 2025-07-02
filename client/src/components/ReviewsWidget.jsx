import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';

const ReviewsWidget = () => {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-md p-6 max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Available</h3>
          <p className="text-gray-600">Check back later for customer reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {businessData.name}
            </h1>
            {businessData.address && (
              <p className="text-gray-600 mb-4">{businessData.address}</p>
            )}
            
            {/* Overall Rating */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <StarRating rating={businessData.rating} size="w-6 h-6" />
              <span className="text-xl font-semibold text-gray-900">
                {businessData.rating}
              </span>
              <span className="text-gray-600">
                ({businessData.user_ratings_total} reviews)
              </span>
            </div>

            {/* Powered by Google */}
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <span className="text-sm">Powered by</span>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Reviews
          </h2>
          
          <div className="space-y-4">
            {businessData.reviews.map((review, index) => (
              <ReviewCard 
                key={`${review.author_name}-${review.time}-${index}`} 
                review={review} 
              />
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-md">
            <p className="text-sm text-gray-600">
              Reviews are automatically updated daily from Google Places API
            </p>
            {businessData.website && (
              <a
                href={businessData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                Visit Our Website →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsWidget; 
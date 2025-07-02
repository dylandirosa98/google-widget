import React from 'react';
import StarRating from './StarRating';

const GOOGLE_MAPS_LINK = 'https://maps.app.goo.gl/zQP672PxXMDuJ4QP7';

const ReviewCard = ({ review }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          {review.profile_photo_url ? (
            <img
              src={review.profile_photo_url}
              alt={`${review.author_name}'s profile`}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span className="text-gray-500 text-lg">
                {review.author_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <a
              href={review.author_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              {review.author_name}
            </a>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.rating} size="w-4 h-4" />
              <span className="text-sm text-gray-500">
                {formatDate(review.time)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-gray-600 text-sm leading-relaxed">
        {review.text}
      </div>
    </div>
  );
};

export default ReviewCard; 
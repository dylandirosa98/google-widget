const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyBawcjs0cFRcxYqtjFVIl_G6Ysq4MrpfkY';
const BUSINESS_NAME = 'Spartan Exteriors';
const BUSINESS_LOCATION = 'Sewell NJ';

// In-memory cache for reviews
let reviewsCache = {
  data: null,
  lastUpdated: null,
  placeId: null
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Helper function to get place ID
async function getPlaceId() {
  try {
    if (reviewsCache.placeId) {
      return reviewsCache.placeId;
    }

    const searchQuery = `${BUSINESS_NAME} ${BUSINESS_LOCATION}`;
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
      params: {
        input: searchQuery,
        inputtype: 'textquery',
        fields: 'place_id,name,formatted_address',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.candidates && response.data.candidates.length > 0) {
      reviewsCache.placeId = response.data.candidates[0].place_id;
      console.log('✅ Found place ID:', reviewsCache.placeId);
      return reviewsCache.placeId;
    }

    throw new Error('Business not found');
  } catch (error) {
    console.error('❌ Error getting place ID:', error.message);
    throw error;
  }
}

// Helper function to fetch reviews
async function fetchReviews() {
  try {
    const placeId = await getPlaceId();
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'name,rating,user_ratings_total,reviews,formatted_address,website',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.result) {
      const result = response.data.result;
      const reviews = result.reviews || [];
      
      // Process reviews to include relative time
      const processedReviews = reviews.slice(0, 5).map(review => ({
        author_name: review.author_name,
        author_url: review.author_url,
        profile_photo_url: review.profile_photo_url,
        rating: review.rating,
        relative_time_description: review.relative_time_description,
        text: review.text,
        time: review.time
      }));

      const businessData = {
        name: result.name,
        rating: result.rating,
        user_ratings_total: result.user_ratings_total,
        address: result.formatted_address,
        website: result.website,
        reviews: processedReviews
      };

      reviewsCache.data = businessData;
      reviewsCache.lastUpdated = new Date();
      
      console.log(`✅ Reviews updated: ${processedReviews.length} reviews cached`);
      return businessData;
    }

    throw new Error('No business data found');
  } catch (error) {
    console.error('❌ Error fetching reviews:', error.message);
    throw error;
  }
}

// Initialize reviews on startup
fetchReviews().catch(console.error);

// Schedule reviews update every 24 hours
cron.schedule('0 0 * * *', () => {
  console.log('🔄 Scheduled review update starting...');
  fetchReviews().catch(console.error);
});

// API Routes
app.get('/api/reviews', async (req, res) => {
  try {
    // If no cached data or cache is older than 24 hours, fetch new data
    if (!reviewsCache.data || !reviewsCache.lastUpdated || 
        (Date.now() - reviewsCache.lastUpdated.getTime()) > 24 * 60 * 60 * 1000) {
      await fetchReviews();
    }

    res.json({
      success: true,
      data: reviewsCache.data,
      lastUpdated: reviewsCache.lastUpdated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Widget route - serves the React app
app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cacheStatus: reviewsCache.data ? 'loaded' : 'empty',
    lastUpdated: reviewsCache.lastUpdated
  });
});

// Catch all handler for React routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Widget available at: http://localhost:${PORT}/widget`);
  console.log('⏰ Reviews will update every 24 hours');
}); 
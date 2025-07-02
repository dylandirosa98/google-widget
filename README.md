# Google Reviews Widget for Spartan Exteriors

A responsive, embeddable Google Reviews widget that displays customer reviews from Google Places API for Spartan Exteriors in Sewell, NJ.

## 🌟 Features

- **Server-side caching**: Reviews are fetched server-side and cached for 24 hours
- **Automatic updates**: Reviews refresh daily via cron job
- **Responsive design**: Mobile-friendly with Tailwind CSS
- **Embed-ready**: Clean iframe output for easy website integration
- **SEO-friendly**: Server-side rendered content
- **Fallback handling**: Graceful error states and loading indicators
- **Profile photos**: Displays reviewer avatars or initials fallback

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Express.js + Node.js
- **API**: Google Places API
- **Deployment**: Railway-ready with automatic builds
- **Caching**: In-memory caching (no database required)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Google Places API key

### Local Development

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd google-widget
npm run install:all
```

2. **Set environment variables:**
Create a `.env` file in the root directory:
```env
GOOGLE_PLACES_API_KEY=AIzaSyBawcjs0cFRcxYqtjFVIl_G6Ysq4MrpfkY
PORT=3001
NODE_ENV=development
```

3. **Start development servers:**
```bash
npm run dev
```

This will start:
- Express server on `http://localhost:3001`
- React dev server on `http://localhost:3000` (with proxy to API)

4. **View the widget:**
- Development: `http://localhost:3000`
- Widget endpoint: `http://localhost:3001/widget`

### Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment on Railway

### One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/your-username/google-widget)

### Manual Deploy

1. **Create a new Railway project:**
```bash
railway login
railway init
```

2. **Set environment variables in Railway dashboard:**
```
GOOGLE_PLACES_API_KEY=AIzaSyBawcjs0cFRcxYqtjFVIl_G6Ysq4MrpfkY
NODE_ENV=production
```

3. **Deploy:**
```bash
railway up
```

Your widget will be available at: `https://your-app.up.railway.app/widget`

## 🔗 Embedding the Widget

Add this iframe to your website:

```html
<iframe 
  src="https://spartan-reviews.up.railway.app/widget" 
  width="100%" 
  height="400" 
  frameborder="0" 
  loading="lazy"
  title="Spartan Exteriors Google Reviews">
</iframe>
```

### Responsive Embedding

For responsive design, wrap in a container:

```html
<div style="position: relative; width: 100%; height: 400px;">
  <iframe 
    src="https://spartan-reviews.up.railway.app/widget"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    loading="lazy"
    title="Spartan Exteriors Google Reviews">
  </iframe>
</div>
```

## 📡 API Endpoints

- `GET /widget` - Main widget page (iframe-ready)
- `GET /api/reviews` - JSON API for reviews data
- `GET /health` - Health check endpoint

### Example API Response

```json
{
  "success": true,
  "data": {
    "name": "Spartan Exteriors",
    "rating": 4.8,
    "user_ratings_total": 127,
    "address": "123 Main St, Sewell, NJ",
    "website": "https://spartanexteriors.com",
    "reviews": [
      {
        "author_name": "John Smith",
        "author_url": "https://www.google.com/maps/contrib/...",
        "profile_photo_url": "https://lh3.googleusercontent.com/...",
        "rating": 5,
        "relative_time_description": "2 weeks ago",
        "text": "Excellent service and quality work!",
        "time": 1640995200
      }
    ]
  },
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## ⚙️ Configuration

### Business Information

Update the business details in `server/index.js`:

```javascript
const BUSINESS_NAME = 'Spartan Exteriors';
const BUSINESS_LOCATION = 'Sewell NJ';
```

### Caching Behavior

- Reviews are cached for 24 hours
- Automatic refresh every night at midnight
- Manual refresh on server restart

### Customization

#### Colors
Update Tailwind colors in `client/tailwind.config.js`:

```javascript
colors: {
  'google-blue': '#4285f4',
  'google-red': '#ea4335',
  // Add your brand colors here
}
```

#### Styling
Main widget styles are in `client/src/components/ReviewsWidget.jsx`

## 🔧 Development Scripts

```bash
npm run dev          # Start both client and server in development
npm run server:dev   # Start only the server with nodemon
npm run client:dev   # Start only the React dev server
npm run build        # Build React app for production
npm start           # Start production server
npm run install:all  # Install all dependencies (root + client)
```

## 📦 Project Structure

```
google-widget/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── ReviewsWidget.jsx
│   │   │   └── StarRating.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Express backend
│   └── index.js           # Main server file
├── package.json           # Root package.json
├── railway.json           # Railway deployment config
├── Procfile              # Railway process definition
└── README.md
```

## 🔒 Security Considerations

- API key is stored in environment variables
- CORS enabled for iframe embedding
- Rate limiting through Google API quotas
- No sensitive data stored in cache

## 📈 Performance

- **Server-side caching** reduces API calls to once per day
- **Optimized images** with fallback to initials
- **Responsive design** loads fast on mobile
- **Lazy loading** for iframe embedding

## 🐛 Troubleshooting

### Common Issues

1. **"Business not found" error**
   - Verify the business name and location in `server/index.js`
   - Check if the business exists on Google Maps

2. **API key errors**
   - Ensure Google Places API is enabled in Google Cloud Console
   - Verify the API key has proper permissions
   - Check API usage quotas

3. **CORS errors in development**
   - Make sure the proxy is configured in `client/vite.config.js`
   - Restart both dev servers

4. **Railway deployment issues**
   - Verify environment variables are set in Railway dashboard
   - Check build logs for any npm install failures

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and checking server logs.

## 📄 License

MIT License - feel free to customize for your own business needs.

## 🤝 Support

For issues or customization requests, please create an issue in the repository.

---

**Ready to showcase your Google reviews? Deploy now and start displaying customer feedback beautifully! 🌟** 
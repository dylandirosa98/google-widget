#!/bin/bash

echo "🧪 Testing Google Reviews Widget Locally"
echo "========================================"

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

# Build the client
echo "🔨 Building client..."
npm run build

# Start the server
echo "🚀 Starting server..."
echo "📱 Widget will be available at: http://localhost:3001/widget"
echo "🔍 Debug info at: http://localhost:3001/api/debug"
echo "💡 Press Ctrl+C to stop"
echo ""
npm start 
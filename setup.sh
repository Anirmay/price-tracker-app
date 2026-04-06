#!/bin/bash

# Price Tracker - Complete Setup Script

echo "🚀 Price Tracker - Complete Setup"
echo "=================================="

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Check MongoDB
echo "Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install or start MongoDB Atlas"
fi

# Check Redis
echo "Checking Redis..."
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis not found. Will be needed for background jobs"
fi

# Setup Backend
echo ""
echo "Setting up Backend..."
cd backend
cp .env.example .env
echo "Please update .env with your credentials"
npm install
echo "✅ Backend setup complete"

# Setup Frontend
echo ""
echo "Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend setup complete"

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB and Redis credentials"
echo "2. Start MongoDB: mongod"
echo "3. Start Redis: redis-server"
echo "4. Start Backend: cd backend && npm run dev"
echo "5. Start Frontend: cd frontend && npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"

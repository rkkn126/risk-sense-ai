#!/bin/bash

# Risk Sense AI - Quick Setup Script
# This script helps you deploy the application quickly

echo "🚀 Risk Sense AI - Setup Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from template..."
    cp .env.example .env
    echo "🔑 Please edit .env file with your API keys:"
    echo "   - NEWS_API_KEY (get from https://newsapi.org/)"
    echo "   - OPENROUTER_API_KEY (get from https://openrouter.ai/)"
    echo ""
    echo "📝 Opening .env file for editing..."
    if command -v code &> /dev/null; then
        code .env
    elif command -v nano &> /dev/null; then
        nano .env
    else
        echo "   Please edit .env file manually with your preferred editor"
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎯 Setup complete! To start the application:"
echo "   npm run dev    (development mode)"
echo "   npm run build  (build for production)"
echo "   npm start      (production mode)"
echo ""
echo "🌐 Application will be available at: http://localhost:5000"
echo ""
echo "📚 For deployment options, see DEPLOYMENT_GUIDE.md"
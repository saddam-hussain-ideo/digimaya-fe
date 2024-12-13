#!/bin/bash

# Variables
BUILD_DIR="dist/crypto"      # Build directory (adjust if different)
SERVER_USER="ubuntu"         # SSH username for the server
SERVER_HOST="65.0.44.35"    # Server IP or domain

# Load nvm if it's installed
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
else
  echo "nvm not found, skipping Node version management"
fi

# Install specific node version using .nvmrc file if it exists
echo "Installing node version..."
nvm install
nvm use

# Install dependencies
echo "Installing dependencies..."
npm install

# Check Git branch and set server path accordingly
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Build the frontend
echo "Building the frontend..."
if [ "$CURRENT_BRANCH" == "master" ]; then
    SERVER_PATH="/var/www/html/digimaya_fe_prod" # Path for master branch
    npm run build:prod
elif [ "$CURRENT_BRANCH" == "develop" ]; then
    SERVER_PATH="/var/www/html/digimaya_fe"      # Path for develop branch
    npm run build:develop
else
    echo "Not on master or develop branch. Exiting."
    exit 1
fi

echo "Current branch: $CURRENT_BRANCH, using server path: $SERVER_PATH"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Build directory not found. Exiting."
    exit 1
fi

# Copy build folder to server using rsync
echo "Copying build folder to server..."
rsync -avz --delete "$BUILD_DIR/" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# If you want to use scp instead of rsync, use the following command:
# scp -r "$BUILD_DIR" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# Success message
echo "Frontend built and copied to server successfully."

#!/bin/bash

# Variables
BUILD_DIR="dist/crypto"      # Build directory (adjust if different)
SERVER_USER="ubuntu"         # SSH username for the server
SERVER_HOST="3.6.113.156"    # Server IP or domain
SERVER_PATH="/var/www/html/digimaya_fe"  # Path where the build folder will be copied on the server

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

# Build the frontend
echo "Building the frontend..."
npm run build

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

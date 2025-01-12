#!/bin/bash

echo "Installing runtime dependencies..."

# Adding the URL to download torch and torchaudio +cpu versions
pip install torch==2.1.0+cpu torchaudio==2.1.0+cpu --no-cache-dir

echo "All dependencies installed successfully."
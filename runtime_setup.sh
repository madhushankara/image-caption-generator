#!/bin/bash

echo "Installing runtime dependencies..."

# Adding the URL to download torch and torchaudio +cpu versions
pip install transformers==4.47.1 TTS==0.22.0 --no-cache-dir

echo "All dependencies installed successfully."
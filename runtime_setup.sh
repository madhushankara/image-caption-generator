#!/bin/bash

echo "Installing runtime dependencies..."

# Adding the URL to download torch and torchaudio +cpu versions
pip install TTS==0.22.0 --no-cache-dir

echo "All dependencies installed successfully."
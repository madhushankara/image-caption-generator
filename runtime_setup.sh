#!/bin/bash

echo "Installing runtime dependencies..."
pip install torch==2.1.0+cpu torchaudio==2.1.0+cpu transformers==4.47.1 TTS==0.22.0 --no-cache-dir
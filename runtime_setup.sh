#!/bin/bash

echo "Installing runtime dependencies..."

# Adding the URL to download torch and torchaudio +cpu versions
pip install \
    --find-links https://download.pytorch.org/whl/torch_stable.html \
    torch==2.1.0+cpu torchaudio==2.1.0+cpu transformers==4.47.1 TTS==0.22.0 --no-cache-dir
#!/bin/bash

echo "Installing runtime dependencies..."

# Adding the URL to download torch and torchaudio +cpu versions
pip install \
    --find-links https://download.pytorch.org/whl/torch_stable.html \
    transformers==4.47.1 --no-cache-dir

echo "All dependencies installed successfully."
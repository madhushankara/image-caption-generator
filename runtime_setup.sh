#!/bin/bash

echo "Installing runtime dependencies..."

# Adding the URL to download torch and torchaudio +cpu versions
pip install sympy babel blis llvmlite spacy numba --no-cache-dir

echo "All dependencies installed successfully."
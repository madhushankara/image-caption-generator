#!/bin/bash

echo "Installing runtime dependencies..."

# Adding the URL to download torch and torchaudio +cpu versions
pip install sympy babel blis llvmlite spacy scipy numba matplotlib

echo "All dependencies installed successfully."
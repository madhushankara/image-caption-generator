#!/bin/bash

echo "Starting post-build cleanup..."

# Remove caches and temporary files
echo "Removing temporary files and caches..."
rm -rf ~/.cache/pip
rm -rf venv/
find . -name "*.pyc" -exec rm -f {} \;
find . -name "*.pyo" -exec rm -f {} \;

# Remove other unneeded directories (if present)
rm -rf tests/ docs/ examples/
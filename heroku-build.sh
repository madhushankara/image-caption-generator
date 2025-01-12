#!/bin/bash

echo "Starting pre-build cleanup..."

# Remove caches and temporary files
echo "Removing caches and temporary files..."
rm -rf ~/.cache/pip
rm -rf venv/
find . -name "*.pyc" -exec rm -f {} \;
find . -name "*.pyo" -exec rm -f {} \;

# Remove other unneeded directories
rm -rf tests/ docs/ examples/

echo "Pre-build cleanup completed!"
#!/bin/bash

echo "Starting pre-build cleanup..."

# Clear unnecessary libraries
echo "Clearing unused Python packages..."
pip uninstall -y Cython Jinja2 Markdown MarkupSafe PyYAML Pygments SudachiDict-core SudachiPy \
Unidecode Werkzeug matplotlib scikit-learn umap-learn babel langcodes dateparser

# Remove caches and temporary files
echo "Removing caches and temporary files..."
rm -rf ~/.cache/pip
rm -rf venv/
find . -name "*.pyc" -exec rm -f {} \;
find . -name "*.pyo" -exec rm -f {} \;

# Remove other unneeded directories
rm -rf tests/ docs/ examples/

echo "Pre-build cleanup completed!"
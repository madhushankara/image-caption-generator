#!/bin/bash

echo "Starting post-build cleanup..."

# Clear unnecessary libraries
echo "Clearing Python packages not used in the project..."
pip uninstall -y Cython Jinja2 Markdown MarkupSafe PyYAML Pygments SudachiDict-core SudachiPy \
Unidecode Werkzeug matplotlib scikit-learn umap-learn babel langcodes dateparser

# Remove caches and temporary files
echo "Removing temporary files and caches..."
rm -rf ~/.cache/pip
rm -rf venv/
find . -name "*.pyc" -exec rm -f {} \;
find . -name "*.pyo" -exec rm -f {} \;

# Remove other unneeded directories (if present)
rm -rf tests/ docs/ examples/
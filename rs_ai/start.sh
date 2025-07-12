#!/bin/bash

# Activate Python environment if it exists
if [ -d ".pythonlibs" ]; then
    source .pythonlibs/bin/activate
fi

# Run the application
python run.py
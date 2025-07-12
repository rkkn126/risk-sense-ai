#!/usr/bin/env python
import os
import sys
import time
import webbrowser
from threading import Timer

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the app
from app import app

def open_browser():
    """Open browser after a short delay"""
    time.sleep(1)
    webbrowser.open('http://localhost:5001')

if __name__ == '__main__':
    # Open browser automatically
    Timer(1, open_browser).start()
    
    # Start the app
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
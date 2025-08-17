#!/usr/bin/env python3
"""
Setup and start script for the Sherpa AI Flask server.
Run this script to install dependencies and start the Flask API server.
"""

import subprocess
import sys
import os

def check_python_version():
    """Check if Python version is 3.7 or higher"""
    if sys.version_info < (3, 7):
        print("Error: Python 3.7 or higher is required")
        sys.exit(1)
    print(f"✓ Python {sys.version.split()[0]} detected")

def install_requirements():
    """Install required packages"""
    try:
        print("Installing required packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        sys.exit(1)

def check_sherpa_ai_path():
    """Check if the Sherpa AI directory exists"""
    sherpa_path = r"C:\Users\ASUS\Desktop\Codes\Sherpa AI"
    if not os.path.exists(sherpa_path):
        print(f"Error: Sherpa AI directory not found at: {sherpa_path}")
        print("Please make sure your Python Sherpa AI project is located at the correct path")
        sys.exit(1)
    
    trekking_sherpa_file = os.path.join(sherpa_path, "trekking_sherpa.py")
    if not os.path.exists(trekking_sherpa_file):
        print(f"Error: trekking_sherpa.py not found in: {sherpa_path}")
        print("Please make sure your trekking_sherpa.py file exists in the Sherpa AI directory")
        sys.exit(1)
    
    print(f"✓ Sherpa AI directory found at: {sherpa_path}")
    print(f"✓ trekking_sherpa.py found")

def start_flask_server():
    """Start the Flask server"""
    print("\n" + "="*50)
    print("Starting Sherpa AI Flask Server...")
    print("Server will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("="*50 + "\n")
    
    try:
        subprocess.run([sys.executable, "app.py"], check=True)
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
    except subprocess.CalledProcessError as e:
        print(f"Error starting Flask server: {e}")
        sys.exit(1)

def main():
    """Main setup and start function"""
    print("Sherpa AI Flask Server Setup")
    print("="*30)
    
    # Check Python version
    check_python_version()
    
    # Check Sherpa AI directory
    check_sherpa_ai_path()
    
    # Install requirements
    install_requirements()
    
    # Start Flask server
    start_flask_server()

if __name__ == "__main__":
    main()
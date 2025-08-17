#!/usr/bin/env python3
"""
Test script to validate the Sherpa AI integration.
This script tests the Flask API endpoints without starting the full server.
"""

import sys
import os
import requests
import json
import time

# Add the Sherpa AI directory to Python path
sys.path.append(r'C:\Users\ASUS\Desktop\Codes\Sherpa AI')

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✓ Health endpoint working")
            print(f"  Status: {data.get('status')}")
            print(f"  Sherpa Available: {data.get('sherpa_available')}")
            return True
        else:
            print(f"✗ Health endpoint returned {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Health endpoint failed: {e}")
        return False

def test_trek_endpoint():
    """Test the trek recommendation endpoint"""
    try:
        test_query = "What are the best beginner-friendly treks in the Himalayas?"
        payload = {"query": test_query}
        
        print(f"Testing with query: {test_query}")
        
        response = requests.post(
            'http://localhost:5000/trek',
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=60  # Increased timeout for AI response
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✓ Trek endpoint working")
            print(f"  Query: {data.get('query', 'N/A')}")
            print(f"  Response length: {len(data.get('response', ''))}")
            print(f"  Status: {data.get('status')}")
            
            # Show metadata if available
            metadata = data.get('metadata', {})
            if metadata:
                print(f"  Response time: {metadata.get('response_time', 0):.2f}s")
                print(f"  Tokens used: {metadata.get('tokens_used', 0)}")
                print(f"  Model: {metadata.get('model', 'Unknown')}")
            
            # Show first part of response
            response_text = data.get('response', '')
            if response_text:
                preview = response_text[:200] + "..." if len(response_text) > 200 else response_text
                print(f"  Response preview: {preview}")
            
            return True
        else:
            print(f"✗ Trek endpoint returned {response.status_code}")
            print(f"  Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Trek endpoint failed: {e}")
        return False

def check_server_running():
    """Check if the Flask server is running"""
    try:
        response = requests.get('http://localhost:5000/', timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    """Main test function"""
    print("Sherpa AI Integration Test")
    print("=" * 30)
    
    # Check if server is running
    if not check_server_running():
        print("✗ Flask server is not running on port 5000")
        print("\nTo start the server, run:")
        print("  python start_sherpa_server.py")
        print("  OR")
        print("  python app.py")
        sys.exit(1)
    
    print("✓ Flask server is running")
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    
    # Test trek endpoint
    trek_ok = test_trek_endpoint()
    
    # Summary
    print("\n" + "=" * 30)
    if health_ok and trek_ok:
        print("✓ All tests passed! Integration is working correctly.")
        print("\nYou can now:")
        print("1. Start your frontend: npm run dev")
        print("2. Navigate to the Sherpa AI page")
        print("3. Start chatting with the AI!")
    else:
        print("✗ Some tests failed. Please check the Flask server logs.")
        print("Common issues:")
        print("- Sherpa AI directory path incorrect")
        print("- trekking_sherpa.py missing or has errors")
        print("- Together AI API key issues")
        print("- Missing Python dependencies")

if __name__ == "__main__":
    main()
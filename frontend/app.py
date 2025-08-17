from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import logging

# Add the Sherpa AI directory to Python path
sys.path.append(r'C:\Users\ASUS\Desktop\Codes\Sherpa AI')

# try:
#     from trekking_sherpa import TrekkingSherpa
# except ImportError as e:
#     print(f"Error importing TrekkingSherpa: {e}")
#     print("Make sure the trekking_sherpa.py file exists in the Sherpa AI directory")
#     sys.exit(1)

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the TrekkingSherpa instance
# try:
#     sherpa = TrekkingSherpa()
#     logger.info("TrekkingSherpa initialized successfully")
# except Exception as e:
#     logger.error(f"Failed to initialize TrekkingSherpa: {e}")
sherpa = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'sherpa_available': sherpa is not None,
        'message': 'Flask API server is running'
    }), 200

@app.route('/trek', methods=['POST'])
def get_trek_recommendation():
    """Get trekking recommendations from Sherpa AI"""
    try:
        if not sherpa:
            return jsonify({
                'error': 'Sherpa AI is not available',
                'message': 'TrekkingSherpa failed to initialize'
            }), 503
        
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing query parameter',
                'message': 'Please provide a query in the request body'
            }), 400
        
        query = data['query'].strip()
        if not query:
            return jsonify({
                'error': 'Empty query',
                'message': 'Query cannot be empty'
            }), 400
        
        logger.info(f"Processing query: {query}")
        
        # Get response from TrekkingSherpa
        prompt = sherpa.create_simple_prompt(query)
        result = sherpa.send_api_request(prompt)
        
        if not result['success']:
            return jsonify({
                'error': 'Sherpa AI API error',
                'message': result['error']
            }), 500
        
        response = result['response']
        
        if not response:
            return jsonify({
                'error': 'No response from Sherpa AI',
                'message': 'The AI did not generate a response'
            }), 500
        
        return jsonify({
            'response': response,
            'query': query,
            'status': 'success',
            'metadata': {
                'response_time': result.get('response_time', 0),
                'tokens_used': result.get('tokens', 0),
                'model': sherpa.model
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing trek request: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Trekking Sherpa AI Flask API',
        'version': '1.0.0',
        'endpoints': {
            'health': 'GET /health - Health check',
            'trek': 'POST /trek - Get trekking recommendations'
        }
    }), 200

if __name__ == '__main__':
    print("Starting Flask API server...")
    print(f"Sherpa AI directory: C:\\Users\\ASUS\\Desktop\\Codes\\Sherpa AI")
    print(f"Server will run on: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
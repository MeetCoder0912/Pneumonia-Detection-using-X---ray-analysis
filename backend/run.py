# /backend/run.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import numpy as np
import os
from dotenv import load_dotenv
import google.generativeai as genai
# 1. Import TensorFlow
import tensorflow as tf

# Load environment variables from a .env file
load_dotenv()

# --- Google Gemini API Setup ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    print("Google API Key loaded successfully.")
else:
    print("Google API Key not found. Please check your .env file.")

chat_model = genai.GenerativeModel('gemini-1.5-flash-latest')
# --- End of API Setup ---


# --- Custom Keras Model Setup ---
print("Loading custom Keras model...")
try:
    # --- FIX: Create a robust, absolute path to the model file ---
    # This ensures the script can find the model regardless of where it's run from.
    # 1. Get the absolute path of the directory where this script (run.py) is located.
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # 2. Join that directory path with the model's filename.
    model_path = os.path.join(base_dir, 'pneumonia_vgg16_model.keras')
    
    # 3. Load the model using the full, absolute path.
    model = tf.keras.models.load_model(model_path)
    # --- End of FIX ---
    
    print("Custom Keras model loaded successfully.")
    model.summary() # Print a summary of the model architecture
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
# --- End of AI Model Setup ---


# --- Flask Application Setup ---
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Backend Server is Running!"

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if not model:
        return jsonify({'error': 'Model is not loaded. Please check the backend console.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            
            image = image.resize((150, 150))
            
            image_array = np.array(image) / 255.0
            
            image_array = np.expand_dims(image_array, axis=0)

            prediction = model.predict(image_array)
            confidence = prediction[0][0]
            
            if confidence > 0.5:
                prediction_text = "Pneumonia"
                confidence_percent = confidence * 100
            else:
                prediction_text = "Normal"
                confidence_percent = (1 - confidence) * 100

            result = {
                "fileName": file.filename,
                "findings": f"The model predicts the class: {prediction_text}.",
                "confidence": f"{confidence_percent:.2f}%",
                "disclaimer": "This is an AI-generated analysis from your custom-trained model."
            }
            return jsonify(result)
        except Exception as e:
            print(f"An error occurred during image processing: {e}")
            return jsonify({'error': 'Failed to process the image.'}), 500

    return jsonify({'error': 'An unknown error occurred'}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_question = data.get('question')
    analysis_context = data.get('context')

    if not user_question:
        return jsonify({'error': 'No question provided'}), 400
    
    if not GOOGLE_API_KEY:
        return jsonify({'error': 'Google API token is not configured.'}), 500

    prompt = f"""You are a helpful medical AI assistant. Your role is to explain technical medical findings from an X-ray analysis to a user in simple, easy-to-understand terms. Do not provide a diagnosis or medical advice. Always remind the user to consult a real doctor.

Here is the technical analysis from the imaging model:
---
{analysis_context}
---

Based ONLY on that context, please answer the following user question: "{user_question}"
"""
    
    print("--- Sending Prompt to Google Gemini ---")
    
    try:
        response = chat_model.generate_content(prompt)
        answer = response.text
        
        print(f"Raw API Response: {answer}")
        return jsonify({"answer": answer})

    except Exception as e:
        print(f"An unexpected error occurred in chat endpoint: {e}")
        return jsonify({'error': 'An internal server error occurred while contacting the AI model.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

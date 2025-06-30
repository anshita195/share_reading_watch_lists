from flask import Flask, request, jsonify
from llama_cpp import Llama
import sys

app = Flask(__name__)

# --- Model Configuration ---
# This path is now relative. The model should be in the project's root directory.
MODEL_PATH = "./tinyllama-1.1b-chat-v1.0.Q4_0.gguf"

try:
    print("Loading LLM model... This may take a moment.")
    llm = Llama(model_path=MODEL_PATH, n_ctx=2048, verbose=True)
    print("Model loaded successfully.")
except Exception as e:
    print(f"--- FATAL ERROR ---", file=sys.stderr)
    print(f"Failed to load the model from path: {MODEL_PATH}", file=sys.stderr)
    print("Please make sure you have downloaded a GGUF-v2 model and placed it in the project's root directory.", file=sys.stderr)
    print("A good starting model is TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf.", file=sys.stderr)
    print("You can download it from: https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF", file=sys.stderr)
    print(f"Original Error: {e}", file=sys.stderr)
    sys.exit(1)

# --- Summarization Prompt Template ---
def create_summary_prompt(title, url, content_type='content'):
    """Creates a specialized prompt for summarization."""
    if content_type == 'video':
        # For videos, we only have the title, so we make that clear.
        return f"""<|system|>
You are a helpful assistant. Based ONLY on the title provided, please generate a short, speculative summary of what this video might be about. Do not pretend you have watched it. Respond only with the summary text.</s>
<|user|>
Speculate on the content of the video with the following title:
Title: {title}</s>
<|assistant|>
"""
    else: # For articles
        return f"""<|system|>
Generate a short, neutral, and objective summary of the provided web content. The summary should capture the main points. Do not include any conversational text, introductions, or conclusions. Do not repeat the title or URL. Respond only with the summary text.</s>
<|user|>
Summarize the following {content_type}:
Title: {title}
URL: {url}</s>
<|assistant|>
"""

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    title = data.get('title')
    url = data.get('url')
    content_type = data.get('type', 'content') # default to 'content'

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    prompt = create_summary_prompt(title, url, content_type)

    try:
        output = llm(
            prompt,
            max_tokens=150,  # Increased for better summaries
            stop=["</s>", "<|user|>"], # Stop tokens for chat models
            echo=False
        )
        summary_text = output['choices'][0]['text'].strip()
        return jsonify({'summary': summary_text})
    except Exception as e:
        print(f"Error during summarization: {e}", file=sys.stderr)
        return jsonify({'error': 'Failed to generate summary'}), 500

if __name__ == '__main__':
    # Runs on port 5001 to avoid conflict with the main backend
    app.run(port=5001, debug=True) 
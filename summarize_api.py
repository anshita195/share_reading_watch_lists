from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

# Update these paths to match your system!
LLAMA_EXE = r'E:\llama.cpp\build\bin\Release\llama-cli.exe'
MODEL_PATH = r'E:\llama.cpp\tinyllama-1.1b-chat-v1.0.Q4_0.gguf'

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    prompt = f"Summarize: {text}"
    try:
        result = subprocess.run(
            [LLAMA_EXE, '-m', MODEL_PATH, '-p', prompt, '-n', '128'],
            capture_output=True, text=True, timeout=120
        )
        output = result.stdout.strip()
        return jsonify({'summary': output})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
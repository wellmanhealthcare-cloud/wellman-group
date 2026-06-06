import os
import sys

# Set working directory to scripts/ so rag_pipeline's relative paths resolve
scripts_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'scripts')
os.chdir(scripts_dir)
sys.path.insert(0, scripts_dir)

from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_pipeline import answer_question

app = Flask(__name__)
CORS(app, origins=['*'])


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(force=True) or {}
    message    = (data.get('message') or '').strip()
    session_id = data.get('session_id') or None

    if not message:
        return jsonify({'reply': 'Please ask a question.'}), 400

    try:
        reply, chunks, session_id = answer_question(message, session_id)
        return jsonify({'reply': reply, 'session_id': session_id})
    except Exception as e:
        print(f'[chatbot error] {e}')
        return jsonify({'reply': 'Sorry, something went wrong. Please try again.'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8001))
    print(f'Wellman RAG server starting on port {port}…')
    app.run(host='0.0.0.0', port=port, debug=False)

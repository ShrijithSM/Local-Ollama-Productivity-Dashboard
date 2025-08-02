from flask import Flask, render_template, request, jsonify
import requests
app = Flask(__name__)

# Local Ollama Chatbot Route
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",  # or deepseek-coder, etc.
                "prompt": user_input,
                "stream": False
            }
        )
        result = response.json()["response"]
        return jsonify({"response": result})
    except Exception as e:
        return jsonify({"response": f"Error: {e}"}), 500

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

 
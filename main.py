from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_URL = "https://hex.teraboxfast2.workers.dev/"
HEADERS = {
    "Content-Type": "application/json",
    "Origin": "https://www.teraboxfast.com",
    "Referer": "https://www.teraboxfast.com/"
}

@app.route("/")
def home():
    return "✅ Terabox Link Extractor is working!"

@app.route("/get_terabox_links", methods=["GET"])
def get_terabox_links():
    url = request.args.get("url")
    key = "C7mAq"

    if not url:
        return jsonify({"status": "error", "message": "URL required"}), 400

    payload = {"url": url, "key": key}

    try:
        response = requests.post(API_URL, json=payload, headers=HEADERS)
        data = response.json()

        if data.get("status") == "success":
            return jsonify({
                "status": "ok",
                "title": data["data"].get("title"),
                "download_link": data["data"].get("download_link"),
                "player": data["data"].get("player"),
                "size": data["data"].get("size"),
                "thumb": data["data"].get("thumb")
            })
        else:
            return jsonify({"status": "fail", "message": "Invalid response"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

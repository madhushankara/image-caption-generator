from flask import Flask, render_template, request, jsonify, send_file
from captioning.caption import generate_caption, generate_caption_from_file
from captioning.speech import text_to_speech
import os

# Ensure the 'temp' folder exists
if not os.path.exists("temp"):
    os.makedirs("temp")

app = Flask(__name__)


@app.route("/progress", methods=["GET"])
def get_progress():
    progress = app.config.get("tts_progress", 0)
    return jsonify({"progress": progress})


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/tools')
def tools():
    return render_template('tools.html')


@app.route('/how_to_use')
def how_to_use():
    return render_template('how_to_use.html')


@app.route('/about_us')
def about_us():
    return render_template('about_us.html')


@app.route('/examples')
def examples():
    return render_template('examples.html')


@app.route("/generate_caption", methods=["POST"])
def generate_caption_api():
    if 'image_file' in request.files:
        try:
            image_file = request.files['image_file']
            if image_file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            temp_path = os.path.join("temp", image_file.filename)
            image_file.save(temp_path)
            caption = generate_caption_from_file(temp_path)

            if os.path.exists(temp_path):
                os.remove(temp_path)

            return jsonify({"caption": caption})
        except Exception as e:
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500
    elif 'image_url' in request.json:
        try:
            image_url = request.json.get("image_url")
            if not image_url:
                return jsonify({"error": "Image URL is required"}), 400

            caption = generate_caption(image_url)
            return jsonify({"caption": caption})
        except RuntimeError as e:
            return jsonify({"error": str(e)}), 429
        except Exception as e:
            return jsonify({"error": f"Unable to generate caption: {str(e)}"}), 500
    else:
        return jsonify({"error": "No image URL or file provided"}), 400


@app.route("/text_to_speech", methods=["POST"])
def text_to_speech_api():
    data = request.json
    text = data.get("text")
    voice = data.get("voice", "p226")
    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        audio_file_path = text_to_speech(text, voice)
        response = send_file(audio_file_path, mimetype="audio/wav", as_attachment=False)

        @response.call_on_close
        def cleanup_temp_file():
            if os.path.exists(audio_file_path):
                os.remove(audio_file_path)

        return response
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 429
    except Exception as e:
        return jsonify({"error": f"Unable to convert text to speech: {str(e)}"}), 500

@app.before_request
def check_request_size():
    content_length = request.content_length
    # If there's no content in the request (e.g., GET requests), do nothing
    if content_length is None:
        return
    if content_length > 500 * 1024 * 1024:  # Limit: 500 MB
        return "Request payload too large", 413

if __name__ == "__main__":
    app.config["tts_progress"] = 0
    port = int(os.environ.get("PORT", 5000))  # Get the $PORT from environment variables
    app.run(host="0.0.0.0", port=port)  # Bind to Heroku's port
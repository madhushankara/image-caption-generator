import tempfile
from captioning import models_instance  # Import the singleton instance for models
from time import sleep
from flask import current_app  # To store progress in Flask context
import os


def get_temp_dir():
    """
    Returns a writable temporary directory for file storage.
    Use Heroku's '/tmp' directory in production and system's temp dir locally.
    """
    return "/tmp" if os.environ.get("DYNO") else tempfile.gettempdir()


def text_to_speech(text, voice="p226"):
    """
    Converts the input text into speech using the dynamically loaded TTS model with progress tracking.

    Args:
        text (str): Input text to convert to speech.
        voice (str): Speaker voice to use (default: "p226").

    Returns:
        str: File path to the generated speech audio file.
    """
    if models_instance.tts_busy:
        raise RuntimeError("The TTS model is currently busy. Please try again later.")

    # Ensure TTS model is loaded dynamically at runtime
    if models_instance.tts_model is None:
        models_instance.load_tts_model()

    try:
        models_instance.tts_busy = True  # Mark the TTS model as busy
        current_app.config["tts_progress"] = 0  # Reset progress to 0 in Flask context

        # Create temporary file for storing the generated audio
        temp_file = tempfile.NamedTemporaryFile(dir=get_temp_dir(), delete=False, suffix=".wav")
        output_path = temp_file.name

        # Simulate a progress bar (for demo purposes)
        for i in range(1, 101):
            sleep(0.05)  # Simulate a delay to emulate generation process
            current_app.config["tts_progress"] = i

        # Generate speech using the preloaded TTS model
        models_instance.tts_model.tts_to_file(text=text, file_path=output_path, speaker=voice)

        return output_path
    except Exception as e:
        print(f"Error in text-to-speech generation: {e}")
        raise RuntimeError("Failed to generate speech. Please try again later.") from e
    finally:
        models_instance.tts_busy = False  # Free up the TTS model
        current_app.config["tts_progress"] = 0  # Reset progress to 0 in the Flask context
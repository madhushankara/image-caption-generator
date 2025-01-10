from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import requests
from captioning import models_instance  # Import the SingletonModels instance
import os
import tempfile


def get_temp_dir():
    """
    Returns a system-safe temporary directory for temporary file storage.
    On Heroku, it uses /tmp; locally, it defaults to the current directory.
    """
    return tempfile.gettempdir() if os.environ.get("DYNO") else os.path.curdir


def load_blip_model():
    """
    Load the BLIP (Bootstrapped Language-Image Pretraining) processor and model
    dynamically at runtime. This ensures the pre-downloaded models are smaller in size
    for production slug and initializes only when required.
    """
    print("Loading BLIP processor and model...")
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(
        models_instance.device  # Use the device (CPU/GPU) from the singleton instance
    )
    print("BLIP processor and model loaded.")
    return processor, model


# Initialize global processor and model at runtime
processor = None
model = None


def initialize_blip_model():
    """
    Ensures that the BLIP processor and model are initialized only once.
    This avoids the runtime overhead of reloading multiple instances.
    """
    global processor, model
    if processor is None or model is None:
        processor, model = load_blip_model()


def generate_caption(image_url):
    """
    Generates a caption for the given image URL using the BLIP model.
    Allows simple URL-based caption generation.
    """
    if models_instance.captioning_busy:
        raise RuntimeError("The captioning model is currently busy. Please try again later.")

    try:
        models_instance.captioning_busy = True  # Mark the model as busy

        # Load image from the URL
        response = requests.get(image_url, stream=True)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch the image. HTTP Status Code: {response.status_code}")

        image = Image.open(response.raw).convert("RGB")  # Ensure the image is in RGB format

        # Initialize the model if it's not already loaded
        initialize_blip_model()

        # Process the image and generate captions
        inputs = processor(images=image, return_tensors="pt").to(models_instance.device)
        outputs = model.generate(**inputs)

        # Decode and return the caption
        caption = processor.decode(outputs[0], skip_special_tokens=True)
        return caption

    except Exception as e:
        print(f"Error in caption generation: {e}")
        raise RuntimeError(f"Failed to generate caption: {e}") from e

    finally:
        models_instance.captioning_busy = False  # Mark the model as free


def generate_caption_from_file(image_path):
    """
    Generates a caption for a local image file using the BLIP model.
    Allows caption generation for images stored locally on the server.
    """
    if models_instance.captioning_busy:
        raise RuntimeError("The captioning model is currently busy. Please try again later.")

    try:
        models_instance.captioning_busy = True  # Mark the model as busy

        # Open the image file
        image = Image.open(image_path).convert("RGB")  # Ensure the image is in RGB format

        # Initialize the model if it's not already loaded
        initialize_blip_model()

        # Process the image and generate captions
        inputs = processor(images=image, return_tensors="pt").to(models_instance.device)
        outputs = model.generate(**inputs)

        # Decode and return the caption
        caption = processor.decode(outputs[0], skip_special_tokens=True)
        return caption

    except Exception as e:
        print(f"Error in caption generation: {e}")
        raise RuntimeError(f"Failed to generate caption: {e}") from e

    finally:
        models_instance.captioning_busy = False  # Mark the model as free
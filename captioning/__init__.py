from TTS.api import TTS
import torch


class SingletonModels:
    """
    A singleton class to manage dynamically loaded models and busy states
    across different modules.
    """

    def __init__(self):
        # Busy state flags
        self.tts_busy = False
        self.captioning_busy = False  # Re-added flag for captioning model

        # Detect device (use CPU as fallback)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Models initialized as None; loaded dynamically during runtime
        self.captioning_model = None
        self.tts_model = None

    def load_captioning_model(self):
        """
        Loads the image captioning model dynamically at runtime.
        This is lazy-loading to reduce slug size and ensure runtime initialization.
        """
        if self.captioning_model is None:
            print("Loading captioning model...")
            from torchvision import models  # Import only when needed
            self.captioning_model = models.resnet50(pretrained=True).to(self.device)
            self.captioning_model.eval()
            print("Captioning model loaded.")

    def load_tts_model(self):
        """
        Loads the specific TTS model ('tts_models/en/vctk/vits') dynamically at runtime.
        This ensures minimal overhead and reduces slug size.
        """
        if self.tts_model is None:  # Indentation fixed here
            print("Downloading and loading the specific TTS model...")
            from TTS.api import TTS
            self.tts_model = TTS(model_name="tts_models/en/vctk/vits", progress_bar=True)  # Use minimal model
            print("TTS model loaded.")


# Create a single global instance of the models
models_instance = SingletonModels()
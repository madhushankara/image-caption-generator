# AI-Pixel-Prompt
Image Caption Generator with Text-to-Speech
Image-to-Text 
Text-to-Speech

Demo- https://image-caption-generator-hpa9fxc7emd5htfs.southeastasia-01.azurewebsites.net/

# Project Overview
This project leverages advanced AI models for **image caption generation** and **text-to-speech (TTS)** conversion. It provides a streamlined interface to generate image captions using cutting-edge vision-language models and converts text into natural, high-quality speech using a preloaded TTS model. The project is designed for efficient processing, ensuring effective resource utilization and responsiveness.
## AI Models and Libraries Used
### 1. **Image Captioning**
For generating captions from images, the project makes use of the **BLIP (Bootstrapped Language-Image Pretraining)** model:
- **Model**: [Salesforce/blip-image-captioning-base]()
- **Architecture**: The BLIP model combines natural language understanding with image generation capabilities, enabling it to generate descriptive captions for a wide range of images.
- **Libraries**:
    - `transformers` from Hugging Face: For model and processor loading.
    - `Pillow` (PIL): For image handling and processing.
    - `requests`: For image retrieval from external URLs.

### 2. **Speech Generation**
For converting generated captions (or any input text) into speech, the project uses a preloaded Text-to-Speech (TTS) model:
- **Methodology**: The TTS system is designed to handle speech generation asynchronously while ensuring the model is not overloaded during high-demand usage.
- **Libraries and Tools**:
    - A singleton instance (`models_instance`) manages the TTS model and tracks its busy state.
    - `Flask`: Used for tracking progress in server contexts.
    - `tempfile`: Handles temporary storage of generated audio files.

## Key Features
- **Image-to-Caption**: Captions are generated using BLIP, either from image URLs or local files.
- **Caption-To-Speech**: The TTS system takes the generated captions or user-specified text and generates speech files in `.wav` format.
- **Singleton Management**: Both the captioning and TTS components use dedicated locks to prevent multiple simultaneous operations, ensuring consistent and reliable performance.

### Why Use BLIP for Captioning?
BLIP stands out as a state-of-the-art model for vision-language tasks. It is capable of understanding images deeply and generating context-appropriate captions, making it a perfect choice for applications like image search, accessibility tools, and content generation.




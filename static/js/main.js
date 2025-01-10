// Set up drop-zone functionality
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    // Trigger file selection when clicking on the drop zone
    dropZoneElement.addEventListener("click", () => {
        inputElement.click();
    });

    // Handle file selection
    inputElement.addEventListener("change", () => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    // Drag-and-drop functionality
    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, () => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }
        dropZoneElement.classList.remove("drop-zone--over");
    });
});

// Handle dynamic image URL input
const urlInput = document.querySelector(".url-input"); // Input for image URL
const dropZoneElement = document.querySelector(".drop-zone");

urlInput.addEventListener("input", () => {
    const imageUrl = urlInput.value.trim();

    if (imageUrl) {
        validateAndSetImageURL(dropZoneElement, imageUrl);
    } else {
        resetThumbnail(dropZoneElement); // Reset if the input is cleared
    }
});

/**
 * Validates an image URL by attempting to load it and updates the thumbnail if valid.
 *
 * @param {HTMLElement} dropZoneElement - The drop zone container.
 * @param {string} url - The image URL to validate and set as a thumbnail.
 */
function validateAndSetImageURL(dropZoneElement, url) {
    const imgElement = new Image(); // Create a temporary image element for validation

    imgElement.onload = () => {
        // Successfully loaded the image
        updateThumbnailFromURL(dropZoneElement, url);
    };

    imgElement.onerror = () => {
        // Handle invalid or non-image URL
        console.error("Invalid image URL:", url);
        alert("The provided URL is not a valid image. Please use a valid image URL.");
    };

    imgElement.src = url; // Attempt to load the image from the URL
}

/**
 * Updates the thumbnail using a valid image URL.
 *
 * @param {HTMLElement} dropZoneElement - The drop zone container.
 * @param {string} url - The valid image URL.
 */
function updateThumbnailFromURL(dropZoneElement, url) {
    const thumbnailElement = ensureThumbnailContainer(dropZoneElement);

    // Set up new thumbnail element with the image
    const imgElement = document.createElement("img");
    imgElement.src = url;
    imgElement.alt = "Thumbnail from URL";
    imgElement.style.maxWidth = "100%";
    imgElement.style.maxHeight = "100%";

    // Clear previous thumbnail and append the new image
    thumbnailElement.innerHTML = "";
    thumbnailElement.appendChild(imgElement);

    // Hide upload prompts/icons
    hidePromptsAndIcons(dropZoneElement);
}

/**
 * Updates the thumbnail for an uploaded file.
 *
 * @param {HTMLElement} dropZoneElement - The drop zone container.
 * @param {File} file - The uploaded image file.
 */
function updateThumbnail(dropZoneElement, file) {
    const thumbnailElement = ensureThumbnailContainer(dropZoneElement);

    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        // Set up the image element for the thumbnail
        const imgElement = document.createElement("img");
        imgElement.src = reader.result;
        imgElement.alt = file.name;
        imgElement.style.maxWidth = "100%";
        imgElement.style.maxHeight = "100%";

        // Clear previous thumbnail and append the new image
        thumbnailElement.innerHTML = "";
        thumbnailElement.appendChild(imgElement);

        // Hide upload prompts/icons
        hidePromptsAndIcons(dropZoneElement);
    };

    reader.readAsDataURL(file);
}

/**
 * Resets the drop zone to its original state (removes thumbnail).
 *
 * @param {HTMLElement} dropZoneElement - The drop zone container.
 */
function resetThumbnail(dropZoneElement) {
    const thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // Remove the thumbnail if it exists
    if (thumbnailElement) {
        thumbnailElement.remove();
    }

    // Show the upload prompt and icon again
    showPromptsAndIcons(dropZoneElement);
}

/**
 * Ensures the thumbnail container exists in the drop zone.
 * If not, it creates one.
 *
 * @param {HTMLElement} dropZoneElement - The drop zone container.
 * @returns {HTMLElement} - The thumbnail container.
 */
function ensureThumbnailContainer(dropZoneElement) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }

    return thumbnailElement;
}

/**
 * Hides the upload prompt and upload icon from the drop zone.
 *
 * @param {HTMLElement} dropZoneElement - The drop zone container.
 */
function hidePromptsAndIcons(dropZoneElement) {
    dropZoneElement.querySelectorAll(".drop-zone__prompt, .upload").forEach((elem) => {
        elem.style.display = "none";
    });
}

/**
 * Shows the upload prompt and upload icon in the drop zone.
 *
 * @param {HTMLElement} dropZoneElement - The drop zone container.
 */
function showPromptsAndIcons(dropZoneElement) {
    dropZoneElement.querySelectorAll(".drop-zone__prompt, .upload").forEach((elem) => {
        elem.style.display = ""; // Reset to default visibility
    });

    // Add them back if they are missing
    if (!dropZoneElement.querySelector(".drop-zone__prompt")) {
        const promptElement = document.createElement("span");
        promptElement.classList.add("drop-zone__prompt");
        promptElement.textContent = "Drop file here or click to upload";
        dropZoneElement.appendChild(promptElement);
    }

    if (!dropZoneElement.querySelector(".upload")) {
        const uploadIcon = document.createElement("img");
        uploadIcon.src = "images/cloud.png";
        uploadIcon.classList.add("upload");
        uploadIcon.alt = "Upload Icon";
        dropZoneElement.appendChild(uploadIcon);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const urlInput = document.querySelector(".url-input");
    const fileInput = document.querySelector(".drop-zone__input");
    const generateButton = document.querySelector(".generate");

    const loadingSpinner = document.querySelector("#loading-spinner");
    const captionText = document.querySelector("#caption-text");

    // Image upload and URL handling
    let latestInput = null;

    urlInput.addEventListener("input", function () {
        if (urlInput.value.trim() !== "") {
            fileInput.value = "";
            latestInput = "url";
        }
    });

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            urlInput.value = "";
            latestInput = "file";
        }
    });

    // Generate Caption
    generateButton.addEventListener("click", async function () {
        if (latestInput === "url" && urlInput.value.trim() !== "") {
            await generateCaptionFromUrl(urlInput.value.trim());
        } else if (latestInput === "file" && fileInput.files.length > 0) {
            await generateCaptionFromFile(fileInput.files[0]);
        } else {
            alert("Please provide either a valid image URL or upload a file.");
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
    const spinner = document.querySelector(".spinner");
    const button = document.querySelector(".generate");

    button.addEventListener("click", function () {
        // Make spinner visible and animate it in
        spinner.classList.add("show-spinner");
        spinner.classList.remove("hide-spinner");

        // Simulate a loading process (e.g., API call or timeout)
        setTimeout(() => {
            // Animate spinner out
            spinner.classList.add("hide-spinner");

            // Remove "show-spinner" after animation ends
            setTimeout(() => {
                spinner.classList.remove("show-spinner");
            }, 500); // Match the CSS transition duration
        }, 3000); // Simulated "loading" duration
    });
});


    async function generateCaptionFromUrl(imageUrl) {
        const captionSpinner = document.querySelector("#caption-spinner"); // Select the caption spinner
        try {
            captionSpinner.classList.add("show-spinner");
            captionSpinner.classList.remove("hide-spinner");
            const response = await fetch("/generate_caption", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_url: imageUrl }),
            });
            const data = await response.json();
            document.querySelector("#caption-text").value = data.caption || data.error || "An error occurred.";
        } catch (error) {
            console.error(error);
        } finally {
            captionSpinner.classList.add("hide-spinner");
            setTimeout(() => {
                captionSpinner.classList.remove("show-spinner");
            }, 500); // Matches CSS transition duration
        }
    }

    async function generateCaptionFromFile(imageFile) {
        const captionSpinner = document.querySelector("#caption-spinner"); // Select the caption spinner
        try {
            const formData = new FormData();
            formData.append("image_file", imageFile);

            captionSpinner.classList.add("show-spinner");
            captionSpinner.classList.remove("hide-spinner");
            const response = await fetch("/generate_caption", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            document.querySelector("#caption-text").value = data.caption || data.error || "An error occurred.";
        } catch (error) {
            console.error(error);
        } finally {
            captionSpinner.classList.add("hide-spinner");
            setTimeout(() => {
                captionSpinner.classList.remove("show-spinner");
            }, 500); // Matches CSS transition duration
        }
    }

    const playSpeechButton = document.querySelector("#play-speech");

    playSpeechButton.addEventListener("click", async function () {
        const speechSpinner = document.querySelector("#speech-spinner"); // Select the speech spinner
        const text = document.querySelector("#caption-text").value;
        const voice = document.querySelector("#male").checked ? "p226" : "p225";

        try {
            speechSpinner.classList.add("show-spinner");
            speechSpinner.classList.remove("hide-spinner");
            const response = await fetch("/text_to_speech", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, voice }),
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                console.error("Failed to generate speech");
            }
        } catch (error) {
            console.error(error);
        } finally {
            speechSpinner.classList.add("hide-spinner");
            setTimeout(() => {
                speechSpinner.classList.remove("show-spinner");
            }, 500); // Matches CSS transition duration
        }
    });
});


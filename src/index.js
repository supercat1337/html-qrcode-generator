// @ts-check

import jsQR from "jsqr/dist/jsQR.js";

/**
 * @typedef {Object} QRScannerOptions
 * @property {string} dropAreaId - ID of the drop area element
 * @property {string} fileInputId - ID of the file input element
 * @property {string} previewId - ID of the preview image element
 * @property {string} previewAreaId - ID of the preview area container
 * @property {string} resultTextId - ID of the result textarea
 * @property {string} copyBtnId - ID of the copy button
 * @property {string} clearBtnId - ID of the clear button
 */

/**
 * QR Code Scanner class
 * @class
 */
class QRScanner {
    /**
     * @param {QRScannerOptions} options - Configuration options
     */
    constructor(options) {
        /** @type {HTMLElement} */
        this.dropArea = document.getElementById(options.dropAreaId);

        /** @type {HTMLInputElement} */
        this.fileInput = /** @type {HTMLInputElement} */ (
            document.getElementById(options.fileInputId)
        );

        /** @type {HTMLImageElement} */
        this.preview = /** @type {HTMLImageElement} */ (
            document.getElementById(options.previewId)
        );

        /** @type {HTMLElement} */
        this.previewArea = /** @type {HTMLElement} */ (
            document.getElementById(options.previewAreaId)
        );

        /** @type {HTMLTextAreaElement} */
        this.resultText = /** @type {HTMLTextAreaElement} */ (
            document.getElementById(options.resultTextId)
        );

        /** @type {HTMLButtonElement} */
        this.copyBtn = /** @type {HTMLButtonElement} */ (
            document.getElementById(options.copyBtnId)
        );

        /** @type {HTMLButtonElement} */
        this.clearBtn = /** @type {HTMLButtonElement} */ (
            document.getElementById(options.clearBtnId)
        );

        this.init();
    }

    /**
     * Initialize event listeners
     * @private
     */
    init() {
        // Drop area events
        this.dropArea.addEventListener("click", () => this.fileInput.click());
        this.dropArea.addEventListener("dragover", (e) =>
            this.handleDragOver(e)
        );
        this.dropArea.addEventListener("dragleave", () =>
            this.handleDragLeave()
        );
        this.dropArea.addEventListener("drop", (e) => this.handleDrop(e));

        // File input event
        this.fileInput.addEventListener("change", (e) =>
            this.handleFileSelect(e)
        );

        // Clipboard paste event
        document.addEventListener("paste", (e) => this.handlePaste(e));

        // Button events
        this.copyBtn.addEventListener("click", () => this.copyToClipboard());
        this.clearBtn.addEventListener("click", () => this.clearResults());

        // Enable buttons when there's text
        this.resultText.addEventListener("input", () => this.toggleButtons());
    }

    /**
     * Handle drag over event
     * @param {DragEvent} e - Drag event
     * @private
     */
    handleDragOver(e) {
        e.preventDefault();
        this.dropArea.classList.add("dragover");
    }

    /**
     * Handle drag leave event
     * @private
     */
    handleDragLeave() {
        this.dropArea.classList.remove("dragover");
    }

    /**
     * Handle drop event
     * @param {DragEvent} e - Drop event
     * @private
     */
    handleDrop(e) {
        e.preventDefault();
        this.dropArea.classList.remove("dragover");

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            this.processFile(files[0]);
        }
    }

    /**
     * Handle file select event
     * @param {Event} e - Input event
     * @private
     */
    handleFileSelect(e) {
        const target = /** @type {HTMLInputElement} */ (e.target);
        const files = target.files;
        if (files && files.length > 0) {
            this.processFile(files[0]);
        }
    }

    /**
     * Handle paste event from clipboard
     * @param {ClipboardEvent} e - Clipboard event
     * @private
     */
    handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    this.processFile(blob);
                    break;
                }
            }
        }
    }

    /**
     * Scan QR code from image and display only the QR code area
     * @param {HTMLImageElement} img - Image element
     * @private
     */
    scanQRCode(img) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        try {
            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                    inversionAttempts: "dontInvert",
                }
            );

            if (code) {
                this.resultText.value = code.data;

                // Crop and display only the QR code area
                this.displayQRCodeArea(code.location, img);

                this.toggleButtons();
            } else {
                this.resultText.value = "No QR code found";
                this.previewArea.classList.add("hidden");
            }
        } catch (error) {
            this.resultText.value = "Error scanning QR code: " + error.message;
            this.previewArea.classList.add("hidden");
        }
    }

    /**
     * Display only the QR code area from the image
     * @param {{topRightCorner:{x:number, y:number}, topLeftCorner:{x:number, y:number}, bottomRightCorner:{x:number, y:number}, bottomLeftCorner:{x:number, y:number}, topRightFinderPattern: {x:number, y:number}, topLeftFinderPattern: {x:number, y:number}, bottomLeftFinderPattern: {x:number, y:number}}} location - QR code location data object
     * @param {HTMLImageElement} originalImg - Original image element
     * @private
     */
    displayQRCodeArea(location, originalImg) {
        //console.log("QR Code Location:", location);

        const qrCanvas = document.createElement("canvas");
        const qrCtx = qrCanvas.getContext("2d");

        // Calculate QR code boundaries with some padding
        const padding = 10;
        const qrWidth =
            location.bottomRightCorner.x -
            location.topLeftCorner.x +
            padding * 2;
        const qrHeight =
            location.bottomRightCorner.y -
            location.topLeftCorner.y +
            padding * 2;

        // Set canvas size to fit the QR code with padding
        qrCanvas.width = qrWidth;
        qrCanvas.height = qrHeight;

        // Draw only the QR code area with padding
        qrCtx.drawImage(
            originalImg,
            location.topLeftCorner.x - padding,
            location.topLeftCorner.y - padding,
            qrWidth,
            qrHeight,
            0,
            0,
            qrWidth,
            qrHeight
        );

        // Update preview with cropped QR code
        this.preview.src = qrCanvas.toDataURL();
        this.previewArea.classList.remove("hidden");
    }

    /**
     * Process image file for QR code scanning
     * @param {File} file - Image file
     * @private
     */
    processFile(file) {
        if (!file.type.match("image.*")) {
            alert("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            // Create temporary image to get dimensions
            const tempImg = new Image();

            tempImg.onload = () => {
                const target = e.target;
                if (!target) return;

                this.preview.src = e.target.result + "";
                this.scanQRCode(tempImg); // Pass the loaded image for scanning
            };

            if (e.target == null) return;
            tempImg.src = e.target.result + "";
        };
        reader.readAsDataURL(file);
    }

    /**
     * Copy text to clipboard
     * @private
     */
    copyToClipboard() {
        this.resultText.select();
        document.execCommand("copy");

        // Visual feedback
        const originalText = this.copyBtn.textContent;
        this.copyBtn.textContent = "Copied!";
        setTimeout(() => {
            this.copyBtn.textContent = originalText;
        }, 2000);
    }

    /**
     * Clear results and reset UI
     * @private
     */
    clearResults() {
        this.resultText.value = "";
        this.previewArea.classList.add("hidden");
        this.preview.src = "";
        this.fileInput.value = "";
        this.toggleButtons();
    }

    /**
     * Toggle buttons based on result text
     * @private
     */
    toggleButtons() {
        const hasText = this.resultText.value.trim().length > 0;
        this.copyBtn.disabled = !hasText;
        this.clearBtn.disabled = !hasText;
    }
}

// Initialize the scanner when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new QRScanner({
        dropAreaId: "dropArea",
        fileInputId: "fileInput",
        previewId: "qrPreview",
        previewAreaId: "previewArea",
        resultTextId: "resultText",
        copyBtnId: "copyBtn",
        clearBtnId: "clearBtn",
    });
});

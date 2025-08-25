// @ts-check

import qrcode from "qrcode-generator";

// Patch to support Unicode characters properly
// @ts-ignore
qrcode.stringToBytes = function (data) {
    return data;
};

/**
 * QR Code Generator class
 * @class
 */
class QRCodeGenerator {
    /**
     * @constructor
     * @param {string} textInputId - ID of the text input element
     * @param {string} qrCodeContainerId - ID of the QR code container element
     * @param {string} generateBtnId - ID of the generate button
     * @param {string} pasteBtnId - ID of the paste button
     * @param {string} clearBtnId - ID of the clear button
     * @param {number} [maxLength=800] - Maximum text length for QR code
     */
    constructor(
        textInputId,
        qrCodeContainerId,
        generateBtnId,
        pasteBtnId,
        clearBtnId,
        maxLength = 800
    ) {
        /** @type {HTMLTextAreaElement} */
        this.textInput = /** @type {HTMLTextAreaElement} */ (
            document.getElementById(textInputId)
        );

        /** @type {HTMLDivElement} */
        this.qrCodeContainer = /** @type {HTMLDivElement} */ (
            document.getElementById(qrCodeContainerId)
        );

        /** @type {HTMLButtonElement} */
        this.generateBtn = /** @type {HTMLButtonElement} */ (
            document.getElementById(generateBtnId)
        );

        /** @type {HTMLButtonElement} */
        this.pasteBtn = /** @type {HTMLButtonElement} */ (
            document.getElementById(pasteBtnId)
        );

        /** @type {HTMLButtonElement} */
        this.clearBtn = /** @type {HTMLButtonElement} */ (
            document.getElementById(clearBtnId)
        );

        /** @type {number} */
        this.maxLength = maxLength;

        /** @type {HTMLDivElement} */
        this.errorContainer = document.createElement("div");
        this.errorContainer.className = "error-message";
        this.errorContainer.style.color = "red";
        this.errorContainer.style.margin = "10px 0";
        this.textInput.parentNode?.insertBefore(
            this.errorContainer,
            this.textInput.nextSibling
        );

        this.initializeEventListeners();
        this.setupLengthValidation();
    }

    /**
     * Initialize event listeners for buttons
     * @private
     */
    initializeEventListeners() {
        this.generateBtn.addEventListener("click", () => this.generateQRCode());
        this.pasteBtn.addEventListener("click", () => this.pasteText());
        this.clearBtn.addEventListener("click", () => this.clearAll());

        this.textInput.addEventListener("input", () =>
            this.validateInputLength()
        );

        // Generate QR code on Enter key in textarea
        this.textInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.generateQRCode();
            }
        });
    }

    /**
     * Setup input length validation
     * @private
     */
    setupLengthValidation() {
        this.textInput.setAttribute("maxlength", this.maxLength.toString());
    }

    /**
     * Validate input length and show warning if needed
     * @private
     */
    validateInputLength() {
        const text = this.textInput.value;
        if (text.length > this.maxLength * 0.8) {
            // 80% of max length
            const remaining = this.maxLength - text.length;
            this.errorContainer.textContent = `Warning: ${remaining} characters remaining. Very long text may not fit in QR code.`;
        } else {
            this.errorContainer.textContent = "";
        }
    }

    /**
     * Get optimal error correction level based on text length
     * @private
     * @param {string|Uint8Array} text - Input text
     * @returns {'L' | 'M' | 'Q' | 'H'} Error correction level
     */
    getOptimalErrorCorrection(text) {
        // For longer texts, use lower error correction to fit more data
        if (text.length > 500) return "L"; // Low (7%)
        if (text.length > 200) return "M"; // Medium (15%)
        if (text.length > 100) return "Q"; // Quartile (25%)
        return "H"; // High (30%) - better for short texts
    }

    /**
     * Generate QR code from input text with optimal settings
     * @public
     */
    generateQRCode() {
        const text = this.textInput.value.trim();

        if (!text) {
            this.showError("Please enter some text first!");
            return;
        }

        if (text.length > this.maxLength) {
            this.showError(
                `Text is too long! Maximum ${this.maxLength} characters allowed.`
            );
            return;
        }

        let textByteArray = new TextEncoder().encode(text);

        // Clear previous QR code and errors
        this.qrCodeContainer.innerHTML = "";
        this.errorContainer.textContent = "";

        try {
            const errorCorrectionLevel =
                this.getOptimalErrorCorrection(textByteArray);

            // Use typeNumber 0 for auto-detection with Unicode support
            const qr = qrcode(0, errorCorrectionLevel);

            //qr.addData(text, "Byte");
            // Use byte array to support Unicode characters properly
            // @ts-ignore
            qr.addData(textByteArray, "Byte");
            qr.make();

            // Create SVG for better quality scaling
            const svg = this.createQRCodeSVG(qr);
            this.qrCodeContainer.appendChild(svg);

            // Show QR code info
            this.showQRCodeInfo(qr, text.length, errorCorrectionLevel);
        } catch (error) {
            console.error("QR Code generation error:", error);
            this.showError(
                "Error generating QR code. The text might be too long or contain unsupported characters."
            );
        }
    }

    /**
     * Create SVG element for QR code (better quality than canvas)
     * @private
     * @param {any} qr - QR code instance
     * @returns {SVGSVGElement} SVG element
     */
    createQRCodeSVG(qr) {
        const moduleCount = qr.getModuleCount();
        const size = 200;
        const moduleSize = size / moduleCount;

        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        svg.setAttribute("width", size.toString());
        svg.setAttribute("height", size.toString());
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
        svg.style.border = "1px solid #ddd";
        svg.style.background = "white";

        const rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        rect.setAttribute("width", "100%");
        rect.setAttribute("height", "100%");
        rect.setAttribute("fill", "#ffffff");
        svg.appendChild(rect);

        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (qr.isDark(row, col)) {
                    const rect = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "rect"
                    );
                    rect.setAttribute("x", (col * moduleSize).toString());
                    rect.setAttribute("y", (row * moduleSize).toString());
                    rect.setAttribute("width", moduleSize.toString());
                    rect.setAttribute("height", moduleSize.toString());
                    rect.setAttribute("fill", "#000000");
                    svg.appendChild(rect);
                }
            }
        }

        return svg;
    }

    /**
     * Show QR code generation information
     * @private
     * @param {any} qr - QR code instance
     * @param {number} textLength - Length of the input text
     * @param {string} errorCorrection - Error correction level used
     */
    showQRCodeInfo(qr, textLength, errorCorrection) {
        const info = document.createElement("div");
        info.style.marginTop = "10px";
        info.style.fontSize = "12px";
        info.style.color = "#666";

        const moduleCount = qr.getModuleCount();
        info.textContent =
            `QR Code: ${moduleCount}x${moduleCount} modules | ` +
            `Text: ${textLength} chars | ` +
            `Error correction: ${errorCorrection}`;

        this.qrCodeContainer.appendChild(info);
    }

    /**
     * Show error message
     * @private
     * @param {string} message - Error message
     */
    showError(message) {
        this.errorContainer.textContent = message;
        setTimeout(() => {
            this.errorContainer.textContent = "";
        }, 5000);
    }

    /**
     * Paste text from clipboard
     * @public
     * @async
     */
    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();

            if (text.length > this.maxLength) {
                this.showError(
                    `Pasted text is too long! Only first ${this.maxLength} characters will be used.`
                );
                this.textInput.value = text.substring(0, this.maxLength);
            } else {
                this.textInput.value = text;
            }

            this.validateInputLength();
        } catch (error) {
            console.error("Failed to read from clipboard:", error);
            this.showError(
                "Unable to paste from clipboard. Please check browser permissions."
            );
        }
    }

    /**
     * Clear input and QR code
     * @public
     */
    clearAll() {
        this.textInput.value = "";
        this.qrCodeContainer.innerHTML = "";
        this.errorContainer.textContent = "";
    }
}

// Initialize the QR code generator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new QRCodeGenerator(
        "textInput",
        "qrcode",
        "generateBtn",
        "pasteBtn",
        "clearBtn",
        1000 // Maximum 1000 characters
    );
});

# QR Code Generator Web App

A lightweight, client-side web application that generates QR codes from text input with a clean and intuitive interface.

## 🌟 Features

-   **Instant QR Generation**: Convert text to QR codes in real-time
-   **Paste Functionality**: One-click paste from clipboard
-   **Clean UI**: Modern, responsive design that works on all devices
-   **No Server Required**: Everything happens locally in your browser
-   **Text Validation**: Smart length validation with visual feedback
-   **High Quality**: SVG-based QR codes for crisp rendering
-   **Privacy Focused**: Your data never leaves your device

## 🚀 Live Demo

[View Live Application](https://supercat1337.github.io/qr-code-generator/)

## 📦 Installation & Usage

### Option 1: Direct Download

1. Download all files from the repository
2. Open `index.html` in any modern web browser
3. Start generating QR codes instantly!

### Option 2: Clone Repository

```bash
git clone https://github.com/supercat1337/html-qrcode-generator.git
cd html-qrcode-generator
# Open index.html in your browser
```

### Option 3: Deploy to Web Server

Upload all files to your web server or hosting platform (Netlify, Vercel, GitHub Pages, etc.)

## 🎯 How to Use

1. **Enter Text**: Type or paste your text into the textarea
2. **Generate**: Click "Generate QR Code" or press Enter
3. **Paste**: Use "Paste Text" to quickly insert from clipboard
4. **Clear**: Reset everything with the "Clear" button
5. **Download**: Right-click on the QR code to save the image

### Browser Requirements

-   **Chrome**: 60+
-   **Firefox**: 55+
-   **Safari**: 13+
-   **Edge**: 79+
-   **Mobile**: iOS Safari, Chrome Mobile

### Technologies Used

-   **Pure JavaScript**: No frameworks or build tools required
-   **qrcode-generator**: Lightweight library (~8 KB)
-   **SVG Rendering**: High-quality vector QR codes
-   **Clipboard API**: Modern paste functionality
-   **CSS Grid/Flexbox**: Responsive layout

## 🔧 Customization

### Modify Styling

Edit the `<style>` section in `index.html` to customize colors, sizes, and layout:

```css
/* Example customization */
#generateBtn {
    background-color: #ff6b6b; /* Change button color */
}

textarea {
    height: 150px; /* Increase textarea height */
}
```

### Change Maximum Length

Modify the `maxlength` attribute in the textarea:

```html
<textarea id="textInput" maxlength="2000">...</textarea>
```

### Add Download Button

Add this JavaScript to enable QR code downloads:

```javascript
// Add to your QRCodeGenerator class
addDownloadButton() {
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download QR Code';
    downloadBtn.addEventListener('click', () => this.downloadQRCode());
    this.qrCodeContainer.appendChild(downloadBtn);
}
```

## 📱 Responsive Design

The application is fully responsive and works on:

-   **Desktop computers** (600px max-width layout)
-   **Tablets** (adaptive layout)
-   **Mobile phones** (touch-friendly buttons)
-   **Print media** (QR codes remain clear when printed)

## 🔒 Privacy & Security

-   **No Tracking**: Zero analytics or tracking scripts
-   **No Data Collection**: All processing happens locally
-   **No External Requests**: Works completely offline after loading
-   **Secure**: Uses modern Clipboard API with user permission

## 🌐 Browser Compatibility

| Feature           | Chrome | Firefox | Safari | Edge |
| ----------------- | ------ | ------- | ------ | ---- |
| QR Generation     | ✅     | ✅      | ✅     | ✅   |
| Clipboard Paste   | ✅     | ✅      | ✅     | ✅   |
| SVG Rendering     | ✅     | ✅      | ✅     | ✅   |
| Responsive Design | ✅     | ✅      | ✅     | ✅   |

## 🐛 Troubleshooting

### Common Issues

1. **Paste not working**:

    - Ensure you're using HTTPS
    - Grant clipboard permissions when prompted

2. **QR code not generating**:

    - Check browser console for errors
    - Ensure JavaScript is enabled

3. **Layout issues**:
    - Clear browser cache
    - Try a different browser

### Debug Mode

Open browser developer tools (F12) to see detailed error messages and generation logs.

## 📄 License

## MIT License - feel free to use this application for personal or commercial projects.

**Note**: This is a static web application - no installation, no build process, just open and use!

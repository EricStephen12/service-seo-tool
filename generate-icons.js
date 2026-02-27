const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, 'extension', 'icons');
if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

// Create a simple SVG for the icon
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="64" fill="black"/>
    <path d="M150 100L110 300H270L230 450" stroke="#FF6B00" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M350 100L310 300H470L430 450" stroke="#FF6B00" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
</svg>
`;

async function generateIcons() {
    const sizes = [16, 48, 128];
    for (const size of sizes) {
        await sharp(Buffer.from(svg))
            .resize(size, size)
            .png()
            .toFile(path.join(iconDir, `icon${size}.png`));
        console.log(`Generated icon${size}.png`);
    }
}

generateIcons().catch(err => {
    console.error(err);
    process.exit(1);
});

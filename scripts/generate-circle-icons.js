const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generate() {
  const input = path.join(__dirname, 'public', 'logo_dark.png');
  
  if (!fs.existsSync(input)) {
    console.error(`Error: Could not find ${input}`);
    return;
  }
  
  const sizes = [16, 32, 48, 180, 512];
  for (const size of sizes) {
    const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`;
    const outputPath = path.join(__dirname, 'public', name);
    
    // The logo will take up 65% of the canvas to allow for comfortable white padding
    const logoSize = Math.floor(size * 0.65);
    
    // 1. Create a pure white circle SVG background
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
         <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#ffffff" />
       </svg>`
    );
    
    // 2. Resize the logo to fit comfortably inside the circle (trimming transparent edges first)
    const logoBuffer = await sharp(input)
      .trim() // removes any excess transparent space around the logo
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
      
    // 3. Composite the logo on top of the white circle exactly in the center
    await sharp(circleSvg)
      .composite([{ input: logoBuffer, gravity: 'center' }])
      .png()
      .toFile(outputPath);
      
    console.log(`Generated ${name} with white circular background`);
  }
}

generate().catch(console.error);

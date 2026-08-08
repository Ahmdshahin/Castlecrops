const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generate() {
  const input = path.join(__dirname, 'public', 'logo_dark.png');
  
  // Ensure the input file exists
  if (!fs.existsSync(input)) {
    console.error(`Error: Could not find ${input}`);
    return;
  }
  
  // Define sizes
  const sizes = [16, 32, 48, 180, 512];
  for (const size of sizes) {
    const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`;
    const outputPath = path.join(__dirname, 'public', name);
    
    // Resize preserving aspect ratio (contain) and transparent background
    await sharp(input)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(outputPath);
    console.log(`Generated ${name}`);
  }
  
  // Create ICO from 16, 32, 48
  try {
    const buf = await pngToIco([
      path.join(__dirname, 'public', 'icon-16x16.png'), 
      path.join(__dirname, 'public', 'icon-32x32.png'), 
      path.join(__dirname, 'public', 'icon-48x48.png')
    ]);
    fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), buf);
    console.log('Generated favicon.ico');
  } catch (error) {
    console.error('Error generating ICO:', error);
  }
}

generate().catch(console.error);

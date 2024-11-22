const fs = require('fs-extra');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'mediainfo.js', 'dist', 'MediaInfoModule.wasm');
const dest = path.join(__dirname, '..', 'public', 'MediaInfoModule.wasm');

// Ensure the `public` directory exists
fs.ensureDir(path.join(__dirname, '..', 'public'))
  .then(() => fs.copy(src, dest))
  .then(() => console.log('MediaInfoModule.wasm copied to public directory.'))
  .catch((err) => console.error('Error copying MediaInfoModule.wasm:', err));
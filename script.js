/* Canvas preprocessing only: resize, grayscale, invert. Nothing is uploaded. */
'use strict';
const original = document.querySelector('#original');
const processed = document.querySelector('#processed');
const statusText = document.querySelector('#status');
const download = document.querySelector('#download');
let requestId = 0;
function prepareSketch(source) {
  const ticket = ++requestId;
  const image = new Image();
  image.onload = () => {
    if (ticket !== requestId) return;
    const input = original.getContext('2d');
    input.fillStyle = '#fff';
    input.fillRect(0, 0, 512, 512);
    // Match the model input size; source aspect ratio may change.
    input.drawImage(image, 0, 0, 512, 512);
    const pixels = input.getImageData(0, 0, 512, 512);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const gray = Math.round(.299 * pixels.data[i] + .587 * pixels.data[i + 1] + .114 * pixels.data[i + 2]);
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255 - gray;
      pixels.data[i + 3] = 255;
    }
    processed.getContext('2d').putImageData(pixels, 0, 0);
    document.querySelector('.grid').classList.add('ready');
    download.disabled = false;
    statusText.textContent = 'Ready · 512 × 512 PNG · Grayscale and inverted. No AI render generated.';
    if (source.startsWith('blob:')) URL.revokeObjectURL(source);
  };
  image.onerror = () => {
    statusText.textContent = 'Could not read image. Try PNG, JPEG or WebP.';
    if (source.startsWith('blob:')) URL.revokeObjectURL(source);
  };
  image.src = source;
}
document.querySelector('#sample').onclick = () => prepareSketch(document.querySelector('#sample-source').src);
document.querySelector('#upload').onchange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) {
    statusText.textContent = 'Choose PNG, JPEG or WebP smaller than 15 MB.';
    return;
  }
  prepareSketch(URL.createObjectURL(file));
};
// Blob download keeps the processed PNG local and releases temporary memory.
download.onclick = () => processed.toBlob((blob) => {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'remodelvision-preprocessed-512.png';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}, 'image/png');

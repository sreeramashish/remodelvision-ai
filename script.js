/* Canvas-only prepare_sketch: resize, grayscale, invert. No inference or network upload. */
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
    // Exact model input dimensions; aspect ratio may change.
    input.drawImage(image, 0, 0, 512, 512);
    const pixels = input.getImageData(0, 0, 512, 512);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const gray = Math.round(0.299 * pixels.data[i] + 0.587 * pixels.data[i + 1] + 0.114 * pixels.data[i + 2]);
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255 - gray;
      pixels.data[i + 3] = 255;
    }
    processed.getContext('2d').putImageData(pixels, 0, 0);
    download.disabled = false;
    statusText.textContent = 'Ready: grayscale → 512 × 512 → inverted. Preprocessing only; no AI render generated.';
    if (source.startsWith('blob:')) URL.revokeObjectURL(source);
  };
  image.onerror = () => {
    if (source.startsWith('blob:')) URL.revokeObjectURL(source);
    statusText.textContent = 'Could not read this image. Try a PNG, JPEG or WebP file.';
  };
  image.src = source;
}
document.querySelector('#sample').addEventListener('click', () => prepareSketch(document.querySelector('#sample-source').src));
document.querySelector('#upload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) {
    statusText.textContent = 'Choose a PNG, JPEG or WebP image smaller than 15 MB.';
    return;
  }
  prepareSketch(URL.createObjectURL(file));
});
download.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'remodelvision-preprocessed-512.png';
  link.href = processed.toDataURL('image/png');
  link.click();
});

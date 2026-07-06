export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

// Cheap, fast (<50ms) heuristic to reject obvious non-document photos
// (landscape shots, selfies) uploaded as a "CV". Scanned/photographed
// documents are mostly a light, low-saturation background; camera photos
// of people or scenery have much more color variety. This is a rough
// signal, not real image recognition — it only needs to catch the clearly
// wrong cases without adding a heavy (and slow) ML/OCR dependency.
export async function looksLikeDocumentImage(file) {
  if (typeof window === 'undefined' || typeof createImageBitmap !== 'function') return true;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return true; // can't decode it here — don't block the upload on that
  }

  const size = 48;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, size, size);
  bitmap.close?.();

  const { data } = ctx.getImageData(0, 0, size, size);
  let lightCount = 0;
  let satTotal = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const saturation = max === 0 ? 0 : (max - min) / max;

    if (luminance > 200) lightCount++;
    satTotal += saturation;
  }

  const lightFraction = lightCount / pixelCount;
  const avgSaturation = satTotal / pixelCount;

  return lightFraction > 0.35 && avgSaturation < 0.35;
}

export async function parseFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'docx') return parseDOCX(file);
  // Image uploads (scanned CVs) have no text layer to extract — skip
  // straight to manual entry instead of feeding a non-PDF into pdf.js.
  if (IMAGE_EXTENSIONS.includes(ext ?? '')) {
    return { fullName: '', email: '', phone: '', location: '' };
  }
  return parsePDF(file);
}

async function parseDOCX(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return extractPersonalInfo(result.value);
}

async function parsePDF(file) {

  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;


  let fullText = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(' ') + '\n';
  }

  return extractPersonalInfo(fullText);
}

function extractPersonalInfo(text) {
  const lines = text.split(/\s{2,}|\n/).map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,}/);

  const phoneMatch = text.match(
    /(\+?1?\s?[\-(.]?\d{3}[\s\-.)]+\d{3}[\s\-.]+\d{4}|\+[\d\s\-]{9,17})/
  );

  const nameLine =
    lines.find(
      (line) =>
        line.length > 3 &&
        line.length < 55 &&
        !line.includes('@') &&
        !/^\+?\d/.test(line) &&
        !/^(curriculum|resume|cv |page |\d)/i.test(line) &&
        /[a-zA-Z]/.test(line)
    ) || '';

  const locationMatch = text.match(/([A-Z][a-zA-Z\s.]+),\s*([A-Z][a-zA-Z\s]{2,})/);


  return {
    fullName: nameLine,
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0]?.trim() || '',
    location: locationMatch
      ? `${locationMatch[1].trim()}, ${locationMatch[2].trim()}`
      : '',
  };
}

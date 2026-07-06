const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

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

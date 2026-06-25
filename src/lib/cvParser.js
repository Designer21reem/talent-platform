export async function parseFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'docx') return parseDOCX(file);
  return parsePDF(file);
}

async function parseDOCX(file) {
  console.log('[cvParser] Starting DOCX parse for:', file.name);
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  console.log('[cvParser] DOCX text extracted, length:', result.value.length);
  return extractPersonalInfo(result.value);
}

async function parsePDF(file) {
  console.log('[cvParser] Starting PDF parse for:', file.name);

  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  console.log('[cvParser] PDF loaded — pages:', pdf.numPages);

  let fullText = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(' ') + '\n';
  }

  console.log('[cvParser] Text extracted, length:', fullText.length);
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

  console.log('[cvParser] Extracted — name:', nameLine, '| email:', emailMatch?.[0], '| phone:', phoneMatch?.[0]);

  return {
    fullName: nameLine,
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0]?.trim() || '',
    location: locationMatch
      ? `${locationMatch[1].trim()}, ${locationMatch[2].trim()}`
      : '',
  };
}

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// Simple, lightweight PDF generator script producing valid PDF 1.4 documents
function createPDF(title, sections) {
  let objectCount = 0;
  const offsets = [];

  function addObject(content) {
    objectCount++;
    offsets.push(buffer.length);
    buffer.write(`${objectCount} 0 obj\n${content}\nendobj\n\n`, buffer.length);
    return objectCount;
  }

  let buffer = Buffer.alloc(0);

  // Helper to append text to buffer
  const append = (str) => {
    buffer = Buffer.concat([buffer, Buffer.from(str)]);
  };

  append('%PDF-1.4\n');

  // Object 1: Catalog
  const catalogId = 1;
  offsets.push(buffer.length);
  append('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n\n');

  // Object 2: Pages
  offsets.push(buffer.length);
  append('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n\n');

  // Page Content stream construction
  let streamText = `
BT
/F1 22 Tf
50 750 Td
(${title}) Tj
ET

BT
/F2 11 Tf
50 725 Td
(Official Product Whitepaper & Deployment Guide) Tj
ET

BT
/F2 10 Tf
50 705 Td
(------------------------------------------------------------------------------------------------------------------------) Tj
ET
`;

  let y = 680;
  sections.forEach((sec) => {
    streamText += `
BT
/F1 13 Tf
50 ${y} Td
(${sec.heading}) Tj
ET
`;
    y -= 20;

    sec.lines.forEach((line) => {
      // Escape parentheses in PDF string literal
      const safeLine = line.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      streamText += `
BT
/F2 9.5 Tf
50 ${y} Td
(${safeLine}) Tj
ET
`;
      y -= 15;
    });

    y -= 10;
  });

  const streamBuf = Buffer.from(streamText.trim());

  // Object 3: Page
  offsets.push(buffer.length);
  append(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n\n`);

  // Object 4: Stream
  offsets.push(buffer.length);
  append(`4 0 obj\n<< /Length ${streamBuf.length} >>\nstream\n${streamText}\nendstream\nendobj\n\n`);

  // Object 5: Font F1 (Helvetica Bold)
  offsets.push(buffer.length);
  append('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n\n');

  // Object 6: Font F2 (Helvetica Regular)
  offsets.push(buffer.length);
  append('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n\n');

  // XRef Table
  const xrefOffset = buffer.length;
  append(`xref\n0 7\n0000000000 65535 f \n`);
  for (let i = 0; i < offsets.length; i++) {
    const pad = offsets[i].toString().padStart(10, '0');
    append(`${pad} 00000 n \n`);
  }

  // Trailer
  append(`trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return buffer;
}

const sections = [
  {
    heading: '1. Executive Summary & Vision',
    lines: [
      'Extension Inspector AI is the world smartest, privacy-first Browser Intelligence Platform.',
      'Designed as a lightweight Manifest V3 Chrome extension, it explains what installed extensions do,',
      'how they affect CPU/RAM performance, whether they can be trusted, and recommends actions in plain English.'
    ]
  },
  {
    heading: '2. Why Extension Inspector AI is Unique Over Traditional Extension Managers',
    lines: [
      '• Event-Driven Architecture: 0% idle CPU usage. Background service worker sleeps when inactive.',
      '• No Web Page Script Pollution: Zero React or heavy script injection into visited websites.',
      '• Flagship Extension DNA Engine: Analyzes browser ecosystem as a cohesive system rather than isolated tools.',
      '• Duplicate Feature Detector: Identifies functional redundancy (e.g. 3 PDF viewers) & calculates RAM saved.',
      '• Category Conflict Detector: Pinpoints overlapping network hooks (e.g. multiple ad blockers or password managers).',
      '• Plain-English Permission Translation: Converts raw Chrome permissions (<all_urls>, debugger) to human advice.',
      '• 100% Local & Privacy First: No remote servers, telemetry, or external data tracking.'
    ]
  },
  {
    heading: '3. Core Engine Architecture',
    lines: [
      '• Discovery Engine: Parses manifest specifications, permissions, icons, and host access levels.',
      '• Trust Engine: Calculates explainable Trust Scores (0-100) & Grades (A+ to F) based on deterministic criteria.',
      '• Behavior Engine: Infers script injection, network interception, cookie reading, and category types.',
      '• Privacy Engine: Evaluates host access reach (<all_urls>) and sensitive cookie exposure.',
      '• Performance Engine: Computes estimated RAM memory footprint (MB) and startup delay impact (ms).',
      '• Recommendation Engine: Provides prioritized 1-click advice (Disable, Uninstall, Review, Keep).'
    ]
  },
  {
    heading: '4. Quick Start & Usage Instructions',
    lines: [
      '1. Open Google Chrome and navigate to chrome://extensions.',
      '2. Enable Developer mode in the top-right header.',
      '3. Click "Load unpacked" and select the extension build dist folder.',
      '4. Click the Extension Inspector AI toolbar icon to launch the Browser Intelligence Dashboard.'
    ]
  }
];

const pdfBuffer = createPDF('Extension Inspector AI', sections);
const targetPath = resolve('Extension_Inspector_AI_Product_Guide.pdf');
writeFileSync(targetPath, pdfBuffer);

console.log(`PDF successfully generated at: ${targetPath}`);

import { readFileSync, writeFileSync } from 'node:fs';
import { extractRawText } from 'mammoth';

(async () => {
  try {
    const buf = readFileSync('Dac-ta-Master-v3.0-SRS-TRD.docx');
    const out = await extractRawText({ buffer: buf });
    writeFileSync('inspect-text.txt', out.value);
    console.log('lines:', out.value.split('\n').length);
    console.log('messages:', JSON.stringify(out.messages));
  } catch (e) {
    if (String(e).includes("Cannot find module 'mammoth'")) {
      console.error('NEED_MAMMOTH');
    } else {
      console.error(e);
    }
  }
})();

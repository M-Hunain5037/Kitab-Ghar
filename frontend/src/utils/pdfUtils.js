// src/utils/pdfUtils.js
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

export const extractFirstPageAsImage = async (bookFile) => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async () => {
      try {
        const pdfBytes = new Uint8Array(fileReader.result);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const firstPage = pdfDoc.getPage(0);

        // Render the first page to an image
        const viewport = firstPage.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const pdfDocument = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
        const page = await pdfDocument.getPage(1); // Get the first page
        await page.render(renderContext).promise;

        const imageUrl = canvas.toDataURL('image/png');
        resolve(imageUrl);
      } catch (error) {
        reject(error);
      }
    };

    fileReader.readAsArrayBuffer(bookFile);
  });
};

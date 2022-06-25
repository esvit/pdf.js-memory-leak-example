import fs from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.js';
import { createCanvas } from 'canvas';

const filename = 'page.pdf';

class NodeCanvasFactory
{
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

async function bootstrap() {
  const doc = await getDocument({
    disableFontFace: true,
    fontExtraProperties: true,
    useSystemFonts: true,
    data: fs.readFileSync(filename)
  }).promise;
  const page = await doc.getPage(1);

  const canvasFactory = new NodeCanvasFactory();

  const viewport = page.getViewport({ scale: 1 });
  const ctx = canvasFactory.create(viewport.width, viewport.height);

  await page.render({
    canvasContext: ctx.context,
    viewport,
    canvasFactory
  });
}

bootstrap();

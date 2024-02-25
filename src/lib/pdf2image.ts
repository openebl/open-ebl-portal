import { Poppler } from "node-poppler";
import os from "os";
import sharp from "sharp";
import { getLogger } from "./logger";

export const pdf2Image = async ({filename, onPage, onComplete}: {
  filename: string,
  onPage: (img: Buffer, thumbnail: Buffer, page: number) => Promise<void>,
  onComplete?: () => void,
}) => {
  const logger = getLogger();
  const poppler = createPoppler();

  let page = 1;
  while (true) {
    const options = {
      firstPageToConvert: page,
      pngFile: true,
      singleFile: true,
    };

    try {
      logger.debug(`Reading PDF file ${filename} page ${page}`);

      const res = await poppler.pdfToCairo(filename, undefined, options);
      const buffer = Buffer.from(res, "binary");
      const img = sharp(buffer);
      const pageImgBuffer = await img.webp().toBuffer();
      const pageThumbnailBuffer = await img
        .resize(180, 250, { fit: "inside" })
        .webp()
        .toBuffer();
      await onPage(pageImgBuffer, pageThumbnailBuffer, page);
    } catch (err) {
      if (page === 1) throw err;
      break;
    }
    page += 1;
  }
  onComplete?.();
};

const createPoppler = () => {
  if (os.platform() === "linux") {
    return new Poppler("/usr/bin");
  } else if (os.platform() === "darwin") {
    return new Poppler("/opt/homebrew/Cellar/poppler/24.02.0/bin");
  }

  return new Poppler();
};

import fs from 'fs';
import path from 'path';
import helper from '../helper';
import sharp from 'sharp';
function createWebp(dir: string, options: UserOptions) {
  if (fs.existsSync(dir) === false) {
    return;
  }
  const { imageType } = options;
  const files = fs.readdirSync(dir);
  files.forEach((v) => {
    const abs = path.join(dir, v);
    if (helper.isDirectory(abs)) {
      createWebp(abs, options);
    } else if (helper.isTargetImage(abs, imageType)) {
      const nPath = helper.getWebpPath(abs);
      sharp(abs).webp().toFile(nPath, (err) => {
        if (err) {
          return
        }
      });
    }
  })
}
export const webp = (options: UserOptions) => {
  const { onlyWebp } = options;
  const arr = helper.toArray(onlyWebp);
  for (let i = 0; i < arr.length; i++) {
    const dir: string = arr[i];
    createWebp(dir, options);
  }
}

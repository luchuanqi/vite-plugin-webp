import sharp from 'sharp';
import { resizeReg } from '../config/regexp';
const sharpWebp = (absPath: string, nPath: string): Promise<any> => {
  let width = null;
  let height = null;
  resizeReg.lastIndex = 0;
  if (resizeReg.test(nPath)) {
    width = Number(RegExp.$1);
    height = Number(RegExp.$2);
  }
  return new Promise((resolve, reject) => {
    try {
      sharp(absPath)
        .resize({ width, height })
        .webp()
        .toFile(nPath, (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        });
    } catch (e) {
      reject(e)
    }
  })
}
export default sharpWebp;

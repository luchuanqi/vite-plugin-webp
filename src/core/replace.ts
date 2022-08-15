import sharp from 'sharp';
import fs from 'fs';
import { toCSS } from 'cssjson';
import { cssUrlReg } from '../config/regexp';
import helper from '../helper';

const replaceItem = (str: string, options: UserOptions, { id }: TransformParams): Promise<string> => {
  return new Promise(resolve => {
    const { imageType, alias } = options;
    str.replace(cssUrlReg, (a: string, url: string): any => {
      url = helper.evalCatch(url);
      const absPath: string = helper.getAbsoluteDir(id, url, alias);
      const nPath = helper.getWebpPath(absPath);
      const nUrl = helper.getWebpPath(url);
      if (fs.existsSync(nPath)) {
        resolve(str.replace(url, nUrl));
      } else {
        sharp(absPath).webp().toFile(nPath, (err, info) => {
          if (err) {
            resolve('');
          } else {
            resolve(str.replace(url, nUrl));
          }
        });
      }
    })
  })
}
const replaceAll = async (list: StandardItem[], options: UserOptions, { id }: TransformParams) => {
  const { container } = options;
  let cssStr = '';
  for(let i = 0; i < list.length;) {
    const css = toCSS(list[i]);
    if (css.startsWith(container) === false) {
      cssStr += await replaceItem(`${container} ${css}`, options, { id });
    }
    i++;
  }
  return cssStr;
}
export {
  replaceItem,
  replaceAll
};

import sharpWebp from '../webp/sharp';
import fs from 'fs';
import { toCSS } from 'cssjson';
import { cssUrlReg } from '../config/regexp';
import helper from '../helper';

const replaceItem = (str: string, options: UserOptions, { id }: TransformParams): Promise<string> => {
  return new Promise(resolve => {
    const { alias, sharpOptions } = options;
    cssUrlReg.lastIndex = 0;
    if (cssUrlReg.test(str)) {
      const url = helper.evalCatch(RegExp.$1);
      const absPath: string = helper.getAbsoluteDir(id, url, alias);
      const nPath = helper.getWebpPath(absPath);
      const nUrl = helper.getWebpPath(url);
      if (fs.existsSync(nPath)) {
        resolve(str.replace(url, nUrl));
      } else {
        sharpWebp(absPath, nPath, sharpOptions).then(() => {
          resolve(str.replace(url, nUrl));
        }).catch(() => {
          resolve('');
        })
      }
    }
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

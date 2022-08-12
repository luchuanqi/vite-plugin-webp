import fs from 'fs';
import path from 'path';
function toArray(data: string | string[]): string[] {
  if (typeof data === 'string') {
    return data ? [data] : [];
  }
  return data;
}

function isDirectory(path: string): boolean {
  return fs.statSync(path).isDirectory();
}

function evalCatch(data: any): any {
  try {
    return eval(data);
  } catch (_) {
    return data;
  }
}
function getAbsoluteDir(id: string, p: string, alias: AliasItem[]): string {
  const findArr = p.split('/');
  const { replacement } = alias.find(v => v.find === findArr[0]) || {};
  let res = '';
  if (replacement) {
    // 绝对目录
    res = `${replacement}/${findArr.slice(1).join('/')}`
  } else {
    // 相对目录静态目录文件
    res = path.join(id, '../', p);
  }
  return res;
}
function isTargetImage(id: string, imageType: string[]): boolean {
  const arr = evalCatch(id).split('.');
  const suffix = arr[arr.length - 1];
  return imageType.includes(`.${suffix}`);
}

function getWebpPath(id: string): string {
  const arr = id.split('.');
  const suffix = arr[arr.length - 1];
  const reg = new RegExp(`${suffix}$`);
  return id.replace(reg, 'webp')
}
export default {
  toArray,
  isDirectory,
  evalCatch,
  isTargetImage,
  getWebpPath,
  getAbsoluteDir
}

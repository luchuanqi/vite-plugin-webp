export const styleReg: RegExp = /<style([^<>]*)>([^<>]+)<\/style>/gm;
export const cssUrlReg: RegExp = /url\((.+)\).*/gm;
export const imgTypeReg = (type:string[]): RegExp => {
  return new RegExp(`\.\(${type.join('|')}\)$`)
}
/**
 * images resize
 * @param type
 * @return  {
 *   RegExp.$1: width
 *   RegExp.$2: height
 * }
 */
export const resizeReg = /\D+(\d+)[xX*](\d+)\.webp$/

export const styleReg: RegExp = /<style([^<>]*)>([^<>]+)<\/style>/gm;
export const cssUrlReg: RegExp = /url\((.+)\).*/gm;
export const imgTypeReg = (type:string[]): RegExp => {
  return new RegExp(`\.\(${type.join('|')}\)$`)
}
/**
 * images resize
 * @param type
 * @return } {
 *   RegExp.$1: width
 *   RegExp.$2: height
 *   RegExp.$3: type
 * }
 */
export const resizeReg = (type: string[]): RegExp => {
  return new RegExp(`\\D+(\\d+)[xX](\\d+)\(${type.join('|')}\)`, 'g');
}

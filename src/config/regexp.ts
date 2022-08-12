export const styleReg: RegExp = /<style([^<>]*)>([^<>]+)<\/style>/gm;
export const cssUrlReg: RegExp = /url\((.+)\).*/gm;
export const imgTypeReg = (type:string[]): RegExp => {
  return new RegExp(`\.\(${type.join('|')}\)$`)
}

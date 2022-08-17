export declare const styleReg: RegExp;
export declare const cssUrlReg: RegExp;
export declare const imgTypeReg: (type: string[]) => RegExp;
/**
 * images resize
 * @param type
 * @return } {
 *   RegExp.$1: width
 *   RegExp.$2: height
 *   RegExp.$3: type
 * }
 */
export declare const resizeReg: (type: string[]) => RegExp;

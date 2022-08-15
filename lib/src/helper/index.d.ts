declare function toArray(data: string | string[]): string[];
declare function isDirectory(path: string): boolean;
declare function evalCatch(data: any): any;
declare function getAbsoluteDir(id: string, p: string, alias: AliasItem[]): string;
declare function isTargetImage(id: string, imageType: string[]): boolean;
declare function getWebpPath(id: string): string;
declare const _default: {
    toArray: typeof toArray;
    isDirectory: typeof isDirectory;
    evalCatch: typeof evalCatch;
    isTargetImage: typeof isTargetImage;
    getWebpPath: typeof getWebpPath;
    getAbsoluteDir: typeof getAbsoluteDir;
};
export default _default;

declare const _default: {
    isDirectory(path: string): Promise<boolean>;
    getFullPath(dir: string, file: string): string;
    evalCatch(data: any): any;
    getAbsoluteDir(id: string, p: string, alias: AliasItem[]): string;
};
export default _default;

export default class Ignore {
    static suffixFile(id: string, options: UserOptions): boolean;
    static includeDir(id: string, options: UserOptions): boolean;
    static decludeDir(id: string, options: UserOptions): boolean;
}
export declare const ignoreFiles: (id: string, options: UserOptions) => boolean;

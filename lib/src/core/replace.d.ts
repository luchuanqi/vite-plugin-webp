declare const replaceItem: (str: string, options: UserOptions, { id }: TransformParams) => Promise<string>;
declare const replaceAll: (list: StandardItem[], options: UserOptions, { id }: TransformParams) => Promise<string>;
export { replaceItem, replaceAll };

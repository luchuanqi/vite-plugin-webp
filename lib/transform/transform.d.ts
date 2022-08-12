declare const transform: (options: UserOptions, { code, id }: TransformParams) => Promise<{
    code: string;
    map: any;
}>;
export default transform;

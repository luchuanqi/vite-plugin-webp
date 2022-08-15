export default function main(options?: UserOptions): {
    name: string;
    enforce: string;
    configResolved(resolvedConfig: any): void;
    transform(code: string, id: string): Promise<ViteTpl>;
};

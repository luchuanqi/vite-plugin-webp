export default class Standard {
    private data;
    private result;
    constructor(props: {
        data: FilterItem[];
    });
    getData(): StandardItem[];
    transformData(data: FilterItem[]): void;
    treeLoop(data: StandardItem, target: string, style: CssAttributes): void;
    toTreeData(source: FilterItem): StandardItem;
}

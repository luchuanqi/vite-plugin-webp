interface FilterOption {
    data: StandardItem;
    rules: string[];
    options: UserOptions;
}
/**
 * 筛选数据
 */
export default class Filter {
    private result;
    private rules;
    private options;
    constructor(opt: FilterOption);
    getData(): FilterItem[];
    loopDate(json: StandardItem, pre?: string): void;
}
export {};

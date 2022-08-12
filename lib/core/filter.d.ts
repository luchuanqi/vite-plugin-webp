interface FilterOption {
    data: StandardItem;
    rules: string[];
}
/**
 * 筛选数据
 */
export default class Filter {
    private result;
    private rules;
    constructor(options: FilterOption);
    getData(): FilterItem[];
    loopDate(json: StandardItem, pre?: string): void;
}
export {};

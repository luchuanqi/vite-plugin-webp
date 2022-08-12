import config from '../config/index';

export default class Standard {
  private data: FilterItem[];
  private result: StandardItem[];
  constructor(props: { data: FilterItem[] }) {
    this.data = props.data || [];
    this.result = [];
    this.transformData(this.data);
  }
  // Standard
  getData(): StandardItem[] {
    return this.result;
  }
  transformData(data: FilterItem[]): void {
    this.result = data.map(item => {
      return this.toTreeData(item);
    })
  }
  treeLoop(data: StandardItem, target: string, style: CssAttributes): void {
    if (Object.keys(data).length) {
      for (let i in data) {
        if (data[i]) {
          this.treeLoop(data[i], target, style)
        } else {
          data[target] = {};
        }
      }
    } else if (target === 'attributes') {
      data.children = {};
      data.attributes = style;
    } else {
      data[target] = {};
    }
  }
  toTreeData(source: FilterItem): StandardItem {
    const tree: StandardItem = {};
    const arr: string[] = source.pre.split(config.joiner);
    arr.forEach((v, i) => {
      if (i === 0) {
        tree[v] = {};
      } else {
        this.treeLoop(tree, v, source.style);
      }
    })
    return tree;
  }
}

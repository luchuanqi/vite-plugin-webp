import config from '../config';
import helper from '../helper';
import { cssUrlReg } from '../config/regexp';

interface FilterOption {
  data: StandardItem,
  rules: string[],
  options: UserOptions
}
/**
 * 筛选数据
 */
export default class Filter {
  private result: FilterItem[];
  private rules: string[];
  private options: UserOptions;
  constructor(opt: FilterOption) {
    this.result = [];
    this.rules = opt.rules || ['width'];
    this.options = opt.options;
    this.loopDate(opt.data)
  }
  getData() {
    return this.result;
  }
  loopDate(json: StandardItem, pre: string = ''): void {
    for (let i in json) {
      if (typeof json[i] === 'object') {
        const key = pre ? `${pre}${config.joiner}${i}` : i;
        this.loopDate(json[i], key);
      } else {
        cssUrlReg.lastIndex = 0;
        if (
          this.rules.includes(i) &&
          cssUrlReg.test(json[i]) &&
          helper.isTargetImage(RegExp.$1, this.options.imageType)
        ) {
          this.result.push({
            pre,
            style: {
              [i]: json[i]
            }
          })
        }
      }
    }
  }
}

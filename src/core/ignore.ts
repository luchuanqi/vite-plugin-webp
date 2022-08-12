import helper from '../helper';
export default class Ignore {
  static suffixFile(id: string, options: UserOptions): boolean {
    const { formate } = options;
    const { css, template } = formate;
    const reg = new RegExp(`.+(${css.concat(template).join('|')})$`);
    return reg.test(id);
  }
  static includeDir(id: string, options: UserOptions): boolean {
    const include = helper.toArray(options.include);
    let res = false;
    for (let i = 0; i < include.length; i++) {
      const dir: string = include[i];
      if (id.startsWith(dir)) {
        res = true;
        break
      }
    }
    return res;
  }
  static decludeDir(id: string, options: UserOptions): boolean {
    const declude = helper.toArray(options.declude);
    let res = true;
    for (let i = 0; i < declude.length; i++) {
      const dir: string = declude[i];
      if (id.startsWith(dir)) {
        res = false;
        break
      }
    }
    return res;
  }
}
export const ignoreFiles = (id: string, options: UserOptions): boolean => {
  return Ignore.suffixFile(id, options) && Ignore.includeDir(id, options) && Ignore.decludeDir(id, options);
}

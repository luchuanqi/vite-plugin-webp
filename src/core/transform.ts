import { styleReg } from '../config/regexp';
import Filter from './filter';
import Standard  from './standard';
import { replaceAll } from './replace';
import { toJSON } from 'cssjson';

const styleTransform = async function (options: UserOptions, { code, id }: TransformParams): Promise<string> {
  const { rules } = options;
  let cssStr = '';
  while (styleReg.test(code)) {
    const attr: string = RegExp.$1;
    const match = new Filter({
      data: toJSON(RegExp.$2),
      rules,
      options
    });
    const schema = new Standard({ data: match.getData() });
    const data: StandardItem[] = schema.getData();
    const res = await replaceAll(data, options, { id });
    cssStr += res ? `<style ${attr}>\n${res}</style>\n` : '';
  }
  return cssStr;
}
const cssTransform = async function (options: UserOptions, { code, id }: TransformParams): Promise<string> {
  const { rules } = options;
  const match = new Filter({
    data: toJSON(code),
    rules,
    options
  });
  const schema = new Standard({ data: match.getData() });
  const data: StandardItem[] = schema.getData();
  return await replaceAll(data, options, { id });
}
const transform = async function (options: UserOptions, params: TransformParams): Promise<ViteTpl> {
  const { formate: { css, template } } = options;
  let { code, id } = params;
  const arr = id.split('?');
  let cssStr = '';
  const cssReg = new RegExp(`.+(${css.join('|')})$`);
  const templateReg = new RegExp(`.+(${template.join('|')})$`);
  if (cssReg.test(id)) {
    cssStr = await cssTransform(options, { code, id });
  } else if (templateReg.test(id)) {
    cssStr = await styleTransform(options, { code, id });
  }

  return {
    code: cssStr ? (code + cssStr) : code,
    map: null
  }
}
export default transform;

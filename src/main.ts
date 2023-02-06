import transform from './core/transform.js';
import { name } from '../package.json';
import { ignoreFiles } from './core/ignore';
import { webp } from './webp';

const DEFAULT_FORMATE: FormateOptions = {
  css: ['.css', '.less', '.scss', '.sass'],
  template: ['.vue', '.html']
}

const DEFAULT_OPTIONS: UserOptions = {
  container: '.g-webp',
  rules: ['background', 'background-image'],
  imageType: ['.png', '.jpg'],
  formate: DEFAULT_FORMATE,
  onlyWebp: '',
  include: '',
  sharpOptions: {},
  declude: 'node_modules'
};
export default function main(options: UserOptions = {}) {
  const customOpts: UserOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    formate: {
      ...DEFAULT_OPTIONS.formate,
      ...options.formate,
    }
  };

  webp(customOpts);

  return {
    name,

    enforce: 'pre',
    // apply: 'build',
    configResolved(resolvedConfig) {
      customOpts.alias = resolvedConfig?.resolve?.alias || [];
    },
    transform(code: string, id: string): Promise<ViteTpl> {
      if (ignoreFiles(id, customOpts) === false) {
        return
      }
      return transform(customOpts, {
        code,
        id
      })
    },
  };
}

interface AliasItem {
  find: string,
  replacement: string
}

interface FormateOptions {
  css?: string[],
  template?: string[]
}

interface UserOptions {
  container?: string,
  rules?: string[],
  imageType?: string[],
  formate?: FormateOptions,
  include?: string | string[],
  declude?: string | string[],
  onlyWebp?: string | string[],
  alias?: AliasItem[]
  // https://sharp.pixelplumbing.com/api-output#webp
  sharpOptions?: any
}

interface TransformParams {
  code?: string,
  id: string
}

interface ViteTpl {
  map: null,
  code: string
}


interface CssAttributes {
  [attribute: string]: any
}
interface Children {
  [attribute: string]: {
    children: Children,
    attributes: CssAttributes
  }
}
interface StandardItem {
  children?: Children,
  attributes?: CssAttributes
}

interface FilterItem {
  pre: string,
  style: CssAttributes
}

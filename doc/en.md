# vite-plugin-webp

> 1. vite-plugin-webp will create webp pictures
> 2. vite-plugin-webp can transform JPEG, PNG, GIF and AVIF images of varying dimensions to `webp`

## Usage

```bash
npm install vite-plugin-webp
```

```javascript
import webp from 'vite-plugin-webp';

export default defineConfig({
  plugins: [
    webp({
      include: path.join(__dirname, 'src/pages/index'),
      declude: path.join(__dirname, 'src/pages/index/ignore.vue'),
      imageType: ['.png', '.jpg']
    })
  ]
});
```
### CSS Example

1.`vite.config.js`  
```javascript
import webp from 'vite-plugin-webp';

export default defineConfig({
  plugins: [
    webp({
      include: path.join(__dirname, 'src/pages/index'),
      declude: path.join(__dirname, 'src/pages/index/ignore.vue'),
      imageType: ['.png', '.jpg']
    })
  ]
});
```
2.`index.css` (entry)
```css
.standard {
  background: url(./assets/standard.png);
}
```
3.`index.css` (output)
```output
.standard {
  background: url(./assets/standard.png);
}
.g-webp .standard {
  background: url(./assets/standard.webp);
}
```

## Javascript Example
1.`vite.config.js`
```javascript
import webp from 'vite-plugin-webp';

export default defineConfig({
  plugins: [
    webp({
      onlyWebp: path.join(__dirname, 'src/pages/index/assets'),
      imageType: ['.png', '.jpg']
    })
  ]
});
```
2.`main.js`
```javascript

const isSupportWebp = function () {
  try {
    return document.createElement('canvas').toDataURL('image/webp', 0.5).indexOf('data:image/webp') === 0;
  } catch(err) {
    return false;
  }
}

const loadCom = function(i) {
  const path = ['./assets/expand.png', './assets/expand.webp'];
  return new URL(path[i], import.meta.url).href;
}

this.url = isSupportWebp() ? loadCom(1) : loadCom(0)
```
3.template.html
```html
<img :src="url" alt="">
```

## Options

| params | type | default | desc |
| :---: | :---: | :---: | :---: |
| include | string &#124; array |  | include directory or file |
| declude | string &#124; array | node_modules | declude directory or file | 
| onlyWebp | string &#124; array |  | only create webp image | 
| imageType | array | ['.png', '.jpg'] | transform image formate |
| container | string | .g-webp | global class |
| formate | <a href="#formate">Formate</a> |  |  |

### <div id="formate">Formate</div>

| params | type | default | desc |
| :---: | :---: | :---: | :---: |
| css | array | ['.css', '.less', '.scss', '.sass'] | css file |
| template | array | ['.vue', '.html'] | includes style tag |

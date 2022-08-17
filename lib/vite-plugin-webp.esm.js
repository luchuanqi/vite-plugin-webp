/*!
 * vite-plugin-webp v1.1.1
 * (c) Wed Aug 17 2022 14:41:05 GMT+0800 (China Standard Time) luchuanqi
 * Released under the MIT License.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { toCSS, toJSON } from 'cssjson';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const styleReg = /<style([^<>]*)>([^<>]+)<\/style>/gm;
const cssUrlReg = /url\((.+)\).*/gm;
/**
 * images resize
 * @param type
 * @return  {
 *   RegExp.$1: width
 *   RegExp.$2: height
 * }
 */
const resizeReg = /\D+(\d+)[xX*](\d+)\.webp$/;

const config = {
    // 连接符: 禁止使用 # . @
    joiner: '!'
};

function toArray(data) {
    if (typeof data === 'string') {
        return data ? [data] : [];
    }
    return data;
}
function isDirectory(path) {
    return fs.statSync(path).isDirectory();
}
function evalCatch(data) {
    try {
        return eval(data);
    }
    catch (_) {
        return data;
    }
}
function getAbsoluteDir(id, p, alias) {
    const findArr = p.split('/');
    const { replacement } = alias.find(v => v.find === findArr[0]) || {};
    let res = '';
    if (replacement) {
        // 绝对目录
        res = `${replacement}/${findArr.slice(1).join('/')}`;
    }
    else {
        // 相对目录静态目录文件
        res = path.join(id, '../', p);
    }
    return res;
}
function isTargetImage(id, imageType) {
    const arr = evalCatch(id).split('.');
    const suffix = arr[arr.length - 1];
    return imageType.includes(`.${suffix}`);
}
function getWebpPath(id) {
    const arr = id.split('.');
    const suffix = arr[arr.length - 1];
    const reg = new RegExp(`${suffix}$`);
    return id.replace(reg, 'webp');
}
var helper = {
    toArray,
    isDirectory,
    evalCatch,
    isTargetImage,
    getWebpPath,
    getAbsoluteDir
};

/**
 * 筛选数据
 */
class Filter {
    constructor(opt) {
        this.result = [];
        this.rules = opt.rules || ['width'];
        this.options = opt.options;
        this.loopDate(opt.data);
    }
    getData() {
        return this.result;
    }
    loopDate(json, pre = '') {
        for (let i in json) {
            if (typeof json[i] === 'object') {
                const key = pre ? `${pre}${config.joiner}${i}` : i;
                this.loopDate(json[i], key);
            }
            else {
                cssUrlReg.lastIndex = 0;
                if (this.rules.includes(i) &&
                    cssUrlReg.test(json[i]) &&
                    helper.isTargetImage(RegExp.$1, this.options.imageType)) {
                    this.result.push({
                        pre,
                        style: {
                            [i]: json[i]
                        }
                    });
                }
            }
        }
    }
}

class Standard {
    constructor(props) {
        this.data = props.data || [];
        this.result = [];
        this.transformData(this.data);
    }
    // Standard
    getData() {
        return this.result;
    }
    transformData(data) {
        this.result = data.map(item => {
            return this.toTreeData(item);
        });
    }
    treeLoop(data, target, style) {
        if (Object.keys(data).length) {
            for (let i in data) {
                if (data[i]) {
                    this.treeLoop(data[i], target, style);
                }
                else {
                    data[target] = {};
                }
            }
        }
        else if (target === 'attributes') {
            data.children = {};
            data.attributes = style;
        }
        else {
            data[target] = {};
        }
    }
    toTreeData(source) {
        const tree = {};
        const arr = source.pre.split(config.joiner);
        arr.forEach((v, i) => {
            if (i === 0) {
                tree[v] = {};
            }
            else {
                this.treeLoop(tree, v, source.style);
            }
        });
        return tree;
    }
}

const sharpWebp = (absPath, nPath) => {
    let width = null;
    let height = null;
    resizeReg.lastIndex = 0;
    if (resizeReg.test(nPath)) {
        width = Number(RegExp.$1);
        height = Number(RegExp.$2);
    }
    return new Promise((resolve, reject) => {
        try {
            sharp(absPath)
                .resize({ width, height })
                .webp()
                .toFile(nPath, (err, info) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(info);
                }
            });
        }
        catch (e) {
            reject(e);
        }
    });
};

const replaceItem = (str, options, { id }) => {
    return new Promise(resolve => {
        const { alias } = options;
        cssUrlReg.lastIndex = 0;
        if (cssUrlReg.test(str)) {
            const url = helper.evalCatch(RegExp.$1);
            const absPath = helper.getAbsoluteDir(id, url, alias);
            const nPath = helper.getWebpPath(absPath);
            const nUrl = helper.getWebpPath(url);
            if (fs.existsSync(nPath)) {
                resolve(str.replace(url, nUrl));
            }
            else {
                sharpWebp(absPath, nPath).then(() => {
                    resolve(str.replace(url, nUrl));
                }).catch(() => {
                    resolve('');
                });
            }
        }
    });
};
const replaceAll = (list, options, { id }) => __awaiter(void 0, void 0, void 0, function* () {
    const { container } = options;
    let cssStr = '';
    for (let i = 0; i < list.length;) {
        const css = toCSS(list[i]);
        if (css.startsWith(container) === false) {
            cssStr += yield replaceItem(`${container} ${css}`, options, { id });
        }
        i++;
    }
    return cssStr;
});

const styleTransform = function (options, { code, id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rules } = options;
        let cssStr = '';
        while (styleReg.test(code)) {
            const attr = RegExp.$1;
            const match = new Filter({
                data: toJSON(RegExp.$2),
                rules,
                options
            });
            const schema = new Standard({ data: match.getData() });
            const data = schema.getData();
            const res = yield replaceAll(data, options, { id });
            cssStr += res ? `<style ${attr}>\n${res}</style>\n` : '';
        }
        return cssStr;
    });
};
const cssTransform = function (options, { code, id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rules } = options;
        const match = new Filter({
            data: toJSON(code),
            rules,
            options
        });
        const schema = new Standard({ data: match.getData() });
        const data = schema.getData();
        return yield replaceAll(data, options, { id });
    });
};
const transform = function (options, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { formate: { css, template } } = options;
        let { code, id } = params;
        id.split('?');
        let cssStr = '';
        const cssReg = new RegExp(`.+(${css.join('|')})$`);
        const templateReg = new RegExp(`.+(${template.join('|')})$`);
        if (cssReg.test(id)) {
            cssStr = yield cssTransform(options, { code, id });
        }
        else if (templateReg.test(id)) {
            cssStr = yield styleTransform(options, { code, id });
        }
        return {
            code: cssStr ? (code + cssStr) : code,
            map: null
        };
    });
};

var name = "vite-plugin-webp";

class Ignore {
    static suffixFile(id, options) {
        const { formate } = options;
        const { css, template } = formate;
        const reg = new RegExp(`.+(${css.concat(template).join('|')})$`);
        return reg.test(id);
    }
    static includeDir(id, options) {
        const include = helper.toArray(options.include);
        let res = false;
        for (let i = 0; i < include.length; i++) {
            const dir = include[i];
            if (id.startsWith(dir)) {
                res = true;
                break;
            }
        }
        return res;
    }
    static decludeDir(id, options) {
        const declude = helper.toArray(options.declude);
        let res = true;
        for (let i = 0; i < declude.length; i++) {
            const dir = declude[i];
            if (id.startsWith(dir)) {
                res = false;
                break;
            }
        }
        return res;
    }
}
const ignoreFiles = (id, options) => {
    return Ignore.suffixFile(id, options) && Ignore.includeDir(id, options) && Ignore.decludeDir(id, options);
};

function createWebp(dir, options) {
    if (fs.existsSync(dir) === false) {
        return;
    }
    const { imageType } = options;
    const files = fs.readdirSync(dir);
    files.forEach((v) => {
        const abs = path.join(dir, v);
        if (helper.isDirectory(abs)) {
            createWebp(abs, options);
        }
        else if (helper.isTargetImage(abs, imageType)) {
            const nPath = helper.getWebpPath(abs);
            sharpWebp(abs, nPath);
        }
    });
}
const webp = (options) => {
    const { onlyWebp } = options;
    const arr = helper.toArray(onlyWebp);
    for (let i = 0; i < arr.length; i++) {
        const dir = arr[i];
        createWebp(dir, options);
    }
};

const DEFAULT_FORMATE = {
    css: ['.css', '.less', '.scss', '.sass'],
    template: ['.vue', '.html']
};
const DEFAULT_OPTIONS = {
    container: '.g-webp',
    rules: ['background', 'background-image'],
    imageType: ['.png', '.jpg'],
    formate: DEFAULT_FORMATE,
    onlyWebp: '',
    include: '',
    declude: 'node_modules'
};
function main(options = {}) {
    const customOpts = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), options), { formate: Object.assign(Object.assign({}, DEFAULT_OPTIONS.formate), options.formate) });
    webp(customOpts);
    return {
        name,
        enforce: 'pre',
        // apply: 'build',
        configResolved(resolvedConfig) {
            var _a;
            customOpts.alias = ((_a = resolvedConfig === null || resolvedConfig === void 0 ? void 0 : resolvedConfig.resolve) === null || _a === void 0 ? void 0 : _a.alias) || [];
        },
        transform(code, id) {
            if (ignoreFiles(id, customOpts) === false) {
                return;
            }
            return transform(customOpts, {
                code,
                id
            });
        },
    };
}

export { main as default };

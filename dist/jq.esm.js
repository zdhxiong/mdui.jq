/*!
 * mdui.jq 2.0.0 (https://github.com/zdhxiong/mdui.jq#readme)
 * Copyright 2018-2019 zdhxiong
 * Licensed under MIT
 */
function isNodeName(element, name) {
    return element.nodeName.toLowerCase() === name.toLowerCase();
}
function isArrayLike(target) {
    return typeof target.length === 'number';
}
function isObjectLike(target) {
    return typeof target === 'object' && target !== null;
}
function isFunction(target) {
    return typeof target === 'function';
}
function isString(target) {
    return typeof target === 'string';
}
function isUndefined(target) {
    return typeof target === 'undefined';
}
function isNull(target) {
    return target === null;
}
function isWindow(target) {
    return target instanceof Window;
}
function isDocument(target) {
    return target instanceof HTMLDocument;
}
function isElement(target) {
    return target instanceof HTMLElement;
}

function each(target, callback) {
    if (isArrayLike(target)) {
        for (let i = 0; i < target.length; i += 1) {
            if (callback.call(target[i], i, target[i]) === false) {
                return target;
            }
        }
    }
    else {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i += 1) {
            if (callback.call(target[keys[i]], keys[i], target[keys[i]]) === false) {
                return target;
            }
        }
    }
    return target;
}

function map(elements, callback) {
    let value;
    const ret = [];
    each(elements, (i, element) => {
        value = callback.call(window, element, i);
        if (!isNull(value) && !isUndefined(value)) {
            ret.push(value);
        }
    });
    return [].concat(...ret);
}

/**
 * 为了使用模块扩充，这里不能使用默认导出
 */
class JQ {
    constructor(arr) {
        this.length = 0;
        if (!arr) {
            return this;
        }
        // 仅保留 HTMLElement、HTMLDocument 和 Window 元素
        const elements = map(arr, element => {
            if (isWindow(element) || isDocument(element) || isElement(element)) {
                return element;
            }
            return null;
        });
        each(elements, (i, element) => {
            // @ts-ignore
            this[i] = element;
        });
        this.length = elements.length;
        return this;
    }
}

function get$() {
    const $ = function (selector) {
        if (!selector) {
            return new JQ();
        }
        // JQ
        if (selector instanceof JQ) {
            return selector;
        }
        // function
        if (isFunction(selector)) {
            if (/complete|loaded|interactive/.test(document.readyState) &&
                document.body) {
                selector.call(document, $);
            }
            else {
                document.addEventListener('DOMContentLoaded', () => {
                    selector.call(document, $);
                }, false);
            }
            return new JQ([document]);
        }
        // Node
        if (selector instanceof Node || isWindow(selector)) {
            return new JQ([selector]);
        }
        // NodeList
        if (selector instanceof NodeList) {
            return new JQ(selector);
        }
        // String
        if (isString(selector)) {
            const html = selector.trim();
            // 根据 HTML 字符串创建 JQ 对象
            if (html[0] === '<' && html[html.length - 1] === '>') {
                let toCreate = 'div';
                const tags = {
                    li: 'ul',
                    tr: 'tbody',
                    td: 'tr',
                    th: 'tr',
                    tbody: 'table',
                    option: 'select',
                };
                each(tags, (childTag, parentTag) => {
                    if (html.indexOf(`<${childTag}`) === 0) {
                        toCreate = parentTag;
                        return false;
                    }
                    return;
                });
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                return new JQ(tempParent.childNodes);
            }
            // 根据 CSS 选择器创建 JQ 对象
            const elements = selector[0] === '#' && !selector.match(/[ .<>:~]/)
                ? [document.getElementById(selector.slice(1))]
                : document.querySelectorAll(selector);
            if (elements) {
                return new JQ(elements);
            }
        }
        return new JQ();
    };
    $.fn = JQ.prototype;
    return $;
}
const $ = get$();

function extend(target, object1, ...objectN) {
    objectN.unshift(object1);
    each(objectN, (_, object) => {
        each(object, (prop, value) => {
            if (!isUndefined(value)) {
                target[prop] = value;
            }
        });
    });
    return target;
}

/**
 * 将数组或对象序列化，序列化后的字符串可作为 URL 查询字符串使用
 * @param obj 数组或对象
 * @example
```js
param( { width:1680, height:1050 } );
// width=1680&height=1050
```
```js
param( { foo: { one: 1,two: 2 } } )
// foo[one]=1&foo[two]=2
```
```js
param( { ids: [1, 2, 3] } )
// ids[]=1&ids[]=2&ids[]=3
```
 */
function param(obj) {
    if (!isObjectLike(obj)) {
        return '';
    }
    const args = [];
    function destructure(key, value) {
        let keyTmp;
        if (isObjectLike(value)) {
            each(value, (i, v) => {
                if (Array.isArray(value) && !isObjectLike(v)) {
                    keyTmp = '';
                }
                else {
                    keyTmp = i;
                }
                destructure(`${key}[${keyTmp}]`, v);
            });
        }
        else {
            if (value !== null && value !== '') {
                keyTmp = `=${encodeURIComponent(value)}`;
            }
            else {
                keyTmp = '';
            }
            args.push(encodeURIComponent(key) + keyTmp);
        }
    }
    each(obj, destructure);
    return args.join('&');
}

// 全局配置参数
const globalOptions = {};
// 全局事件名
const ajaxEvents = {
    ajaxStart: 'start.mdui.ajax',
    ajaxSuccess: 'success.mdui.ajax',
    ajaxError: 'error.mdui.ajax',
    ajaxComplete: 'complete.mdui.ajax',
};

$.fn.each = function (callback) {
    return each(this, callback);
};

$.fn.trigger = function (eventName, extraParameters = {}) {
    let event;
    const eventParams = {
        bubbles: true,
        cancelable: true,
    };
    const isMouseEvent = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(eventName) > -1;
    if (isMouseEvent) {
        // Note: MouseEvent 无法传入 detail 参数
        event = new MouseEvent(eventName, eventParams);
    }
    else {
        eventParams.detail = extraParameters;
        event = new CustomEvent(eventName, eventParams);
    }
    // @ts-ignore
    event._detail = extraParameters;
    return this.each(function () {
        this.dispatchEvent(event);
    });
};

$.fn.remove = function () {
    return this.each((_, element) => {
        if (isElement(element) && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
};

$.fn.get = function (index) {
    return index === undefined
        ? [].slice.call(this)
        : this[index >= 0 ? index : index + this.length];
};

each(['append', 'prepend'], (nameIndex, name) => {
    $.fn[name] = function (newChild) {
        let newChilds;
        const copyByClone = this.length > 1;
        if (isString(newChild) &&
            (newChild[0] !== '<' || newChild[newChild.length - 1] !== '>')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;
            newChilds = [].slice.call(tempDiv.childNodes);
        }
        else {
            newChilds = $(newChild).get();
        }
        if (nameIndex === 1) {
            // prepend
            newChilds.reverse();
        }
        return this.each((i, element) => {
            if (!isElement(element)) {
                return;
            }
            each(newChilds, (_, child) => {
                // 一个元素要同时追加到多个元素中，需要先复制一份，然后追加
                if (copyByClone && i > 0) {
                    child = child.cloneNode(true);
                }
                if (nameIndex === 0) {
                    // append
                    element.appendChild(child);
                }
                else {
                    // prepend
                    element.insertBefore(child, element.childNodes[0]);
                }
            });
        });
    };
});

let jsonpID = 0;
/**
 * 判断此请求方法是否通过查询字符串提交参数
 * @param method 请求方法，大写
 */
function isQueryStringData(method) {
    return ['GET', 'HEAD'].indexOf(method) >= 0;
}
/**
 * 添加参数到 URL 上，且 URL 中不存在 ? 时，自动把第一个 & 替换为 ?
 * @param url
 * @param query
 */
function appendQuery(url, query) {
    return `${url}&${query}`.replace(/[&?]{1,2}/, '?');
}
/**
 * 获取 jsonp 请求的回调函数名称
 */
function defaultJsonpCallback() {
    jsonpID += 1;
    return `mduijsonp_${Date.now()}_${jsonpID}`;
}
/**
 * 合并请求参数，参数优先级：options > globalOptions > defaults
 * @param options
 */
function mergeOptions(options) {
    // 默认参数
    const defaults = {
        url: '',
        method: 'GET',
        data: '',
        processData: true,
        async: true,
        cache: true,
        username: '',
        password: '',
        headers: {},
        xhrFields: {},
        statusCode: {},
        dataType: 'text',
        jsonp: 'callback',
        jsonpCallback: defaultJsonpCallback,
        contentType: 'application/x-www-form-urlencoded',
        timeout: 0,
        global: true,
    };
    // globalOptions 中的回调函数不合并
    each(globalOptions, (key, value) => {
        const callbacks = [
            'beforeSend',
            'success',
            'error',
            'complete',
            'statusCode',
        ];
        // @ts-ignore
        if (callbacks.indexOf(key) < 0 && !isUndefined(value)) {
            defaults[key] = value;
        }
    });
    return extend({}, defaults, options);
}
/**
 * 发送 ajax 请求
 * @param options
 * @example
```js
ajax({
  method: "POST",
  url: "some.php",
  data: { name: "John", location: "Boston" }
}).then(function( msg ) {
  alert( "Data Saved: " + msg );
});
```
 */
function ajax(options) {
    // 是否已取消请求
    let isCanceled = false;
    // 事件参数
    const eventParams = {};
    // 参数合并
    const mergedOptions = mergeOptions(options);
    let url = mergedOptions.url || window.location.toString();
    const method = mergedOptions.method.toUpperCase();
    let data = mergedOptions.data;
    const processData = mergedOptions.processData;
    const async = mergedOptions.async;
    const cache = mergedOptions.cache;
    const username = mergedOptions.username;
    const password = mergedOptions.password;
    const headers = mergedOptions.headers;
    const xhrFields = mergedOptions.xhrFields;
    const statusCode = mergedOptions.statusCode;
    const dataType = mergedOptions.dataType;
    const jsonp = mergedOptions.jsonp;
    const jsonpCallback = mergedOptions.jsonpCallback;
    const contentType = mergedOptions.contentType;
    const timeout = mergedOptions.timeout;
    const global = mergedOptions.global;
    // 需要发送的数据
    // GET/HEAD 请求和 processData 为 true 时，转换为查询字符串格式，特殊格式不转换
    if (data &&
        (isQueryStringData(method) || processData) &&
        !isString(data) &&
        !(data instanceof ArrayBuffer) &&
        !(data instanceof Blob) &&
        !(data instanceof Document) &&
        !(data instanceof FormData)) {
        data = param(data);
    }
    // 对于 GET、HEAD 类型的请求，把 data 数据添加到 URL 中
    if (isQueryStringData(method) && data) {
        // 查询字符串拼接到 URL 中
        url = appendQuery(url, data);
        data = null;
    }
    /**
     * 触发全局事件
     * @param event 事件名
     * @param params 事件参数
     */
    function triggerEvent(event, params) {
        if (global) {
            $(document).trigger(event, params);
        }
    }
    /**
     * 触发 XHR 回调和事件
     * @param callback 回调函数名称
     * @param args
     */
    function triggerCallback(callback, ...args) {
        let result1;
        let result2;
        if (callback) {
            // 全局回调
            if (callback in globalOptions) {
                // @ts-ignore
                result1 = globalOptions[callback](...args);
            }
            // 自定义回调
            if (mergedOptions[callback]) {
                // @ts-ignore
                result2 = mergedOptions[callback](...args);
            }
            // beforeSend 回调返回 false 时取消 ajax 请求
            if (callback === 'beforeSend' &&
                (result1 === false || result2 === false)) {
                isCanceled = true;
            }
        }
    }
    // JSONP 请求
    function JSONP() {
        let textStatus;
        return new Promise((resolve, reject) => {
            // URL 中添加自动生成的回调函数名
            const callbackName = isFunction(jsonpCallback)
                ? jsonpCallback()
                : jsonpCallback;
            const requestUrl = appendQuery(url, `${jsonp}=${callbackName}`);
            eventParams.options = mergedOptions;
            triggerEvent(ajaxEvents.ajaxStart, eventParams);
            triggerCallback('beforeSend', null);
            if (isCanceled) {
                reject(new Error('cancel'));
                return;
            }
            let abortTimeout;
            // 创建 script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            // 创建 script 失败
            script.onerror = function () {
                if (abortTimeout) {
                    clearTimeout(abortTimeout);
                }
                textStatus = 'error';
                triggerEvent(ajaxEvents.ajaxError, eventParams);
                triggerCallback('error', null, textStatus);
                triggerEvent(ajaxEvents.ajaxComplete, eventParams);
                triggerCallback('complete', null, textStatus);
                reject(new Error(textStatus));
            };
            script.src = requestUrl;
            // 处理
            // @ts-ignore
            window[callbackName] = function (data) {
                if (abortTimeout) {
                    clearTimeout(abortTimeout);
                }
                textStatus = 'success';
                eventParams.data = data;
                triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
                triggerCallback('success', data, textStatus, null);
                $(script).remove();
                script = null;
                delete window[callbackName];
                resolve(data);
            };
            $('head').append(script);
            if (timeout > 0) {
                abortTimeout = setTimeout(() => {
                    $(script).remove();
                    script = null;
                    textStatus = 'timeout';
                    triggerEvent(ajaxEvents.ajaxError, eventParams);
                    triggerCallback('error', null, textStatus);
                    reject(new Error(textStatus));
                }, timeout);
            }
            return;
        });
    }
    // XMLHttpRequest 请求
    function XHR() {
        let textStatus;
        return new Promise((resolve, reject) => {
            // GET/HEAD 请求的缓存处理
            if (isQueryStringData(method) && !cache) {
                url = appendQuery(url, `_=${Date.now()}`);
            }
            // 创建 XHR
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, async, username, password);
            if (contentType ||
                (data && !isQueryStringData(method) && contentType !== false)) {
                xhr.setRequestHeader('Content-Type', contentType);
            }
            // 设置 Accept
            if (dataType === 'json') {
                xhr.setRequestHeader('Accept', 'application/json, text/javascript');
            }
            // 添加 headers
            if (headers) {
                each(headers, (key, value) => {
                    // undefined 值不发送，string 和 null 需要发送
                    if (!isUndefined(value)) {
                        xhr.setRequestHeader(key, value + ''); // 把 null 转换成字符串
                    }
                });
            }
            // 检查是否是跨域请求，跨域请求时不添加 X-Requested-With
            const crossDomain = /^([\w-]+:)?\/\/([^/]+)/.test(url) &&
                RegExp.$2 !== window.location.host;
            if (!crossDomain) {
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
            if (xhrFields) {
                each(xhrFields, (key, value) => {
                    // @ts-ignore
                    xhr[key] = value;
                });
            }
            eventParams.xhr = xhr;
            eventParams.options = mergedOptions;
            let xhrTimeout;
            xhr.onload = function () {
                if (xhrTimeout) {
                    clearTimeout(xhrTimeout);
                }
                // AJAX 返回的 HTTP 响应码是否表示成功
                const isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) ||
                    xhr.status === 304 ||
                    xhr.status === 0;
                let responseData;
                if (isHttpStatusSuccess) {
                    if (xhr.status === 204 || method === 'HEAD') {
                        textStatus = 'nocontent';
                    }
                    else if (xhr.status === 304) {
                        textStatus = 'notmodified';
                    }
                    else {
                        textStatus = 'success';
                    }
                    if (dataType === 'json') {
                        try {
                            responseData = JSON.parse(xhr.responseText);
                            eventParams.data = responseData;
                        }
                        catch (err) {
                            textStatus = 'parsererror';
                            triggerEvent(ajaxEvents.ajaxError, eventParams);
                            triggerCallback('error', xhr, textStatus);
                            reject(new Error(textStatus));
                        }
                        if (textStatus !== 'parsererror') {
                            triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
                            triggerCallback('success', responseData, textStatus, xhr);
                            resolve(responseData);
                        }
                    }
                    else {
                        responseData =
                            xhr.responseType === 'text' || xhr.responseType === ''
                                ? xhr.responseText
                                : xhr.response;
                        eventParams.data = responseData;
                        triggerEvent(ajaxEvents.ajaxSuccess, eventParams);
                        triggerCallback('success', responseData, textStatus, xhr);
                        resolve(responseData);
                    }
                }
                else {
                    textStatus = 'error';
                    triggerEvent(ajaxEvents.ajaxError, eventParams);
                    triggerCallback('error', xhr, textStatus);
                    reject(new Error(textStatus));
                }
                // statusCode
                each([globalOptions.statusCode, statusCode], (_, func) => {
                    if (func && func[xhr.status]) {
                        if (isHttpStatusSuccess) {
                            func[xhr.status](responseData, textStatus, xhr);
                        }
                        else {
                            func[xhr.status](xhr, textStatus);
                        }
                    }
                });
                triggerEvent(ajaxEvents.ajaxComplete, eventParams);
                triggerCallback('complete', xhr, textStatus);
            };
            xhr.onerror = function () {
                if (xhrTimeout) {
                    clearTimeout(xhrTimeout);
                }
                triggerEvent(ajaxEvents.ajaxError, eventParams);
                triggerCallback('error', xhr, xhr.statusText);
                triggerEvent(ajaxEvents.ajaxComplete, eventParams);
                triggerCallback('complete', xhr, 'error');
                reject(new Error(xhr.statusText));
            };
            xhr.onabort = function () {
                let statusText = 'abort';
                if (xhrTimeout) {
                    statusText = 'timeout';
                    clearTimeout(xhrTimeout);
                }
                triggerEvent(ajaxEvents.ajaxError, eventParams);
                triggerCallback('error', xhr, statusText);
                triggerEvent(ajaxEvents.ajaxComplete, eventParams);
                triggerCallback('complete', xhr, statusText);
                reject(new Error(statusText));
            };
            // ajax start 回调
            triggerEvent(ajaxEvents.ajaxStart, eventParams);
            triggerCallback('beforeSend', xhr);
            if (isCanceled) {
                reject(new Error('cancel'));
                return;
            }
            // Timeout
            if (timeout > 0) {
                xhrTimeout = setTimeout(() => {
                    xhr.abort();
                }, timeout);
            }
            // 发送 XHR
            xhr.send(data);
        });
    }
    return dataType === 'jsonp' ? JSONP() : XHR();
}

$.ajax = ajax;

/**
 * 为 Ajax 请求设置全局配置参数
 * @param options 键值对参数
 * @example
```js
ajaxSetup({
  dataType: 'json',
  method: 'POST',
});
```
 */
function ajaxSetup(options) {
    return extend(globalOptions, options);
}

$.ajaxSetup = ajaxSetup;

/**
 * 检查 parent 元素内是否包含 child 元素
 * @param parent 父元素
 * @param child 子元素
 * @example
```js
contains( document.documentElement, document.body ); // true
contains( document.body, document.documentElement ); // false
```
 */
function contains(parent, child) {
    if (isUndefined(child)) {
        return document.documentElement.contains(parent);
    }
    return parent !== child && parent.contains(child);
}

$.contains = contains;

const dataNS = 'mduiElementDataStorage';

/**
 * 在元素上设置键值对数据
 * @param element
 * @param obj
 */
function setObjToElement(element, obj) {
    // @ts-ignore
    if (!element[dataNS]) {
        // @ts-ignore
        element[dataNS] = {};
    }
    each(obj, (key, value) => {
        // @ts-ignore
        element[dataNS][key] = value;
    });
}
function data(element, key, value) {
    // 根据键值对设置值
    // data(element, { 'key' : 'value' })
    if (isObjectLike(key)) {
        setObjToElement(element, key);
        return key;
    }
    // 根据 key、value 设置值
    // data(element, 'key', 'value')
    if (!isUndefined(value)) {
        setObjToElement(element, { key: value });
        return value;
    }
    // 获取所有值
    // data(element)
    if (isUndefined(key)) {
        const result = {};
        // 获取元素上的 data- 属性
        if (isElement(element)) {
            each(element.attributes, (_, attribute) => {
                const { name } = attribute;
                if (name.indexOf('data-') === 0) {
                    const prop = name
                        .slice(5)
                        .replace(/-./g, u => u.charAt(1).toUpperCase());
                    result[prop] = attribute.value;
                }
            });
        }
        // @ts-ignore
        if (element[dataNS]) {
            // @ts-ignore
            each(element[dataNS], (key, value) => {
                result[key] = value;
            });
        }
        return result;
    }
    // 从 dataNS 中获取指定值
    // data(element, 'key')
    // @ts-ignore
    if (element[dataNS] && key in element[dataNS]) {
        // @ts-ignore
        return element[dataNS][key];
    }
    // 从 data- 属性中获取指定值
    // data(element, 'key')
    if (isElement(element)) {
        const dataKey = element.getAttribute(`data-${key}`);
        if (dataKey) {
            return dataKey;
        }
    }
    return undefined;
}

$.data = data;

$.each = each;

$.extend = function (...objectN) {
    if (objectN.length === 1) {
        each(objectN[0], (prop, value) => {
            this[prop] = value;
        });
        return this;
    }
    return extend(objectN.shift(), objectN.shift(), ...objectN);
};

$.map = map;

/**
 * 把第二个数组的元素追加到第一个数组中，并返回合并后的数组
 * @param first 第一个数组
 * @param second 该数组的元素将被追加到第一个数组中
 * @example
```js
merge( [ 0, 1, 2 ], [ 2, 3, 4 ] )
// [ 0, 1, 2, 2, 3, 4 ]
```
 */
function merge(first, second) {
    each(second, (_, value) => {
        first.push(value);
    });
    return first;
}

$.merge = merge;

$.param = param;

/**
 * 移除指定元素上存放的数据
 * @param element 存放数据的元素
 * @param name 数据键名，若为指定键名，将移除元素上所有数据
 * @example ````移除指定键名的数据
```js
removeData(document.body, 'name');
```
 * @example ````移除所有数据
```js
removeData(document.body);
```
 */
function removeData(element, name) {
    // @ts-ignore
    if (!element[dataNS]) {
        return;
    }
    if (isUndefined(name)) {
        // @ts-ignore
        element[dataNS] = null;
        // @ts-ignore
        delete element[dataNS];
        // @ts-ignore
    }
    else if (element[dataNS][name]) {
        // @ts-ignore
        element[dataNS][name] = null;
        // @ts-ignore
        delete element[dataNS][name];
    }
}

$.removeData = removeData;

/**
 * 过滤掉数组中的重复元素
 * @param arr 数组
 * @example
```js
unique([1,2,12,3,2,1,2,1,1]);
// [1, 2, 12, 3]
```
 */
function unique(arr) {
    const result = [];
    each(arr, (i, val) => {
        if (result.indexOf(val) === -1) {
            result.push(val);
        }
    });
    return result;
}

$.unique = unique;

$.fn.add = function (selector) {
    return new JQ(unique(merge(this.get(), $(selector).get())));
};

each(['add', 'remove', 'toggle'], (_, name) => {
    $.fn[`${name}Class`] = function (className) {
        if (!className) {
            return this;
        }
        const classes = className.split(' ');
        return this.each((_, element) => {
            if (!isElement(element)) {
                return;
            }
            each(classes, (_, cls) => {
                element.classList[name](cls);
            });
        });
    };
});

each(['insertBefore', 'insertAfter'], (nameIndex, name) => {
    $.fn[name] = function (selector) {
        const $target = $(selector);
        return this.each((_, element) => {
            if (!isElement(element)) {
                return;
            }
            $target.each((_, target) => {
                if (!isElement(target) || !target.parentNode) {
                    return;
                }
                target.parentNode.insertBefore($target.length === 1 ? element : element.cloneNode(true), nameIndex === 0 ? target : target.nextSibling);
            });
        });
    };
});

$.fn.after = function (selector) {
    $(selector).insertAfter(this);
    return this;
};

$.fn.find = function (selector) {
    const foundElements = [];
    this.each((_, element) => {
        if (!isWindow(element)) {
            merge(foundElements, $(element.querySelectorAll(selector)).get());
        }
    });
    return new JQ(foundElements);
};

// 存储事件
const handlers = {};
// 元素ID
let mduiElementId = 1;
/**
 * 为元素赋予一个唯一的ID
 */
function getElementId(element) {
    const key = 'mduiElementId';
    if (!data(element, key)) {
        mduiElementId += 1;
        data(element, key, mduiElementId);
    }
    return data(element, key);
}
/**
 * 获取匹配的事件
 * @param element
 * @param eventName
 * @param func
 * @param selector
 */
function getHandlers(element, eventName, func, selector) {
    return (handlers[getElementId(element)] || []).filter(handler => handler &&
        (!eventName || handler.e === eventName) &&
        (!func || handler.fn.toString() === func.toString()) &&
        (!selector || handler.sel === selector));
}
/**
 * 添加事件监听
 * @param element
 * @param eventName
 * @param func
 * @param data
 * @param selector
 */
function add(element, eventName, func, data, selector) {
    const elementId = getElementId(element);
    if (!handlers[elementId]) {
        handlers[elementId] = [];
    }
    // 传入 data.useCapture 来设置 useCapture: true
    let useCapture = false;
    if (isObjectLike(data) && data.useCapture) {
        useCapture = true;
    }
    eventName.split(' ').forEach(event => {
        function callFn(e, elem) {
            // 因为鼠标事件模拟事件的 detail 属性是只读的，因此在 e._detail 中存储参数
            const result = func.apply(elem, 
            // @ts-ignore
            e._detail === undefined ? [e] : [e].concat(e._detail));
            if (result === false) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        function proxyFn(e) {
            // @ts-ignore
            e._data = data;
            if (selector) {
                // 事件代理
                $(element)
                    .find(selector)
                    .get()
                    .reverse()
                    .forEach(elem => {
                    if (elem === e.target || contains(elem, e.target)) {
                        callFn(e, elem);
                    }
                });
            }
            else {
                // 不使用事件代理
                callFn(e, element);
            }
        }
        const handler = {
            e: event,
            fn: func,
            sel: selector,
            i: handlers[elementId].length,
            proxy: proxyFn,
        };
        handlers[elementId].push(handler);
        element.addEventListener(handler.e, proxyFn, useCapture);
    });
}
/**
 * 移除事件监听
 * @param element
 * @param eventName
 * @param func
 * @param selector
 */
function remove(element, eventName, func, selector) {
    (eventName || '').split(' ').forEach(event => {
        getHandlers(element, event, func, selector).forEach(handler => {
            delete handlers[getElementId(element)][handler.i];
            element.removeEventListener(handler.e, handler.proxy, false);
        });
    });
}

$.fn.off = function (eventName, selector, callback) {
    // eventName 是对象
    if (isObjectLike(eventName)) {
        each(eventName, (type, fn) => {
            // this.off('click', undefined, function () {})
            // this.off('click', '.box', function () {})
            this.off(type, selector, fn);
        });
        return this;
    }
    // selector 不存在
    if (isFunction(selector)) {
        callback = selector;
        selector = undefined;
        // this.off('click', undefined, function () {})
    }
    return this.each(function () {
        remove(this, eventName, callback, selector);
    });
};

$.fn.on = function (eventName, selector, data, callback, one) {
    // eventName 是对象
    if (isObjectLike(eventName)) {
        each(eventName, (type, fn) => {
            // selector 和 data 都可能是 undefined
            // @ts-ignore
            this.on(type, selector, data, fn, one);
        });
        return this;
    }
    // selector 不存在
    if (selector && !isString(selector)) {
        callback = data;
        data = selector;
        selector = undefined;
    }
    // data 不存在
    if (isFunction(data)) {
        callback = data;
        data = undefined;
    }
    // $().one()
    if (one) {
        const origCallback = callback;
        callback = () => {
            this.off(eventName, selector, callback);
            // eslint-disable-next-line prefer-rest-params
            return origCallback.apply(callback, arguments);
        };
    }
    return this.each(function () {
        add(this, eventName, callback, data, selector);
    });
};

each(ajaxEvents, (name, eventName) => {
    $.fn[name] = function (fn) {
        return this.on(eventName, (e, params) => {
            fn(e, params.xhr, params.options, params.data);
        });
    };
});

$.fn.appendTo = function (selector) {
    $(selector).append(this);
    return this;
};

each(['attr', 'prop', 'css'], (nameIndex, name) => {
    function set(element, key, value) {
        if (nameIndex === 0) {
            element.setAttribute(key, value);
        }
        else if (nameIndex === 1) {
            // @ts-ignore
            element[key] = value;
        }
        else {
            // @ts-ignore
            element.style[key] = value;
        }
    }
    function get(element, key) {
        if (nameIndex === 0) {
            return element.getAttribute(key);
        }
        if (nameIndex === 1) {
            // @ts-ignore
            return element[key];
        }
        return window.getComputedStyle(element, null).getPropertyValue(key);
    }
    $.fn[name] = function (key, value) {
        if (isObjectLike(key)) {
            each(key, (k, v) => {
                // @ts-ignore
                this[name](k, v);
            });
            return this;
        }
        if (isUndefined(value)) {
            const element = this[0];
            return isElement(element) ? get(element, key) : undefined;
        }
        return this.each((i, element) => {
            if (!isElement(element)) {
                return;
            }
            if (isFunction(value)) {
                value = value.call(element, i, get(element, key));
            }
            set(element, key, value);
        });
    };
});

$.fn.before = function (selector) {
    $(selector).insertBefore(this);
    return this;
};

$.fn.is = function (selector) {
    const self = this[0];
    if (!self || isUndefined(selector) || isNull(selector)) {
        return false;
    }
    // CSS 选择器
    if (isString(selector) && isElement(self)) {
        const matchesSelector = self.matches ||
            // @ts-ignore
            self.matchesSelector ||
            self.webkitMatchesSelector ||
            // @ts-ignore
            self.mozMatchesSelector ||
            // @ts-ignore
            self.oMatchesSelector ||
            // @ts-ignore
            self.msMatchesSelector;
        return matchesSelector.call(self, selector);
    }
    if (isDocument(selector) || isWindow(selector)) {
        return self === selector;
    }
    if (selector instanceof Node || isArrayLike(selector)) {
        const $compareWith = selector instanceof Node ? [selector] : selector;
        for (let i = 0; i < $compareWith.length; i += 1) {
            if ($compareWith[i] === self) {
                return true;
            }
        }
    }
    return false;
};

$.fn.children = function (selector) {
    const children = [];
    this.each((_, element) => {
        if (isWindow(element)) {
            return;
        }
        each(element.childNodes, (__, childNode) => {
            if (!isElement(childNode)) {
                return;
            }
            if (!selector || $(childNode).is(selector)) {
                children.push(childNode);
            }
        });
    });
    return new JQ(unique(children));
};

$.fn.map = function (callback) {
    return new JQ(map(this, (element, i) => callback.call(element, i, element)));
};

$.fn.clone = function () {
    return this.map(function () {
        return !isWindow(this) ? this.cloneNode(true) : null;
    });
};

function dir($elements, selector, nameIndex, node) {
    const ret = [];
    let target;
    $elements.each((_, element) => {
        if (!isElement(element)) {
            return;
        }
        target = element[node];
        while (target) {
            if (nameIndex === 2) {
                // prevUntil, nextUntil, parentsUntil
                if (!selector || $(target).is(selector)) {
                    break;
                }
                ret.push(target);
            }
            else if (nameIndex === 0) {
                // prev, next, parent
                if (!selector || $(target).is(selector)) {
                    ret.push(target);
                }
                break;
            }
            else {
                // prevAll, nextAll, parents
                if (!selector || $(target).is(selector)) {
                    ret.push(target);
                }
            }
            // @ts-ignore
            target = target[node];
        }
    });
    return new JQ(unique(ret));
}

each(['', 's', 'sUntil'], (nameIndex, name) => {
    $.fn[`parent${name}`] = function (selector) {
        // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
        const $nodes = nameIndex === 0 ? this : $(this.get().reverse());
        return dir($nodes, selector, nameIndex, 'parentNode');
    };
});

$.fn.slice = function (...args) {
    return new JQ([].slice.apply(this, args));
};

$.fn.eq = function (index) {
    const ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);
    return new JQ(ret);
};

$.fn.closest = function (selector) {
    if (this.is(selector)) {
        return new JQ();
    }
    return this.parents(selector).eq(0);
};

$.fn.data = function (key, value) {
    // 同时设置多个值
    if (isObjectLike(key)) {
        return this.each((_, element) => {
            data(element, key);
        });
    }
    // 设置值
    if (!isUndefined(value)) {
        return this.each((_, element) => {
            data(element, key, value);
        });
    }
    if (!this[0]) {
        return undefined;
    }
    // 获取值
    if (!isUndefined(key)) {
        return data(this[0], key);
    }
    // 获取所有值
    return data(this[0]);
};

$.fn.empty = function () {
    return this.each(function () {
        if (isElement(this)) {
            this.innerHTML = '';
        }
    });
};

$.fn.extend = function (obj) {
    each(obj, (prop, value) => {
        // 在 JQ 对象上扩展方法时，需要自己添加 typescript 的类型定义
        // @ts-ignore
        this[prop] = value;
    });
    return this;
};

$.fn.index = function (selector) {
    if (!selector) {
        // 获取当前对象的第一个元素在同辈元素中的位置
        return this.eq(0)
            .parent()
            .children()
            .get()
            .indexOf(this[0]);
    }
    if (isString(selector)) {
        // 返回当前对象的第一个元素在指定选择器对应的元素中的位置
        return ($(selector)
            .eq(0)
            .parent()
            .children()
            .get()
            // @ts-ignore
            .indexOf(this[0]));
    }
    // 返回指定元素在当前 JQ 对象中的位置
    return this.get().indexOf($(selector).get(0));
};

$.fn.filter = function (selector) {
    if (isFunction(selector)) {
        return this.map((index, element) => selector.call(element, index, element) ? element : undefined);
    }
    const $selector = $(selector);
    return this.map((_, element) => $selector.index(element) > -1 ? element : undefined);
};

$.fn.first = function () {
    return this.eq(0);
};

$.fn.has = function (selector) {
    const $targets = isString(selector) ? this.find(selector) : $(selector);
    const { length } = $targets;
    return this.filter(function () {
        if (isWindow(this)) {
            return false;
        }
        for (let i = 0; i < length; i += 1) {
            if (contains(this, $targets[i])) {
                return true;
            }
        }
        return false;
    });
};

$.fn.hasClass = function (className) {
    if (!this[0] || !className) {
        return false;
    }
    return this[0].classList.contains(className);
};

each({
    Width: 'width',
    Height: 'height',
}, (prop, name) => {
    $.fn[name] = function (value) {
        // 获取值
        if (isUndefined(value)) {
            const element = this[0];
            if (isWindow(element)) {
                // @ts-ignore
                return element[`inner${prop}`];
            }
            if (isDocument(element)) {
                // @ts-ignore
                return element.documentElement[`scroll${prop}`];
            }
            const $element = $(element);
            // IE10、IE11 在 box-sizing:border-box 时，不会包含 padding 和 border，这里进行修复
            let IEFixValue = 0;
            const isWidth = name === 'width';
            // 判断是 IE 浏览器
            if ('ActiveXObject' in window) {
                if ($element.css('box-sizing') === 'border-box') {
                    const directionLeft = isWidth ? 'left' : 'top';
                    const directionRight = isWidth ? 'right' : 'bottom';
                    const propertyNames = [
                        `padding-${directionLeft}`,
                        `padding-${directionRight}`,
                        `border-${directionLeft}-width`,
                        `border-${directionRight}-width`,
                    ];
                    each(propertyNames, (_, property) => {
                        IEFixValue += parseFloat($element.css(property) || '0');
                    });
                }
            }
            return parseFloat($(element).css(name) || '0') + IEFixValue;
        }
        // 设置值
        if (!isNaN(Number(value)) && value !== '') {
            value += 'px';
        }
        return this.css(name, value);
    };
});

$.fn.hide = function () {
    return this.each(function () {
        if (isElement(this)) {
            this.style.display = 'none';
        }
    });
};

each(['val', 'html', 'text'], (nameIndex, name) => {
    const props = {
        0: 'value',
        1: 'innerHTML',
        2: 'textContent',
    };
    const defaults = {
        0: undefined,
        1: undefined,
        2: null,
    };
    $.fn[name] = function (value) {
        // 获取值
        if (isUndefined(value)) {
            // @ts-ignore
            return this[0] ? this[0][props[nameIndex]] : defaults[nameIndex];
        }
        // 设置值
        return this.each((_, element) => {
            // @ts-ignore
            element[props[nameIndex]] = value;
        });
    };
});

each({
    Width: 'width',
    Height: 'height',
}, (prop, name) => {
    $.fn[`inner${prop}`] = function () {
        let value = this[name]();
        const $element = $(this[0]);
        if ($element.css('box-sizing') !== 'border-box') {
            const isWidth = name === 'width';
            const directionLeft = isWidth ? 'left' : 'top';
            const directionRight = isWidth ? 'right' : 'bottom';
            const propertyNames = [
                `padding-${directionLeft}`,
                `padding-${directionRight}`,
            ];
            each(propertyNames, (_, property) => {
                value += parseFloat($element.css(property) || '0');
            });
        }
        return value;
    };
});

$.fn.last = function () {
    return this.eq(-1);
};

each(['', 'All', 'Until'], (nameIndex, name) => {
    $.fn[`next${name}`] = function (selector) {
        return dir(this, selector, nameIndex, 'nextElementSibling');
    };
});

$.fn.not = function (selector) {
    const $excludes = this.filter(selector);
    return this.map((index, element) => $excludes.index(element) > -1 ? undefined : element);
};

$.fn.offset = function () {
    const element = this[0];
    if (element && isElement(element)) {
        const offset = element.getBoundingClientRect();
        return {
            left: offset.left + window.pageXOffset,
            top: offset.top + window.pageYOffset,
            width: offset.width,
            height: offset.height,
        };
    }
    return undefined;
};

/**
 * 返回最近的用于定位的父元素
 * @returns {*|JQ}
 */
$.fn.offsetParent = function () {
    return this.map(function () {
        if (!isElement(this)) {
            return new JQ();
        }
        let parent = this.offsetParent;
        while (parent &&
            isElement(parent) &&
            $(parent).css('position') === 'static') {
            parent = parent.offsetParent;
        }
        return parent || document.documentElement;
    });
};

$.fn.one = function (eventName, selector, data, callback) {
    // @ts-ignore
    return this.on(eventName, selector, data, callback, true);
};

$.fn.position = function () {
    const element = this[0];
    if (!element || !isElement(element)) {
        return undefined;
    }
    let $offsetParent;
    let parentOffset = {
        left: 0,
        top: 0,
    };
    const offset = this.offset();
    if (!offset) {
        return undefined;
    }
    if (this.css('position') !== 'fixed') {
        $offsetParent = this.offsetParent();
        if (!isNodeName($offsetParent[0], 'html')) {
            parentOffset = $offsetParent.offset();
        }
        parentOffset.top =
            parentOffset.top + parseFloat($offsetParent.css('borderTopWidth') || '');
        parentOffset.left =
            parentOffset.left +
                parseFloat($offsetParent.css('borderLeftWidth') || '');
    }
    return {
        top: offset.top - parentOffset.top - parseFloat(this.css('marginTop') || ''),
        left: offset.left -
            parentOffset.left -
            parseFloat(this.css('marginLeft') || ''),
        width: offset.width,
        height: offset.height,
    };
};

$.fn.prependTo = function (selector) {
    $(selector).prepend(this);
    return this;
};

each(['', 'All', 'Until'], (nameIndex, name) => {
    $.fn[`prev${name}`] = function (selector) {
        // prevAll、prevUntil 需要把元素的顺序倒序处理，以便和 jQuery 的结果一致
        const $nodes = nameIndex === 0 ? this : $(this.get().reverse());
        return dir($nodes, selector, nameIndex, 'previousElementSibling');
    };
});

$.fn.removeAttr = function (attributeName) {
    return this.each(function () {
        if (isElement(this)) {
            this.removeAttribute(attributeName);
        }
    });
};

$.fn.removeData = function (name) {
    return this.each((_, element) => {
        removeData(element, name);
    });
};

$.fn.removeProp = function (name) {
    return this.each(function () {
        try {
            // @ts-ignore
            delete this[name];
        }
        catch (e) { }
    });
};

$.fn.replaceWith = function (newContent) {
    return this.before(newContent).remove();
};

$.fn.replaceAll = function (selector) {
    $(selector).replaceWith(this);
    return this;
};

/**
 * 将表单元素的值组合成键值对数组
 * @returns {Array}
 */
$.fn.serializeArray = function () {
    const result = [];
    const formElement = this[0];
    if (!formElement || !(formElement instanceof HTMLFormElement)) {
        return result;
    }
    $([].slice.call(formElement.elements)).each(function () {
        const $item = $(this);
        const type = $item.attr('type');
        if (!isNodeName(this, 'fieldset') &&
            // @ts-ignore
            !this.disabled &&
            // @ts-ignore
            ['submit', 'reset', 'button'].indexOf(type) === -1 &&
            // @ts-ignore
            (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)) {
            const name = $item.attr('name');
            if (name) {
                result.push({
                    name,
                    value: $item.val(),
                });
            }
        }
    });
    return result;
};

/**
 * 将表单元素或对象序列化
 * @returns {String}
 */
$.fn.serialize = function () {
    const result = [];
    each(this.serializeArray(), (_, item) => {
        result.push(`${encodeURIComponent(item.name)}=${encodeURIComponent(item.value)}`);
    });
    return result.join('&');
};

const elementDisplay = {};
/**
 * 获取元素的默认 display 样式值，用于 .show() 方法
 * @param nodeName
 */
function defaultDisplay(nodeName) {
    let element;
    let display;
    if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, '').getPropertyValue('display');
        element.parentNode.removeChild(element);
        if (display === 'none') {
            display = 'block';
        }
        elementDisplay[nodeName] = display;
    }
    return elementDisplay[nodeName];
}
/**
 * 显示指定元素
 * @returns {JQ}
 */
$.fn.show = function () {
    return this.each(function () {
        if (!isElement(this)) {
            return;
        }
        if (this.style.display === 'none') {
            this.style.display = '';
        }
        if (window.getComputedStyle(this, '').getPropertyValue('display') === 'none') {
            this.style.display = defaultDisplay(this.nodeName);
        }
    });
};

/**
 * 取得同辈元素的集合
 * @param selector {String=}
 * @returns {JQ}
 */
$.fn.siblings = function (selector) {
    return this.prevAll(selector).add(this.nextAll(selector));
};

/**
 * 切换元素的显示状态
 * @returns {JQ}
 */
$.fn.toggle = function () {
    return this.each(function () {
        if (!isElement(this)) {
            return;
        }
        this.style.display = this.style.display === 'none' ? '' : 'none';
    });
};

export default $;

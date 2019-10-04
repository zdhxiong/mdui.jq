import JQElement from '../types/JQElement';
import PlainObject from '../interfaces/PlainObject';
import dataNS from './utils/data';
import { isObjectLike, isUndefined } from '../utils';
import each from './each';

/**
 * 在元素上设置键值对数据
 * @param element
 * @param obj
 */
function setObjToElement(element: JQElement, obj: PlainObject): void {
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

/**
 * value 为 undefined 时，相当于 data(element, key)
 * @param element 用于存储数据的元素
 * @param key 数据键名
 * @param value undefined
 * @example
```js
data(document.body, 'type', undefined)
// 'image'
```
 */
function data(element: JQElement, key: string, value: undefined): any;

/**
 * 在指定元素上存储数据，返回设置的值
 * @param element 用于存储数据的元素
 * @param key 数据键名
 * @param value 数据值
 * @example
```js
data(document.body, 'type', 'image')
// 'image'
```
 */
function data<T>(element: JQElement, key: string, value: T): T;

/**
 * 获取在指定元素上存储的指定键名对应的值
 * @param element 用于存储数据的元素
 * @param key 数据键名
 * @example
```js
data(document.body, 'height')
// 680
```
 */
function data(element: JQElement, key: string): any;

/**
 * 获取指定元素上存储的所有数据
 * @param element 用于存储数据的元素
 * @example
```js
data(document.body)
// { 'type': 'image', 'width': 1020, 'height': 680 }
```
 */
function data(element: JQElement): PlainObject;

/**
 * 在指定元素上存储数据，返回设置的键值对数据
 * @param element 用于存储数据的元素
 * @param data 键值对数据
 * @example
```js
data(document.body, { 'width': 1020, 'height': 680 })
// { 'width': 1020, 'height': 680 }
```
 */
function data<T extends PlainObject>(element: JQElement, data: T): T;

function data(
  element: JQElement,
  key?: string | PlainObject,
  value?: any,
): any {
  // 根据键值对设置值
  // data(element, { 'key' : 'value' })
  if (isObjectLike(key)) {
    setObjToElement(element, key);

    return key;
  }

  // 根据 key、value 设置值
  // data(element, 'key', 'value')
  if (!isUndefined(value)) {
    setObjToElement(element, { [key as string]: value });

    return value;
  }

  // 获取所有值
  // data(element)
  if (isUndefined(key)) {
    // @ts-ignore
    return element[dataNS] ? element[dataNS] : {};
  }

  // 从 dataNS 中获取指定值
  // data(element, 'key')
  // @ts-ignore
  if (element[dataNS] && key in element[dataNS]) {
    // @ts-ignore
    return element[dataNS][key];
  }

  return undefined;
}

export default data;

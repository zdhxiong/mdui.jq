import JQElement from '../types/JQElement';
import { isElement } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './each';
import each from '../functions/each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 移除指定属性，多个属性可以用空格分隔
     * @param attributeName
     * @example
```js
$('div').removeAttr('title')
```
     */
    removeAttr(attributeName: string): this;
  }
}

$.fn.removeAttr = function(this: JQ, attributeName: string): JQ {
  const names = attributeName.split(' ').filter(name => name);

  return this.each(function() {
    if (!isElement(this)) {
      return;
    }

    each(names, (_, name) => {
      (this as HTMLElement).removeAttribute(name);
    });
  });
};

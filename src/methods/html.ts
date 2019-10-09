import HTMLString from '../types/HTMLString';
import JQElement from '../types/JQElement';
import './val';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置当前元素的 HTML 内容
     * @param html
     * @example
```js
$('#box').html('html content')
```
     */
    html(
      html:
        | HTMLString
        | HTMLElement
        | undefined
        | ((
            this: HTMLElement,
            index: number,
            oldHtml: HTMLString,
          ) => HTMLString | HTMLElement | void | undefined),
    ): this;

    /**
     * 获取当前元素的 HTML 内容
     * @example
```js
$('#box').html()
```
     */
    html(): string | undefined;
  }
}

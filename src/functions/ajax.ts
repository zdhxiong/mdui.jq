import $ from '../$.js';
import {
  isString,
  isUndefined,
  eachObject,
  eachArray,
} from '../shared/core.js';
import {
  MethodUpperCase,
  CallbackName,
  ErrorCallback,
  ErrorTextStatus,
  EventName,
  StatusCodeCallbacks,
  SuccessCallback,
  SuccessTextStatus,
  TextStatus,
  Options,
  EventParams,
  globalOptions,
  ajaxStart,
  ajaxSuccess,
  ajaxError,
  ajaxComplete,
  isQueryStringData,
  isCrossDomain,
  isHttpStatusSuccess,
  appendQuery,
  mergeOptions,
} from '../shared/ajax.js';
import param from './param.js';
import '../methods/trigger.js';

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
const ajax = (options: Options): Promise<any> => {
  // 是否已取消请求
  let isCanceled = false;

  // 事件参数
  const eventParams: EventParams = {};

  // 参数合并
  const mergedOptions = mergeOptions(options);
  const method = mergedOptions.method.toUpperCase() as MethodUpperCase;
  let { data, url } = mergedOptions;
  url = url || window.location.toString();
  const {
    processData,
    async,
    cache,
    username,
    password,
    headers,
    xhrFields,
    statusCode,
    dataType,
    contentType,
    timeout,
    global,
  } = mergedOptions;

  // 需要发送的数据
  // GET/HEAD 请求和 processData 为 true 时，转换为查询字符串格式，特殊格式不转换
  const isMethodQueryString = isQueryStringData(method);
  if (
    data &&
    (isMethodQueryString || processData) &&
    !isString(data) &&
    !(data instanceof ArrayBuffer) &&
    !(data instanceof Blob) &&
    !(data instanceof Document) &&
    !(data instanceof FormData)
  ) {
    data = param(data);
  }

  // 对于 GET、HEAD 类型的请求，把 data 数据添加到 URL 中
  if (data && isMethodQueryString) {
    // 查询字符串拼接到 URL 中
    url = appendQuery(url, data);
    data = null;
  }

  /**
   * 触发事件和回调函数
   * @param event
   * @param callback
   * @param args
   */
  const trigger = (
    event: EventName,
    callback: CallbackName,
    ...args: any[]
  ): void => {
    // 触发全局事件
    if (global) {
      $(document).trigger(event, eventParams);
    }

    // 触发 ajax 回调和事件
    let resultGlobal;
    let resultCustom;

    // 全局回调
    if (callback in globalOptions) {
      // @ts-ignore
      resultGlobal = globalOptions[callback](...args);
    }

    // 自定义回调
    if (mergedOptions[callback]) {
      // @ts-ignore
      resultCustom = mergedOptions[callback](...args);
    }

    // beforeSend 回调返回 false 时取消 ajax 请求
    if (
      callback === 'beforeSend' &&
      [resultGlobal, resultCustom].includes(false)
    ) {
      isCanceled = true;
    }
  };

  // XMLHttpRequest 请求
  const XHR = (): Promise<any> => {
    let textStatus: TextStatus;

    return new Promise((resolve, reject): void => {
      const doReject = (reason: string) => {
        return reject(new Error(reason));
      };

      // GET/HEAD 请求的缓存处理
      if (isMethodQueryString && !cache) {
        url = appendQuery(url, `_=${Date.now()}`);
      }

      // 创建 XHR
      const xhr = new XMLHttpRequest();

      xhr.open(method, url, async, username, password);

      if (
        contentType ||
        (data && !isMethodQueryString && contentType !== false)
      ) {
        xhr.setRequestHeader('Content-Type', contentType);
      }

      // 设置 Accept
      if (dataType === 'json') {
        xhr.setRequestHeader('Accept', 'application/json, text/javascript');
      }

      // 添加 headers
      eachObject(headers, (key: string, value) => {
        // undefined 值不发送，string 和 null 需要发送
        if (!isUndefined(value)) {
          xhr.setRequestHeader(key, value + ''); // 把 null 转换成字符串
        }
      });

      // 检查是否是跨域请求，跨域请求时不添加 X-Requested-With
      if (!isCrossDomain(url)) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      // 设置 xhr 选项
      eachObject(xhrFields, (key, value) => {
        xhr[key] = value as never;
      });

      eventParams.xhr = xhr;
      eventParams.options = mergedOptions;

      let xhrTimeout: any;

      xhr.onload = (): void => {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        // AJAX 返回的 HTTP 响应码是否表示成功
        const isSuccess = isHttpStatusSuccess(xhr.status);

        let responseData: any;

        if (isSuccess) {
          textStatus =
            xhr.status === 204 || method === 'HEAD'
              ? 'nocontent'
              : xhr.status === 304
              ? 'notmodified'
              : 'success';

          if (dataType === 'json') {
            try {
              responseData =
                method === 'HEAD' ? undefined : JSON.parse(xhr.responseText);
              eventParams.data = responseData;
            } catch (err) {
              textStatus = 'parsererror';

              trigger(ajaxError, 'error', xhr, textStatus);
              doReject(textStatus);
            }

            if (textStatus !== 'parsererror') {
              trigger(ajaxSuccess, 'success', responseData, textStatus, xhr);
              resolve(responseData);
            }
          } else {
            responseData =
              method === 'HEAD'
                ? undefined
                : xhr.responseType === 'text' || xhr.responseType === ''
                ? xhr.responseText
                : xhr.response;
            eventParams.data = responseData;

            trigger(ajaxSuccess, 'success', responseData, textStatus, xhr);
            resolve(responseData);
          }
        } else {
          textStatus = 'error';

          trigger(ajaxError, 'error', xhr, textStatus);
          doReject(textStatus);
        }

        // statusCode
        eachArray(
          [globalOptions.statusCode!, statusCode],
          (_, func: StatusCodeCallbacks) => {
            if (func && func[xhr.status]) {
              if (isSuccess) {
                (func[xhr.status] as SuccessCallback)(
                  responseData,
                  textStatus as SuccessTextStatus,
                  xhr,
                );
              } else {
                (func[xhr.status] as ErrorCallback)(
                  xhr,
                  textStatus as ErrorTextStatus,
                );
              }
            }
          },
        );

        trigger(ajaxComplete, 'complete', xhr, textStatus);
      };

      xhr.onerror = (): void => {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        trigger(ajaxError, 'error', xhr, xhr.statusText);
        trigger(ajaxComplete, 'complete', xhr, 'error');
        doReject(xhr.statusText);
      };

      xhr.onabort = (): void => {
        let statusText: ErrorTextStatus = 'abort';

        if (xhrTimeout) {
          statusText = 'timeout';
          clearTimeout(xhrTimeout);
        }

        trigger(ajaxError, 'error', xhr, statusText);
        trigger(ajaxComplete, 'complete', xhr, statusText);
        doReject(statusText);
      };

      // ajax start 回调
      trigger(ajaxStart, 'beforeSend', xhr);

      if (isCanceled) {
        return doReject('cancel');
      }

      // Timeout
      if (timeout > 0) {
        xhrTimeout = setTimeout(() => xhr.abort(), timeout);
      }

      // 发送 XHR
      xhr.send(data);
    });
  };

  return XHR();
};

export default ajax;

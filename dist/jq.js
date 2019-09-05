/*!
 * mdui.jq 2.0.0 (https://github.com/zdhxiong/mdui.jq#readme)
 * Copyright 2018-2019 zdhxiong
 * Licensed under MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.JQ = factory());
}(this, function () { 'use strict';

  !function(){try{return new MouseEvent("test")}catch(e){}var e=function(e,t){t=t||{bubbles:!1,cancelable:!1};var n=document.createEvent("MouseEvent");return n.initMouseEvent(e,t.bubbles,t.cancelable,window,0,t.screenX||0,t.screenY||0,t.clientX||0,t.clientY||0,t.ctrlKey||!1,t.altKey||!1,t.shiftKey||!1,t.metaKey||!1,t.button||0,t.relatedTarget||null),n};e.prototype=Event.prototype,window.MouseEvent=e;}();

  !function(){function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n}"function"!=typeof window.CustomEvent&&(t.prototype=window.Event.prototype,window.CustomEvent=t);}();

  /**
   * @this {Promise}
   */
  function finallyConstructor(callback) {
    var constructor = this.constructor;
    return this.then(
      function(value) {
        // @ts-ignore
        return constructor.resolve(callback()).then(function() {
          return value;
        });
      },
      function(reason) {
        // @ts-ignore
        return constructor.resolve(callback()).then(function() {
          // @ts-ignore
          return constructor.reject(reason);
        });
      }
    );
  }

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function isArray(x) {
    return Boolean(x && typeof x.length !== 'undefined');
  }

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function() {
      fn.apply(thisArg, arguments);
    };
  }

  /**
   * @constructor
   * @param {Function} fn
   */
  function Promise$1(fn) {
    if (!(this instanceof Promise$1))
      { throw new TypeError('Promises must be constructed via new'); }
    if (typeof fn !== 'function') { throw new TypeError('not a function'); }
    /** @type {!number} */
    this._state = 0;
    /** @type {!boolean} */
    this._handled = false;
    /** @type {Promise|undefined} */
    this._value = undefined;
    /** @type {!Array<!Function>} */
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise$1._immediateFn(function() {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self)
        { throw new TypeError('A promise cannot be resolved with itself.'); }
      if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
      ) {
        var then = newValue.then;
        if (newValue instanceof Promise$1) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise$1._immediateFn(function() {
        if (!self._handled) {
          Promise$1._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  /**
   * @constructor
   */
  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(
        function(value) {
          if (done) { return; }
          done = true;
          resolve(self, value);
        },
        function(reason) {
          if (done) { return; }
          done = true;
          reject(self, reason);
        }
      );
    } catch (ex) {
      if (done) { return; }
      done = true;
      reject(self, ex);
    }
  }

  Promise$1.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
  };

  Promise$1.prototype.then = function(onFulfilled, onRejected) {
    // @ts-ignore
    var prom = new this.constructor(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise$1.prototype['finally'] = finallyConstructor;

  Promise$1.all = function(arr) {
    return new Promise$1(function(resolve, reject) {
      if (!isArray(arr)) {
        return reject(new TypeError('Promise.all accepts an array'));
      }

      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) { return resolve([]); }
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(
                val,
                function(val) {
                  res(i, val);
                },
                reject
              );
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise$1.resolve = function(value) {
    if (value && typeof value === 'object' && value.constructor === Promise$1) {
      return value;
    }

    return new Promise$1(function(resolve) {
      resolve(value);
    });
  };

  Promise$1.reject = function(value) {
    return new Promise$1(function(resolve, reject) {
      reject(value);
    });
  };

  Promise$1.race = function(arr) {
    return new Promise$1(function(resolve, reject) {
      if (!isArray(arr)) {
        return reject(new TypeError('Promise.race accepts an array'));
      }

      for (var i = 0, len = arr.length; i < len; i++) {
        Promise$1.resolve(arr[i]).then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise$1._immediateFn =
    // @ts-ignore
    (typeof setImmediate === 'function' &&
      function(fn) {
        // @ts-ignore
        setImmediate(fn);
      }) ||
    function(fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /** @suppress {undefinedVars} */
  var globalNS = (function() {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') {
      return self;
    }
    if (typeof window !== 'undefined') {
      return window;
    }
    if (typeof global !== 'undefined') {
      return global;
    }
    throw new Error('unable to locate global object');
  })();

  if (!('Promise' in globalNS)) {
    globalNS['Promise'] = Promise$1;
  } else if (!globalNS.Promise.prototype['finally']) {
    globalNS.Promise.prototype['finally'] = finallyConstructor;
  }

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
          for (var i = 0; i < target.length; i += 1) {
              if (callback.call(target[i], i, target[i]) === false) {
                  return target;
              }
          }
      }
      else {
          var keys = Object.keys(target);
          for (var i$1 = 0; i$1 < keys.length; i$1 += 1) {
              if (callback.call(target[keys[i$1]], keys[i$1], target[keys[i$1]]) === false) {
                  return target;
              }
          }
      }
      return target;
  }

  function map(elements, callback) {
      var ref;

      var value;
      var ret = [];
      each(elements, function (i, element) {
          value = callback.call(window, element, i);
          if (!isNull(value) && !isUndefined(value)) {
              ret.push(value);
          }
      });
      return (ref = []).concat.apply(ref, ret);
  }

  /**
   * 为了使用模块扩充，这里不能使用默认导出
   */
  var JQ = function JQ(arr) {
      var this$1 = this;

      this.length = 0;
      if (!arr) {
          return this;
      }
      // 仅保留 HTMLElement、HTMLDocument 和 Window 元素
      var elements = map(arr, function (element) {
          if (isWindow(element) || isDocument(element) || isElement(element)) {
              return element;
          }
          return null;
      });
      each(elements, function (i, element) {
          // @ts-ignore
          this$1[i] = element;
      });
      this.length = elements.length;
      return this;
  };

  function get$() {
      var $ = function (selector) {
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
                  document.addEventListener('DOMContentLoaded', function () {
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
              var html = selector.trim();
              // 根据 HTML 字符串创建 JQ 对象
              if (html[0] === '<' && html[html.length - 1] === '>') {
                  var toCreate = 'div';
                  var tags = {
                      li: 'ul',
                      tr: 'tbody',
                      td: 'tr',
                      th: 'tr',
                      tbody: 'table',
                      option: 'select',
                  };
                  each(tags, function (childTag, parentTag) {
                      if (html.indexOf(("<" + childTag)) === 0) {
                          toCreate = parentTag;
                          return false;
                      }
                      return;
                  });
                  var tempParent = document.createElement(toCreate);
                  tempParent.innerHTML = html;
                  return new JQ(tempParent.childNodes);
              }
              // 根据 CSS 选择器创建 JQ 对象
              var elements = selector[0] === '#' && !selector.match(/[ .<>:~]/)
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
  var $ = get$();

  function extend(target, object1) {
      var objectN = [], len = arguments.length - 2;
      while ( len-- > 0 ) objectN[ len ] = arguments[ len + 2 ];

      objectN.unshift(object1);
      each(objectN, function (_, object) {
          each(object, function (prop, value) {
              target[prop] = value;
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
      var args = [];
      function destructure(key, value) {
          var keyTmp;
          if (isObjectLike(value)) {
              each(value, function (i, v) {
                  if (Array.isArray(value) && !isObjectLike(v)) {
                      keyTmp = '';
                  }
                  else {
                      keyTmp = i;
                  }
                  destructure((key + "[" + keyTmp + "]"), v);
              });
          }
          else {
              if (value !== null && value !== '') {
                  keyTmp = "=" + (encodeURIComponent(value));
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
  var globalOptions = {};
  // 全局事件名
  var ajaxEvents = {
      ajaxStart: 'start.mdui.ajax',
      ajaxSuccess: 'success.mdui.ajax',
      ajaxError: 'error.mdui.ajax',
      ajaxComplete: 'complete.mdui.ajax',
  };

  $.fn.each = function (callback) {
      return each(this, callback);
  };

  $.fn.trigger = function (eventName, extraParameters) {
      if ( extraParameters === void 0 ) extraParameters = {};

      var event;
      var eventParams = {
          bubbles: true,
          cancelable: true,
      };
      var isMouseEvent = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(eventName) > -1;
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
      return this.each(function (_, element) {
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

  each(['append', 'prepend'], function (nameIndex, name) {
      $.fn[name] = function (newChild) {
          var newChilds;
          var copyByClone = this.length > 1;
          if (isString(newChild) &&
              (newChild[0] !== '<' || newChild[newChild.length - 1] !== '>')) {
              var tempDiv = document.createElement('div');
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
          return this.each(function (i, element) {
              if (!isElement(element)) {
                  return;
              }
              each(newChilds, function (_, child) {
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

  var jsonpID = 0;
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
      return (url + "&" + query).replace(/[&?]{1,2}/, '?');
  }
  /**
   * 获取 jsonp 请求的回调函数名称
   */
  function defaultJsonpCallback() {
      jsonpID += 1;
      return ("mduijsonp_" + (Date.now()) + "_" + jsonpID);
  }
  /**
   * 合并请求参数，参数优先级：options > globalOptions > defaults
   * @param options
   */
  function mergeOptions(options) {
      // 默认参数
      var defaults = {
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
      each(globalOptions, function (key, value) {
          var callbacks = [
              'beforeSend',
              'success',
              'error',
              'complete',
              'statusCode' ];
          // @ts-ignore
          if (callbacks.indexOf(key) < 0) {
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
      var isCanceled = false;
      // 事件参数
      var eventParams = {};
      // 参数合并
      var mergedOptions = mergeOptions(options);
      var url = mergedOptions.url || window.location.toString();
      var method = mergedOptions.method.toUpperCase();
      var data = mergedOptions.data;
      var processData = mergedOptions.processData;
      var async = mergedOptions.async;
      var cache = mergedOptions.cache;
      var username = mergedOptions.username;
      var password = mergedOptions.password;
      var headers = mergedOptions.headers;
      var xhrFields = mergedOptions.xhrFields;
      var statusCode = mergedOptions.statusCode;
      var dataType = mergedOptions.dataType;
      var jsonp = mergedOptions.jsonp;
      var jsonpCallback = mergedOptions.jsonpCallback;
      var contentType = mergedOptions.contentType;
      var timeout = mergedOptions.timeout;
      var global = mergedOptions.global;
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
      function triggerCallback(callback) {
          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

          var result1;
          var result2;
          if (callback) {
              // 全局回调
              if (callback in globalOptions) {
                  // @ts-ignore
                  result1 = globalOptions[callback].apply(globalOptions, args);
              }
              // 自定义回调
              if (mergedOptions[callback]) {
                  // @ts-ignore
                  result2 = mergedOptions[callback].apply(mergedOptions, args);
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
          var textStatus;
          return new Promise(function (resolve, reject) {
              // URL 中添加自动生成的回调函数名
              var callbackName = isFunction(jsonpCallback)
                  ? jsonpCallback()
                  : jsonpCallback;
              var requestUrl = appendQuery(url, (jsonp + "=" + callbackName));
              eventParams.options = mergedOptions;
              triggerEvent(ajaxEvents.ajaxStart, eventParams);
              triggerCallback('beforeSend', null);
              if (isCanceled) {
                  reject(new Error('cancel'));
                  return;
              }
              var abortTimeout;
              // 创建 script
              var script = document.createElement('script');
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
                  abortTimeout = setTimeout(function () {
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
          var textStatus;
          return new Promise(function (resolve, reject) {
              // GET/HEAD 请求的缓存处理
              if (isQueryStringData(method) && !cache) {
                  url = appendQuery(url, ("_=" + (Date.now())));
              }
              // 创建 XHR
              var xhr = new XMLHttpRequest();
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
                  each(headers, function (key, value) {
                      xhr.setRequestHeader(key, value);
                  });
              }
              // 检查是否是跨域请求，跨域请求时不添加 X-Requested-With
              var crossDomain = /^([\w-]+:)?\/\/([^/]+)/.test(url) &&
                  RegExp.$2 !== window.location.host;
              if (!crossDomain) {
                  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
              }
              if (xhrFields) {
                  each(xhrFields, function (key, value) {
                      // @ts-ignore
                      xhr[key] = value;
                  });
              }
              eventParams.xhr = xhr;
              eventParams.options = mergedOptions;
              var xhrTimeout;
              xhr.onload = function () {
                  if (xhrTimeout) {
                      clearTimeout(xhrTimeout);
                  }
                  // AJAX 返回的 HTTP 响应码是否表示成功
                  var isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) ||
                      xhr.status === 304 ||
                      xhr.status === 0;
                  var responseData;
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
                  each([globalOptions.statusCode, statusCode], function (_, func) {
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
                  var statusText = 'abort';
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
                  xhrTimeout = setTimeout(function () {
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

  var dataNS = 'mduiElementDataStorage';

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
      each(obj, function (key, value) {
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
          var result = {};
          // 获取元素上的 data- 属性
          if (isElement(element)) {
              each(element.attributes, function (_, attribute) {
                  var name = attribute.name;
                  if (name.indexOf('data-') === 0) {
                      var prop = name
                          .slice(5)
                          .replace(/-./g, function (u) { return u.charAt(1).toUpperCase(); });
                      result[prop] = attribute.value;
                  }
              });
          }
          // @ts-ignore
          if (element[dataNS]) {
              // @ts-ignore
              each(element[dataNS], function (key, value) {
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
          var dataKey = element.getAttribute(("data-" + key));
          if (dataKey) {
              return dataKey;
          }
      }
      return undefined;
  }

  $.data = data;

  $.each = each;

  $.extend = function () {
      var this$1 = this;
      var objectN = [], len = arguments.length;
      while ( len-- ) objectN[ len ] = arguments[ len ];

      if (objectN.length === 1) {
          each(objectN[0], function (prop, value) {
              this$1[prop] = value;
          });
          return this;
      }
      return extend.apply(void 0, [ objectN.shift(), objectN.shift() ].concat( objectN ));
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
      each(second, function (_, value) {
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
      var result = [];
      each(arr, function (i, val) {
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

  each(['add', 'remove', 'toggle'], function (_, name) {
      $.fn[(name + "Class")] = function (className) {
          if (!className) {
              return this;
          }
          var classes = className.split(' ');
          return this.each(function (_, element) {
              if (!isElement(element)) {
                  return;
              }
              each(classes, function (_, cls) {
                  element.classList[name](cls);
              });
          });
      };
  });

  each(['insertBefore', 'insertAfter'], function (nameIndex, name) {
      $.fn[name] = function (selector) {
          var $target = $(selector);
          return this.each(function (_, element) {
              if (!isElement(element)) {
                  return;
              }
              $target.each(function (_, target) {
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
      var foundElements = [];
      this.each(function (_, element) {
          if (!isWindow(element)) {
              merge(foundElements, $(element.querySelectorAll(selector)).get());
          }
      });
      return new JQ(foundElements);
  };

  // 存储事件
  var handlers = {};
  // 元素ID
  var mduiElementId = 1;
  /**
   * 为元素赋予一个唯一的ID
   */
  function getElementId(element) {
      var key = 'mduiElementId';
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
      return (handlers[getElementId(element)] || []).filter(function (handler) { return handler &&
          (!eventName || handler.e === eventName) &&
          (!func || handler.fn.toString() === func.toString()) &&
          (!selector || handler.sel === selector); });
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
      var elementId = getElementId(element);
      if (!handlers[elementId]) {
          handlers[elementId] = [];
      }
      // 传入 data.useCapture 来设置 useCapture: true
      var useCapture = false;
      if (isObjectLike(data) && data.useCapture) {
          useCapture = true;
      }
      eventName.split(' ').forEach(function (event) {
          function callFn(e, elem) {
              // 因为鼠标事件模拟事件的 detail 属性是只读的，因此在 e._detail 中存储参数
              var result = func.apply(elem, 
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
                      .forEach(function (elem) {
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
          var handler = {
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
      (eventName || '').split(' ').forEach(function (event) {
          getHandlers(element, event, func, selector).forEach(function (handler) {
              delete handlers[getElementId(element)][handler.i];
              element.removeEventListener(handler.e, handler.proxy, false);
          });
      });
  }

  $.fn.off = function (eventName, selector, callback) {
      var this$1 = this;

      // eventName 是对象
      if (isObjectLike(eventName)) {
          each(eventName, function (type, fn) {
              // this.off('click', undefined, function () {})
              // this.off('click', '.box', function () {})
              this$1.off(type, selector, fn);
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
      var arguments$1 = arguments;
      var this$1 = this;

      // eventName 是对象
      if (isObjectLike(eventName)) {
          each(eventName, function (type, fn) {
              // selector 和 data 都可能是 undefined
              // @ts-ignore
              this$1.on(type, selector, data, fn, one);
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
          var origCallback = callback;
          callback = function () {
              this$1.off(eventName, selector, callback);
              // eslint-disable-next-line prefer-rest-params
              return origCallback.apply(callback, arguments$1);
          };
      }
      return this.each(function () {
          add(this, eventName, callback, data, selector);
      });
  };

  each(ajaxEvents, function (name, eventName) {
      $.fn[name] = function (fn) {
          return this.on(eventName, function (e, params) {
              fn(e, params.xhr, params.options, params.data);
          });
      };
  });

  $.fn.appendTo = function (selector) {
      $(selector).append(this);
      return this;
  };

  each(['attr', 'prop', 'css'], function (nameIndex, name) {
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
          var this$1 = this;

          if (isObjectLike(key)) {
              each(key, function (k, v) {
                  // @ts-ignore
                  this$1[name](k, v);
              });
              return this;
          }
          if (isUndefined(value)) {
              var element = this[0];
              return isElement(element) ? get(element, key) : undefined;
          }
          return this.each(function (i, element) {
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
      var self = this[0];
      if (!self || isUndefined(selector) || isNull(selector)) {
          return false;
      }
      // CSS 选择器
      if (isString(selector) && isElement(self)) {
          var matchesSelector = self.matches ||
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
          var $compareWith = selector instanceof Node ? [selector] : selector;
          for (var i = 0; i < $compareWith.length; i += 1) {
              if ($compareWith[i] === self) {
                  return true;
              }
          }
      }
      return false;
  };

  $.fn.children = function (selector) {
      var children = [];
      this.each(function (_, element) {
          if (isWindow(element)) {
              return;
          }
          each(element.childNodes, function (__, childNode) {
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
      return new JQ(map(this, function (element, i) { return callback.call(element, i, element); }));
  };

  $.fn.clone = function () {
      return this.map(function () {
          return !isWindow(this) ? this.cloneNode(true) : null;
      });
  };

  function dir($elements, selector, nameIndex, node) {
      var ret = [];
      var target;
      $elements.each(function (_, element) {
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

  each(['', 's', 'sUntil'], function (nameIndex, name) {
      $.fn[("parent" + name)] = function (selector) {
          // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
          var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
          return dir($nodes, selector, nameIndex, 'parentNode');
      };
  });

  $.fn.slice = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return new JQ([].slice.apply(this, args));
  };

  $.fn.eq = function (index) {
      var ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);
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
          return this.each(function (_, element) {
              data(element, key);
          });
      }
      // 设置值
      if (!isUndefined(value)) {
          return this.each(function (_, element) {
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
      var this$1 = this;

      each(obj, function (prop, value) {
          // 在 JQ 对象上扩展方法时，需要自己添加 typescript 的类型定义
          // @ts-ignore
          this$1[prop] = value;
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
          return this.map(function (index, element) { return selector.call(element, index, element) ? element : undefined; });
      }
      var $selector = $(selector);
      return this.map(function (_, element) { return $selector.index(element) > -1 ? element : undefined; });
  };

  $.fn.first = function () {
      return this.eq(0);
  };

  $.fn.has = function (selector) {
      var $targets = isString(selector) ? this.find(selector) : $(selector);
      var length = $targets.length;
      return this.filter(function () {
          if (isWindow(this)) {
              return false;
          }
          for (var i = 0; i < length; i += 1) {
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
  }, function (prop, name) {
      $.fn[name] = function (value) {
          // 获取值
          if (isUndefined(value)) {
              var element = this[0];
              if (isWindow(element)) {
                  // @ts-ignore
                  return element[("inner" + prop)];
              }
              if (isDocument(element)) {
                  // @ts-ignore
                  return element.documentElement[("scroll" + prop)];
              }
              var $element = $(element);
              // IE10、IE11 在 box-sizing:border-box 时，不会包含 padding 和 border，这里进行修复
              var IEFixValue = 0;
              var isWidth = name === 'width';
              // 判断是 IE 浏览器
              if ('ActiveXObject' in window) {
                  if ($element.css('box-sizing') === 'border-box') {
                      var directionLeft = isWidth ? 'left' : 'top';
                      var directionRight = isWidth ? 'right' : 'bottom';
                      var propertyNames = [
                          ("padding-" + directionLeft),
                          ("padding-" + directionRight),
                          ("border-" + directionLeft + "-width"),
                          ("border-" + directionRight + "-width") ];
                      each(propertyNames, function (_, property) {
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

  each(['val', 'html', 'text'], function (nameIndex, name) {
      var props = {
          0: 'value',
          1: 'innerHTML',
          2: 'textContent',
      };
      var defaults = {
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
          return this.each(function (_, element) {
              // @ts-ignore
              element[props[nameIndex]] = value;
          });
      };
  });

  each({
      Width: 'width',
      Height: 'height',
  }, function (prop, name) {
      $.fn[("inner" + prop)] = function () {
          var value = this[name]();
          var $element = $(this[0]);
          if ($element.css('box-sizing') !== 'border-box') {
              var isWidth = name === 'width';
              var directionLeft = isWidth ? 'left' : 'top';
              var directionRight = isWidth ? 'right' : 'bottom';
              var propertyNames = [
                  ("padding-" + directionLeft),
                  ("padding-" + directionRight) ];
              each(propertyNames, function (_, property) {
                  value += parseFloat($element.css(property) || '0');
              });
          }
          return value;
      };
  });

  $.fn.last = function () {
      return this.eq(-1);
  };

  each(['', 'All', 'Until'], function (nameIndex, name) {
      $.fn[("next" + name)] = function (selector) {
          return dir(this, selector, nameIndex, 'nextElementSibling');
      };
  });

  $.fn.not = function (selector) {
      var $excludes = this.filter(selector);
      return this.map(function (index, element) { return $excludes.index(element) > -1 ? undefined : element; });
  };

  $.fn.offset = function () {
      var element = this[0];
      if (element && isElement(element)) {
          var offset = element.getBoundingClientRect();
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
          var parent = this.offsetParent;
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
      var element = this[0];
      if (!element || !isElement(element)) {
          return undefined;
      }
      var $offsetParent;
      var parentOffset = {
          left: 0,
          top: 0,
      };
      var offset = this.offset();
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

  each(['', 'All', 'Until'], function (nameIndex, name) {
      $.fn[("prev" + name)] = function (selector) {
          // prevAll、prevUntil 需要把元素的顺序倒序处理，以便和 jQuery 的结果一致
          var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
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
      return this.each(function (_, element) {
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
      var result = [];
      var formElement = this[0];
      if (!formElement || !(formElement instanceof HTMLFormElement)) {
          return result;
      }
      $([].slice.call(formElement.elements)).each(function () {
          var $item = $(this);
          var type = $item.attr('type');
          if (!isNodeName(this, 'fieldset') &&
              // @ts-ignore
              !this.disabled &&
              // @ts-ignore
              ['submit', 'reset', 'button'].indexOf(type) === -1 &&
              // @ts-ignore
              (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)) {
              var name = $item.attr('name');
              if (name) {
                  result.push({
                      name: name,
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
      var result = [];
      each(this.serializeArray(), function (_, item) {
          result.push(((encodeURIComponent(item.name)) + "=" + (encodeURIComponent(item.value))));
      });
      return result.join('&');
  };

  var elementDisplay = {};
  /**
   * 获取元素的默认 display 样式值，用于 .show() 方法
   * @param nodeName
   */
  function defaultDisplay(nodeName) {
      var element;
      var display;
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

  return $;

}));

import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.removeClass()', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="foo" class="mdui class1 class2">Hello</div>
<div id="bar">World</div>
    `);
  });

  it('.removeClass(name)', function () {
    const $foo = $('#foo');
    assert.equal($foo.attr('class'), 'mdui class1 class2');

    // 移除空字符串类
    $foo.removeClass('');
    assert.equal($foo.attr('class'), 'mdui class1 class2');

    // 移除不存在的类
    $foo.removeClass('fffff');
    assert.equal($foo.attr('class'), 'mdui class1 class2');

    // 移除一个类
    // 返回 JQ
    const $result = $foo.removeClass('mdui');
    assert.deepEqual($result, $foo);
    assert.equal($foo.attr('class'), 'class1 class2');

    // 移除多个类，用空格分隔
    $foo.removeClass('class1  class2');
    assert.equal($foo.attr('class'), '');

    // 没有传入参数，移除所有 class
    $foo.addClass('mdui1 mdui2').removeClass();
    assert.equal($foo.attr('class'), '');
  });

  it('.removeClass(callback)', function () {
    const $foo = $('#foo');
    const $bar = $('#bar');

    // 函数的 this 指向，参数验证
    let _this;
    let _i;
    let _currentClassName;
    $foo.removeClass(function (i, currentClassName) {
      _this = this;
      _i = i;
      _currentClassName = currentClassName;

      return '';
    });

    assert.deepEqual(_this, $foo[0]);
    assert.equal(_i, 0);
    assert.equal(_currentClassName, 'mdui class1 class2');

    // 通过函数返回类
    $foo.removeClass(function () {
      return 'mdui';
    });
    assert.equal($foo.attr('class'), 'class1 class2');

    // 通过函数返回多个类
    $foo.removeClass(function () {
      return 'class1 class2';
    });
    assert.equal($foo.attr('class'), '');

    // 函数返回不同的值
    $('#test div')
      .addClass('item-0 item-1')
      .removeClass(function (index) {
        return `item-${index}`;
      });
    assert.isFalse($foo.hasClass('item-0'));
    assert.isTrue($foo.hasClass('item-1'));
    assert.isTrue($bar.hasClass('item-0'));
    assert.isFalse($bar.hasClass('item-1'));
  });
});

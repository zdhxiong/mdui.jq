import $ from '../../jq_or_jquery';

describe('.removeClass()', function() {
  beforeEach(function() {
    $('#test').html('<div id="foo" class="mdui class1 class2">Goodbye</div>');
  });

  it('.removeClass(name)', function() {
    const $div = $('#foo');
    chai.assert.equal($div[0].classList.value, 'mdui class1 class2');

    // 移除空字符串类
    $div.removeClass('');
    chai.assert.equal($div[0].classList.value, 'mdui class1 class2');

    // 移除不存在的类
    $div.removeClass('fffff');
    chai.assert.equal($div[0].classList.value, 'mdui class1 class2');

    // 移除一个类
    // 返回 JQ
    const $result = $div.removeClass('mdui');
    chai.assert.deepEqual($result, $div);
    chai.assert.equal($div[0].classList.value, 'class1 class2');

    // 移除多个类，用空格分隔
    $div.removeClass('class1  class2');
    chai.assert.equal($div[0].classList.value, '');
  });

  it('.removeClass(callback)', function() {
    const $div = $('#foo');

    // 函数的 this 指向，参数验证
    let _this;
    let _i;
    let _currentClassName;
    $div.removeClass(function(i, currentClassName) {
      _this = this;
      _i = i;
      _currentClassName = currentClassName;

      return '';
    });

    chai.assert.deepEqual(_this, $div[0]);
    chai.assert.equal(_i, 0);
    chai.assert.equal(_currentClassName, 'mdui class1 class2');

    // 通过函数返回类
    $div.removeClass(function() {
      return 'mdui';
    });
    chai.assert.equal($div[0].classList.value, 'class1 class2');

    // 通过函数返回多个类
    $div.removeClass(function() {
      return 'class1 class2';
    });
    chai.assert.equal($div[0].classList.value, '');
  });
});

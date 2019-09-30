import $ from '../../jq_or_jquery';

describe('.addClass()', function() {
  beforeEach(function() {
    $('#test').html('<div id="foo">Goodbye</div>');
  });

  it('.addClass(name)', function() {
    const $div = $('#foo');
    chai.assert.equal($div[0].classList.value, '');

    // 添加空字符
    $div.addClass('');
    chai.assert.equal($div[0].classList.value, '');

    // 添加一个类
    // 返回 JQ
    const $result = $div.addClass('mdui');
    chai.assert.deepEqual($result, $div);
    chai.assert.equal($div[0].classList.value, 'mdui');

    // 添加多个类，用空格分隔
    $div.addClass('mdui1  mdui2');
    chai.assert.equal($div[0].classList.value, 'mdui mdui1 mdui2');
  });

  it('.addClass(callback)', function() {
    const $div = $('#foo');

    // 函数的 this 指向，参数验证
    let _this;
    let _i;
    let _currentClassName;
    $div.addClass('mdui1 mdui2');
    $div.addClass(function(i, currentClassName) {
      _this = this;
      _i = i;
      _currentClassName = currentClassName;

      return '';
    });

    chai.assert.deepEqual(_this, $div[0]);
    chai.assert.equal(_i, 0);
    chai.assert.equal(_currentClassName, 'mdui1 mdui2');

    // 通过函数返回类
    $div.addClass(function() {
      return 'mdui3';
    });
    chai.assert.equal($div[0].classList.value, 'mdui1 mdui2 mdui3');

    // 通过函数返回多个类
    $div.addClass(function() {
      return 'mdui4 mdui5  mdui6';
    });
    chai.assert.equal(
      $div[0].classList.value,
      'mdui1 mdui2 mdui3 mdui4 mdui5 mdui6',
    );
  });
});

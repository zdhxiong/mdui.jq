import $ from '../../jq_or_jquery';

describe('.toggleClass()', function() {
  beforeEach(function() {
    $('#test').html('<div id="foo" class="mdui">Goodbye</div>');
  });

  it('.toggleClass(name)', function() {
    const $div = $('#foo');
    chai.assert.equal($div[0].classList.value, 'mdui');

    // 切换空类
    $div.toggleClass('');
    chai.assert.equal($div[0].classList.value, 'mdui');

    // 切换一个类
    // 返回 JQ
    const $result = $div.toggleClass('box1');
    chai.assert.deepEqual($result, $div);
    chai.assert.equal($div[0].classList.value, 'mdui box1');

    // 切换多个类，用空格分隔
    $div.toggleClass('box1 box2');
    chai.assert.equal($div[0].classList.value, 'mdui box2');
  });

  it('.toggleClass(callback)', function() {
    const $div = $('#foo');

    // 函数的 this 指向，参数验证
    let _this;
    let _i;
    let _currentClassName;
    $div.toggleClass(function(i, currentClassName) {
      _this = this;
      _i = i;
      _currentClassName = currentClassName;

      return '';
    });

    chai.assert.deepEqual(_this, $div[0]);
    chai.assert.equal(_i, 0);
    chai.assert.equal(_currentClassName, 'mdui');

    // 通过函数返回类
    $div.toggleClass(function() {
      return 'mdui1';
    });
    chai.assert.equal($div[0].classList.value, 'mdui mdui1');

    // 通过函数返回多个类
    $div.toggleClass(function() {
      return 'mdui1  mdui2';
    });
    chai.assert.equal($div[0].classList.value, 'mdui mdui2');
  });
});

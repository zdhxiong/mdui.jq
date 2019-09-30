import $ from '../../jq_or_jquery';

describe('$.data, $.removeData', function() {
  beforeEach(function() {
    $('#test').html(
      '<div class="intro" data-key="val" data-key-sub="val-sub"></div>',
    );
  });

  it('$.data(element, key, value)', function() {
    const intro = $('.intro')[0];

    // 存储字符串
    const val = $.data(intro, 'string', 'value');
    chai.assert.equal(val, 'value');
    chai.assert.equal($.data(intro, 'string'), 'value');

    // 删除数据
    $.removeData(intro, 'string');
    chai.assert.isUndefined($.data(intro, 'string'));

    // 覆盖 data-* 属性
    $.data(intro, 'key-sub', 'testval');
    chai.assert.equal($.data(intro, 'key-sub'), 'testval');

    // 删除数据后，恢复为 data-* 属性的值
    $.removeData(intro, 'key-sub');
    chai.assert.equal($.data(intro, 'key-sub'), 'val-sub');

    // 存储对象
    $.data(intro, 'object', { test: 'test' });
    chai.assert.deepEqual($.data(intro, 'object'), { test: 'test' });

    // 存储数组
    $.data(intro, 'array', [1, 2, 3, 4]);
    chai.assert.sameOrderedMembers($.data(intro, 'array'), [1, 2, 3, 4]);
  });

  it('$.data(element, data)', function() {
    const intro = $('.intro')[0];

    // 通过键值对存储数据
    const val = $.data(intro, {
      objkey1: 'objval1',
      objkey2: 'objval2',
    });
    chai.assert.equal(val.objkey1, 'objval1');
    chai.assert.equal(val.objkey2, 'objval2');
    chai.assert.equal($.data(intro, 'objkey1'), 'objval1');
    chai.assert.equal($.data(intro, 'objkey2'), 'objval2');
  });

  it('$.data(element, key)', function() {
    const intro = $('.intro')[0];

    // 读取 data-* 属性
    chai.assert.equal($.data(intro, 'key'), 'val');
    chai.assert.equal($.data(intro, 'key-sub'), 'val-sub');
  });

  it('$.data(element)', function() {
    const intro = $('.intro')[0];

    // 读取 data-* 属性
    chai.assert.equal($.data(intro).key, 'val');
    chai.assert.equal($.data(intro).keySub, 'val-sub');

    // 获取所有数据
    $.data(intro, 'string', 'value');
    $.data(intro, {
      objkey1: 'objval1',
      objkey2: 'objval2',
    });
    chai.assert.deepEqual($.data(intro), {
      string: 'value',
      objkey1: 'objval1',
      objkey2: 'objval2',
      key: 'val',
      keySub: 'val-sub',
    });

    // 删除所有数据
    $.removeData(intro);
    chai.assert.deepEqual($.data(intro), {
      key: 'val',
      keySub: 'val-sub',
    });
  });

  it('$.removeData(element)', function() {
    // tested
  });

  it('$.removeData(element, name)', function() {
    // tested
  });
});

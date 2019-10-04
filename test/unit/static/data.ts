import $ from '../../jq_or_jquery';

describe('$.data, $.removeData', function() {
  beforeEach(function() {
    $('#test').html('<div class="intro" data-key="val"></div>');
  });

  it('$.data(element, key, value)', function() {
    const intro = $('.intro')[0];
    const testArrayData = [1, 2, 3, 4];
    const testObjectData = { test1: 'test1', test2: 'test2' };

    // 存储字符串
    const val = $.data(intro, 'string', 'value');
    chai.assert.equal(val, 'value');
    chai.assert.equal($.data(intro, 'string'), 'value');

    // 删除数据
    $.removeData(intro, 'string');
    chai.assert.isUndefined($.data(intro, 'string'));

    // 覆盖 data-* 属性
    $.data(intro, 'key', 'newval');
    chai.assert.equal($.data(intro, 'key'), 'newval');

    // 删除数据后，恢复为默认
    $.removeData(intro, 'key');
    chai.assert.isUndefined($.data(intro, 'key'));

    // 存储对象
    $.data(intro, 'object', testObjectData);
    chai.assert.deepEqual($.data(intro, 'object'), testObjectData);

    // 存储数组
    $.data(intro, 'array', testArrayData);
    chai.assert.sameOrderedMembers($.data(intro, 'array'), testArrayData);

    // $.data(element, key, undefined) 相当于 $.data(element, key)
    chai.assert.sameOrderedMembers(
      $.data(intro, 'array', undefined),
      testArrayData,
    );
    chai.assert.sameOrderedMembers($.data(intro, 'array'), testArrayData);

    // $.data(element, key, null) 将存储 null 值
    chai.assert.isNull($.data(intro, 'nullkey', null));
    chai.assert.isNull($.data(intro, 'nullkey'));
  });

  it('$.data(element, data)', function() {
    const intro = $('.intro')[0];
    const testObjectData = { test1: 'test1', test2: 'test2' };

    // 通过键值对存储数据
    const val = $.data(intro, testObjectData);
    chai.assert.deepEqual(val, testObjectData);
    chai.assert.deepEqual($.data(intro), testObjectData);
    chai.assert.equal($.data(intro, 'test1'), 'test1');
    chai.assert.equal($.data(intro, 'test2'), 'test2');
  });

  it('$.data(element, key)', function() {
    const intro = $('.intro')[0];

    // 无法获取 data-* 的值
    chai.assert.isUndefined($.data(intro, 'key'));

    // 读取不存在的值
    chai.assert.isUndefined($.data(intro, 'test'));
  });

  it('$.data(element)', function() {
    const intro = $('.intro')[0];

    // 读取不了 data-* 属性
    chai.assert.deepEqual($.data(intro), {});

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
    });

    // 删除所有数据
    $.removeData(intro);
    chai.assert.deepEqual($.data(intro), {});
  });

  it('$.removeData(element)', function() {
    // tested
  });

  it('$.removeData(element, name)', function() {
    // tested
  });
});

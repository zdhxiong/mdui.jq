import $ from '../../jq_or_jquery';

describe('.attr()', function() {
  beforeEach(function() {
    $('#test').html('<div id="child" mdui="test"></div>');
  });

  // 设置元素的属性
  it('.attr(name: string, value): JQ', function() {
    const $child = $('#child');
    $child.attr('mdui', 'value');

    const attr = $child.attr('mdui');
    chai.assert.equal(attr, 'value');
  });

  // 同时设置多个属性
  it('.attr(object): JQ', function() {
    const $child = $('#child');
    $child.attr({
      key1: 'value1',
      key2: 'value2',
    });
    chai.assert.equal($child.attr('mdui'), 'test');
    chai.assert.equal($child.attr('key1'), 'value1');
    chai.assert.equal($child.attr('key2'), 'value2');
  });

  // 获取第一个元素的属性值
  it('.attr(name: string): string | undefined', function() {
    const attr = $('#child').attr('mdui');
    chai.assert.equal(attr, 'test');
  });
});

import $ from '../../../es/$';
import '../../../es/methods/css';
import '../../../es/methods/html';

describe('.css()', function() {
  beforeEach(function() {
    $('#test').html('<div id="css" style="width: 100px;"></div>');
  });

  // 设置元素的样式
  it('.css(name: string, value): JQ', function() {
    const $element = $('#css');

    $element.css('width', '200px');
    chai.assert.equal($element.css('width'), '200px');
  });

  // 同时设置多个样式
  it('.css(object): JQ', function() {
    const $element = $('#css');

    $element.css({
      width: '200px',
      height: '150px',
    });
    chai.assert.equal($element.css('width'), '200px');
    chai.assert.equal($element.css('height'), '150px');
  });

  // 获取第一个元素的样式
  it('.css(name: string): string | undefined', function() {
    const $element = $('#css');

    chai.assert.equal($element.css('width'), '100px');
  });
});

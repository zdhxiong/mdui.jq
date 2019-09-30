import $ from '../../../es/$';
import '../../../es/methods/hasClass';
import '../../../es/methods/html';
import '../../../es/methods/toggleClass';

describe('.toggleClass()', function() {
  beforeEach(function() {
    $('#test').html('<div class="mdui">Goodbye</div>');
  });

  it('.toggleClass(className: string): JQ', function() {
    const $div = $('#test div');

    // 切换一个类
    $div.toggleClass('box1');
    chai.assert.isTrue($div.hasClass('mdui'));
    chai.assert.isTrue($div.hasClass('box1'));

    // 切换多个类，用空格分隔
    $div.toggleClass('box1 box2');
    chai.assert.isTrue($div.hasClass('mdui'));
    chai.assert.isFalse($div.hasClass('box1'));
    chai.assert.isTrue($div.hasClass('box2'));
  });
});

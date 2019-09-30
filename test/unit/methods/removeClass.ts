import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/removeClass';

describe('.removeClass()', function() {
  beforeEach(function() {
    $('#test').html('<div class="mdui class1 class2">Goodbye</div>');
  });

  it('.removeClass(name: string): JQ', function() {
    const $div = $('#test div');

    // 移除一个类
    $div.removeClass('mdui');
    chai.assert.isFalse($div[0].classList.contains('mdui'));
    chai.assert.isTrue($div[0].classList.contains('class1'));
    chai.assert.isTrue($div[0].classList.contains('class2'));

    // 移除多个类，用空格分隔
    $div.removeClass('class1 class2');
    chai.assert.isFalse($div[0].classList.contains('class1'));
    chai.assert.isFalse($div[0].classList.contains('class2'));
  });
});

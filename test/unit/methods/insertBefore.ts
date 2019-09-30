import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/insertBefore';

describe('.insertBefore()', function() {
  it('.insertBefore(JQSelector): JQ', function() {
    // 新建一个元素，并添加到指定元素前面
    $('#test').html('<div>item</div>');
    $('<p>test</p>').insertBefore('#test div');
    chai.assert.equal($('#test').html(), '<p>test</p><div>item</div>');

    // 把一个已有元素添加到另一个元素前面
    $('#test').html(
      '<div class="first">first</div><div class="second">second</div>',
    );
    $('.second').insertBefore('.first');
    chai.assert.equal(
      $('#test').html(),
      '<div class="second">second</div><div class="first">first</div>',
    );
  });
});

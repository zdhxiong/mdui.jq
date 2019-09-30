import $ from '../../../es/index';

describe('.insertAfter()', function() {
  it('.insertAfter(JQSelector): jQ', function() {
    // 新建一个元素，并添加到指定元素后面
    $('#test').html('<div>item</div>');
    $('<p>test</p>').insertAfter('#test div');
    chai.assert.equal($('#test').html(), '<div>item</div><p>test</p>');

    // 新建一个元素，添加到多个元素后面
    $('#test').html('<div>item</div><div>item</div>');
    $('<p>test</p>').insertAfter('#test div');
    chai.assert.equal(
      $('#test').html(),
      '<div>item</div><p>test</p><div>item</div><p>test</p>',
    );

    // 把一个已有元素移动到另一个元素后面
    $('#test').html(
      '<div class="first">first</div><div class="second">second</div>',
    );
    $('.first').insertAfter('.second');
    chai.assert.equal(
      $('#test').html(),
      '<div class="second">second</div><div class="first">first</div>',
    );

    // 把一个已有元素移动到多个元素后面
    $('#test').html(
      '<div class="first">first</div><div class="inner">target</div><div class="inner">target</div>',
    );
    $('.first').insertAfter('.inner');
    chai.assert.equal(
      $('#test').html(),
      '<div class="inner">target</div><div class="first">first</div><div class="inner">target</div><div class="first">first</div>',
    );
  });
});

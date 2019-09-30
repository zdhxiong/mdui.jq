import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/prepend';

describe('.prepend()', function() {
  const $test = $('#test');

  it('.prepend(JQSelector): JQ', function() {
    // 前置纯文本
    $test.html('<p class="first">first</p>');
    $('.first').prepend('dd');
    chai.assert.equal($test.html(), '<p class="first">ddfirst</p>');

    // 前置 HTML
    $test.html('<p class="first">first</p>');
    $('.first').prepend('<i>icon</i><i>icons</i>');
    chai.assert.equal(
      $test.html(),
      '<p class="first"><i>icon</i><i>icons</i>first</p>',
    );

    // 前置 HTML 和纯文本
    $test.html('<p class="first">first</p>');
    $('.first').prepend('dd<i>icon</i><i>icons</i>');
    chai.assert.equal(
      $test.html(),
      '<p class="first">dd<i>icon</i><i>icons</i>first</p>',
    );

    // 前置 JQ 对象
    $test.html(
      '<p class="first">first1</p>' +
        '<p class="second">second</p>' +
        '<p class="first">first2</p>',
    );
    $('.second').prepend($('.first'));
    chai.assert.equal(
      $test.html(),
      '<p class="second">' +
        '<p class="first">first1</p>' +
        '<p class="first">first2</p>second</p>',
    );

    $test.html(
      '<p class="first">first1</p>' +
        '<p class="second">second1</p>' +
        '<p class="first">first2</p>' +
        '<p class="second">second2</p>',
    );
    $('.second').prepend($('.first'));
    chai.assert.equal(
      $test.html(),
      '<p class="second"><p class="first">first1</p><p class="first">first2</p>second1</p>' +
        '<p class="second"><p class="first">first1</p><p class="first">first2</p>second2</p>',
    );

    // 前置 DOM 元素
    $test.html(
      '<p class="first">first</p>' +
        '<p class="second">second1</p>' +
        '<p class="second">second2</p>',
    );
    $('.first').prepend($('.second')[0]);
    chai.assert.equal(
      $test.html(),
      '<p class="first"><p class="second">second1</p>first</p>' +
        '<p class="second">second2</p>',
    );

    // 前置 DOM 数组
    $test.html(
      '<p class="first">first</p>' +
        '<p class="second">second1</p>' +
        '<p class="second">second2</p>',
    );
    $('.first').prepend($('.second').get());
    chai.assert.equal(
      $test.html(),
      '<p class="first"><p class="second">second1</p><p class="second">second2</p>first</p>',
    );

    // 前置 NodeList
    $test.html(
      '<p class="first">first</p>' +
        '<p class="second">second1</p>' +
        '<p class="second">second2</p>',
    );
    $('.first').prepend(document.querySelectorAll('.second'));
    chai.assert.equal(
      $test.html(),
      '<p class="first"><p class="second">second1</p><p class="second">second2</p>first</p>',
    );
  });
});

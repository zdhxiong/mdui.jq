import $ from '../../jq_or_jquery';

describe('.append()', function() {
  // 在选中元素内部的后面添加内容
  it('.append(JQSelector): JQ', function() {
    const $test = $('#test');

    // 追加纯文
    $test.html('<p class="first">first</p>');
    $('.first').append('dd');
    chai.assert.equal($test.html(), '<p class="first">firstdd</p>');

    // 追加 HTML
    $test.html('<p class="first">first</p>');
    $('.first').append('<i>icon</i>' + '<i>icon2</i>');
    chai.assert.equal(
      $test.html(),
      '<p class="first">first<i>icon</i><i>icon2</i></p>',
    );

    // 同时追加纯文本和 HTML
    $test.html('<p class="first">first</p>');
    $('.first').append('dd<i>icon</i><i>icon2</i>');
    chai.assert.equal(
      $test.html(),
      '<p class="first">firstdd<i>icon</i><i>icon2</i></p>',
    );

    // 特殊标签中追加 HTML
    $test.html('<table>' + '<tbody class="first"></tbody>' + '</table>');
    $('.first').append('<tr><td>11</td></tr>');
    chai.assert.equal(
      $test.html(),
      '<table>' +
        '<tbody class="first">' +
        '<tr><td>11</td></tr>' +
        '</tbody>' +
        '</table>',
    );

    // 追加 JQ 对象
    $test.html(
      '<p class="first">first1</p>' +
        '<p class="second">second</p>' +
        '<p class="first">first2</p>',
    );
    $('.second').append($('.first'));
    chai.assert.equal(
      $test.html(),
      '<p class="second">second<p class="first">first1</p><p class="first">first2</p></p>',
    );

    $test.html(
      '<p class="first">first1</p>' +
        '<p class="second">second1</p>' +
        '<p class="first">first2</p>' +
        '<p class="second">second2</p>',
    );
    $('.second').append($('.first'));
    chai.assert.equal(
      $test.html(),
      '<p class="second">second1<p class="first">first1</p><p class="first">first2</p></p>' +
        '<p class="second">second2<p class="first">first1</p><p class="first">first2</p></p>',
    );

    // 追加 DOM 元素
    $test.html(
      '<p class="first">first</p>' +
        '<p class="second">second1</p>' +
        '<p class="second">second2</p>',
    );
    $('.first').append($('.second')[0]);
    chai.assert.equal(
      $test.html(),
      '<p class="first">first<p class="second">second1</p></p>' +
        '<p class="second">second2</p>',
    );

    // 追加 DOM 数组
    $test.html(
      '<p class="first">first</p>' +
        '<p class="second">second1</p>' +
        '<p class="second">second2</p>',
    );
    $('.first').append($('.second').get());
    chai.assert.equal(
      $test.html(),
      '<p class="first">first<p class="second">second1</p><p class="second">second2</p></p>',
    );

    // 追加 NodeList
    $test.html(
      '<p class="first">first</p>' +
        '<p class="second">second1</p>' +
        '<p class="second">second2</p>',
    );
    $('.first').append(document.querySelectorAll('.second'));
    chai.assert.equal(
      $test.html(),
      '<p class="first">first<p class="second">second1</p><p class="second">second2</p></p>',
    );
  });
});

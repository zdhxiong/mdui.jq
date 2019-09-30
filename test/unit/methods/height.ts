import $ from '../../jq_or_jquery';

describe('.height()', function() {
  beforeEach(function() {
    $('#test').html(
      '<div id="child" style="width: 100px; height: 500px;display: block"><p>test</p></div>',
    );
  });

  it('.height(string | number): JQ', function() {
    // 在下面做了测试
  });

  it('.height(): number', function() {
    const $child = $('#child');

    chai.assert.equal($child.height(), 500);

    $child.height(10);
    chai.assert.equal($child.height(), 10);

    $child.height('20');
    chai.assert.equal($child.height(), 20);

    $child.height('30px');
    chai.assert.equal($child.height(), 30);

    $child.height('');
    chai.assert.notEqual($child.height(), 30);
  });
});

import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/val';

describe('.val()', function() {
  beforeEach(function() {
    $('#test').html(
      '<div id="child" style="width: 100px; height: 500px;display: block"><p>test</p></div>',
    );
  });

  it('.width(value: string | number): JQ', function() {
    const $child = $('#child');

    chai.assert.equal($child.width(), 100);

    $child.width(10);
    chai.assert.equal($child.width(), 10);

    $child.width('20');
    chai.assert.equal($child.width(), 20);

    $child.width('30px');
    chai.assert.equal($child.width(), 30);

    $child.width('');
    chai.assert.notEqual($child.width(), 30);
  });

  it('.width(): number', function() {
    // tested
  });
});

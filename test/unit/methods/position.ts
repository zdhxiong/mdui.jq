import $ from '../../jq_or_jquery';

describe('.position()', function() {
  beforeEach(function() {
    $('#test').html(`
<div style="position: relative">
  <div id="child" style="position: absolute;left: 100px;top: 200px;width: 150px;height: 120px;"></div>
</div>
    `);
  });

  it('.position(): {left: number, top: number, width: number, height: number} | undefined', function() {
    const position = $('#child').position();

    chai.assert.isUndefined($(window).position());

    chai.assert.isDefined(position);
    if (typeof position !== 'undefined') {
      chai.assert.equal(position.left, 100);
      chai.assert.equal(position.top, 200);
      chai.assert.equal(position.width, 150);
      chai.assert.equal(position.height, 120);
    }
  });
});

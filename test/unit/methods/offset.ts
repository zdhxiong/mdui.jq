import $ from '../../jq_or_jquery';

describe('.offset()', function() {
  beforeEach(function() {
    $('#test')
      .html(
        '<div style="position: absolute;top: 100px;left: 200px;width: 500px;height: 450px;"></div>',
      )
      .css('overflow', 'hidden');
  });

  it('.offset(): {left: number, top: number, width: number, height: number} | undefined', function() {
    const offset = $('#test div').offset();

    chai.assert.isDefined(offset);
    if (typeof offset !== 'undefined') {
      chai.assert.equal(offset.left, 200);
      chai.assert.equal(offset.top, 100);
      chai.assert.equal(offset.width, 500);
      chai.assert.equal(offset.height, 450);
    }
  });
});

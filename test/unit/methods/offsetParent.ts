import $ from '../../jq_or_jquery';

describe('.offsetParent()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child1">
  <div id="child2" style="position: absolute;">
    <div id="child3">
      <div id="child4"></div>
    </div>
  </div>
</div>
    `);
  });

  it('.offsetParent(): JQ', function() {
    chai.assert.equal(
      $('#child4')
        .offsetParent()
        .get(0),
      $('#child2').get(0),
    );
  });
});

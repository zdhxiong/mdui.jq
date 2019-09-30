import $ from '../../jq_or_jquery';

describe('.clone()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div id="child1" class="child1">
    <div id="child2" class="child2"></div>
  </div>
</div>
    `);
  });

  it('.clone(): JQ', function() {
    const $new = $('#child1').clone();

    chai.assert.isTrue($new.hasClass('child1'));
    chai.assert.lengthOf($new.find('#child2'), 1);
  });
});

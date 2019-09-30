import $ from '../../../es/$';
import '../../../es/methods/empty';
import '../../../es/methods/html';

describe('.empty()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div id="child1">
    <div id="child1-1">
      <div id="child1-1-1"></div>
    </div>
  </div>
  <div id="child2"></div>
</div>
    `);
  });

  it('.empty(): JQ', function() {
    $('#child1').empty();

    chai.assert.lengthOf($('#child1'), 1);
    chai.assert.lengthOf($('#child1-1'), 0);
    chai.assert.lengthOf($('#child2'), 1);
  });
});

import $ from '../../jq_or_jquery';

describe('.last()', function() {
  beforeEach(function() {
    $('#test').html(`
<ul>
  <li id="child-1">list item 1</li>
  <li id="child-2">list item 2</li>
  <li id="child-3">list item 3</li>
  <li id="child-4">list item 4</li>
  <li id="child-5">list item 5</li>
</ul>
    `);
  });

  it('.last()', function() {
    chai.assert.isTrue(
      $('#test li')
        .last()
        .is('#child-5'),
    );

    chai.assert.lengthOf($('#notfound').last(), 0);
  });
});

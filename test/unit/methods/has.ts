import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/has';
import '../../../es/methods/html';

describe('.has()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="child" id="child1"></div>
<div class="child" id="child2">
  <div class="child2" id="child2-1"></div>
  <div class="child2" id="child2-2"></div>
</div>
<div class="child" id="child3"></div>
    `);
  });

  it('.has(JQSelector): JQ', function() {
    // selector
    let $children = $('.child').has('#child2-1');
    chai.assert.lengthOf($children, 1);
    chai.assert.isTrue($children.eq(0).is('#child2'));

    // dom
    $children = $('.child').has(document.getElementById('child2-1'));
    chai.assert.lengthOf($children, 1);
    chai.assert.isTrue($children.eq(0).is('#child2'));
  });
});

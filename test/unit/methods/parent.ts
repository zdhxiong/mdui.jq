import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/html';
import '../../../es/methods/is';
import '../../../es/methods/parent';

describe('.parent()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child1" class="child1">
  <div id="child1-1" class="child2">
    <div id="child1-1-1" class="child3"></div>
    <div id="child1-1-2" class="child3"></div>
  </div>
  <div id="child1-2" class="child2"></div>
</div>
<div id="child2" class="child1">
  <div id="child2-1" class="child2">
    <div id="child2-1-1" class="child3"></div>
    <div id="child2-1-2" class="child3"></div>
  </div>
  <div id="child2-2" class="child2"></div>
</div>
    `);
  });

  it('.parent(JQSelector): JQ', function() {
    let $parent = $('#child1-1-1').parent();
    chai.assert.lengthOf($parent, 1);
    chai.assert.isTrue($parent.eq(0).is('#child1-1'));

    $parent = $('.child3').parent();
    chai.assert.lengthOf($parent, 2);
    chai.assert.isTrue($parent.eq(0).is('#child1-1'));
    chai.assert.isTrue($parent.eq(1).is('#child2-1'));

    $parent = $('.child3').parent('#child2-1');
    chai.assert.lengthOf($parent, 1);
    chai.assert.isTrue($parent.eq(0).is('#child2-1'));
  });
});

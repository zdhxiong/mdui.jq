import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/html';
import '../../../es/methods/is';
import '../../../es/methods/parents';

describe('.parents()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child1" class="child1 parent">
  <div id="child1-1" class="child2 parent">
    <div id="child1-1-1" class="child3"></div>
    <div id="child1-1-2" class="child3"></div>
  </div>
  <div id="child1-2" class="child2"></div>
</div>
<div id="child2" class="child1 parent">
  <div id="child2-1" class="child2 parent">
    <div id="child2-1-1" class="child3"></div>
    <div id="child2-1-2" class="child3"></div>
  </div>
  <div id="child2-2" class="child2"></div>
</div>
    `);
  });

  it('.parents(JQSelector): JQ', function() {
    let $parents = $('#child1-1-1').parents('#child1');
    chai.assert.lengthOf($parents, 1);
    chai.assert.isTrue($parents.eq(0).is('#child1'));

    $parents = $('#child1-1-1').parents('.parent');
    chai.assert.lengthOf($parents, 2);
    chai.assert.isTrue($parents.eq(0).is('#child1-1'));
    chai.assert.isTrue($parents.eq(1).is('#child1'));

    $parents = $('.child3').parents('.parent');
    chai.assert.lengthOf($parents, 4);
    chai.assert.isTrue($parents.eq(0).is('#child2-1'));
    chai.assert.isTrue($parents.eq(1).is('#child2'));
    chai.assert.isTrue($parents.eq(2).is('#child1-1'));
    chai.assert.isTrue($parents.eq(3).is('#child1'));

    $parents = $('.child3').parents('.child1');
    chai.assert.lengthOf($parents, 2);
    chai.assert.isTrue($parents.eq(0).is('#child2'));
    chai.assert.isTrue($parents.eq(1).is('#child1'));
  });
});

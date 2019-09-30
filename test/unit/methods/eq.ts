import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/html';
import '../../../es/methods/is';

describe('.eq()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child1" class="child">a</div>
<div id="child2" class="child">b</div>
<div id="child3" class="child">c</div>
<div id="child4" class="child">d</div>
    `);
  });

  it('.eq(index: number): JQ', function() {
    const $children = $('#test .child');

    chai.assert.isTrue($children.eq(0).is('#child1'));
    chai.assert.isTrue($children.eq(1).is('#child2'));
    chai.assert.isTrue($children.eq(2).is('#child3'));
    chai.assert.isTrue($children.eq(3).is('#child4'));
    chai.assert.isTrue($children.eq(-1).is('#child4'));
    chai.assert.isTrue($children.eq(-3).is('#child2'));
  });
});

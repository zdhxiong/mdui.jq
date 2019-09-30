import $ from '../../jq_or_jquery';

describe('.nextUntil()', function() {
  beforeEach(function() {
    $('#test').html(`
<p id="test1">test1</p>
<p id="test2">test2</p>
<p id="test3">test3</p>
<p id="test4">test4</p>
<p id="test5">test5</p>
<div class="parent">
  <div id="child1-1" class="child first"></div>
  <div id="child1-2" class="child"></div>
  <div id="child1-3" class="child"></div>
  <div id="child1-4" class="child"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child first"></div>
  <div id="child2-2" class="child"></div>
</div>
    `);
  });

  it('.nextUntil(JQSelector): JQ', function() {
    let $nexts = $('#test1').nextUntil('#test4');
    chai.assert.lengthOf($nexts, 2);
    chai.assert.isTrue($nexts.eq(0).is('#test2'));
    chai.assert.isTrue($nexts.eq(1).is('#test3'));

    $nexts = $('.first').nextUntil('#child1-4');
    chai.assert.lengthOf($nexts, 3);
    chai.assert.isTrue($nexts.eq(0).is('#child1-2'));
    chai.assert.isTrue($nexts.eq(1).is('#child1-3'));
    chai.assert.isTrue($nexts.eq(2).is('#child2-2'));
  });
});

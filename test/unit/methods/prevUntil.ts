import $ from '../../jq_or_jquery';

describe('.prevUntil()', function() {
  beforeEach(function() {
    $('#test').html(`
<p id="test1">test1</p>
<p id="test2">test2</p>
<p id="test3">test3</p>
<p id="test4">test4</p>
<p id="test5">test5</p>
<div class="parent">
  <div id="child1-1" class="child until"></div>
  <div id="child1-2" class="child"></div>
  <div id="child1-3" class="child"></div>
  <div id="child1-4" class="child last"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child"></div>
  <div id="child2-2" class="child last"></div>
</div>
    `);
  });

  it('.prevUntil(JQSelector): JQ', function() {
    let $prevs = $('#test5').prevUntil('#test2');
    chai.assert.lengthOf($prevs, 2);
    chai.assert.isTrue($prevs.eq(0).is('#test4'));
    chai.assert.isTrue($prevs.eq(1).is('#test3'));

    $prevs = $('.last').prevUntil('.until');
    chai.assert.lengthOf($prevs, 3);
    chai.assert.isTrue($prevs.eq(0).is('#child2-1'));
    chai.assert.isTrue($prevs.eq(1).is('#child1-3'));
    chai.assert.isTrue($prevs.eq(2).is('#child1-2'));
  });
});

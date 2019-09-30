import $ from '../../jq_or_jquery';

describe('.prev()', function() {
  beforeEach(function() {
    $('#test').html(`
<p id="test1">test1</p>
<div id="test2">test2</div>
<p id="test3">test3</p>
<div>
  <p>test</p>
  <div id="test4">test4</div>
  <p id="test5">test5</p>
  <p id="test6">test6</p>
</div>
<div class="parent">
  <div id="child1-1" class="child"></div>
  <div id="child1-2" class="child"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child"></div>
  <div id="child2-2" class="child"></div>
</div>
    `);
  });

  it('.prev(JQSelector): JQ', function() {
    let $prevs = $('#test p').prev();
    chai.assert.lengthOf($prevs, 3);
    chai.assert.isTrue($prevs.eq(0).is('#test2'));
    chai.assert.isTrue($prevs.eq(1).is('#test4'));
    chai.assert.isTrue($prevs.eq(2).is('#test5'));

    $prevs = $('#test6').prev('#test4');
    chai.assert.lengthOf($prevs, 0);

    $prevs = $('#test6').prev('#test5');
    chai.assert.lengthOf($prevs, 1);
    chai.assert.isTrue($prevs.eq(0).is('#test5'));

    $prevs = $('#test5').prev();
    chai.assert.lengthOf($prevs, 1);
    chai.assert.isTrue($prevs.eq(0).is('#test4'));

    $prevs = $('.child').prev();
    chai.assert.lengthOf($prevs, 2);
    chai.assert.isTrue($prevs.eq(0).is('#child1-1'));
    chai.assert.isTrue($prevs.eq(1).is('#child2-1'));
  });
});

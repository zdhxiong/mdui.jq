import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/html';
import '../../../es/methods/is';
import '../../../es/methods/prevAll';

describe('.prevAll()', function() {
  beforeEach(function() {
    $('#test').html(`
<p id="test1">test1</p>
<div id="test2">test2</div>
<p id="test3">test3</p>
<div>
  <p id="test4">test</p>
  <div id="test5">test5</div>
  <p id="test6">test6</p>
  <p id="test7">test7</p>
</div>
<div class="parent">
  <div id="child1-1" class="child"></div>
  <div id="child1-2" class="child"></div>
  <div id="child1-3" class="child last"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child"></div>
  <div id="child2-2" class="child last"></div>
</div>
    `);
  });

  it('.prevAll(JQSelector): JQ', function() {
    let $prevs = $('#test3').prevAll();
    chai.assert.lengthOf($prevs, 2);
    chai.assert.isTrue($prevs.eq(0).is('#test2'));
    chai.assert.isTrue($prevs.eq(1).is('#test1'));

    $prevs = $('#test6').prevAll();
    chai.assert.lengthOf($prevs, 2);
    chai.assert.isTrue($prevs.eq(0).is('#test5'));
    chai.assert.isTrue($prevs.eq(1).is('#test4'));

    $prevs = $('#test6').prevAll('#test4');
    chai.assert.lengthOf($prevs, 1);
    chai.assert.isTrue($prevs.eq(0).is('#test4'));

    $prevs = $('.last').prevAll('.child');
    chai.assert.lengthOf($prevs, 3);
    chai.assert.isTrue($prevs.eq(0).is('#child2-1'));
    chai.assert.isTrue($prevs.eq(1).is('#child1-2'));
    chai.assert.isTrue($prevs.eq(2).is('#child1-1'));
  });
});

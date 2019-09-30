import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/html';
import '../../../es/methods/is';
import '../../../es/methods/next';

describe('.next()', function() {
  beforeEach(function() {
    $('#test').html(`
<p id="test1">test1</p>
<div id="test2">test2</div>
<p id="test3">test3</p>
<div id="wrap">
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

  it('.next(JQSelector): JQ', function() {
    let $nexts = $('#test p').next();
    chai.assert.lengthOf($nexts, 4);
    chai.assert.isTrue($nexts.eq(0).is('#test2'));
    chai.assert.isTrue($nexts.eq(1).is('#wrap'));
    chai.assert.isTrue($nexts.eq(2).is('#test4'));
    chai.assert.isTrue($nexts.eq(3).is('#test6'));

    $nexts = $('#test4').next('#test6');
    chai.assert.lengthOf($nexts, 0);

    $nexts = $('#test4').next('#test5');
    chai.assert.lengthOf($nexts, 1);
    chai.assert.isTrue($nexts.eq(0).is('#test5'));

    $nexts = $('#test4').next();
    chai.assert.lengthOf($nexts, 1);
    chai.assert.isTrue($nexts.eq(0).is('#test5'));

    $nexts = $('.child').next();
    chai.assert.lengthOf($nexts, 2);
    chai.assert.isTrue($nexts.eq(0).is('#child1-2'));
    chai.assert.isTrue($nexts.eq(1).is('#child2-2'));
  });
});

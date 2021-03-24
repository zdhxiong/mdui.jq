import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.nextAll()', function () {
  beforeEach(function () {
    $('#test').html(`
<div class="parent">
  <div id="child1-1" class="child"></div>
  <div id="child1-2" class="child"></div>
</div>
<div class="parent">
  <div id="child2-1" class="child"></div>
  <div id="child2-2" class="child"></div>
</div>
<div>
  <p id="test4">test</p>
  <div id="test5">test5</div>
  <p id="test6">test6</p>
  <p id="test7">test7</p>
</div>
<p id="test1">test1</p>
<div id="test2">test2</div>
<p id="test3">test3</p>
    `);
  });

  it('.nextAll(selector)', function () {
    let $nexts = $('#test1').nextAll();
    assert.lengthOf($nexts, 2);
    assert.isTrue($nexts.eq(0).is('#test2'));
    assert.isTrue($nexts.eq(1).is('#test3'));

    $nexts = $('#test5').nextAll();
    assert.lengthOf($nexts, 2);
    assert.isTrue($nexts.eq(0).is('#test6'));
    assert.isTrue($nexts.eq(1).is('#test7'));

    $nexts = $('#test5').nextAll('#test7');
    assert.lengthOf($nexts, 1);
    assert.isTrue($nexts.eq(0).is('#test7'));

    $nexts = $('.child').nextAll();
    assert.lengthOf($nexts, 2);
    assert.isTrue($nexts.eq(0).is('#child1-2'));
    assert.isTrue($nexts.eq(1).is('#child2-2'));

    $nexts = $('.child').nextAll('#child2-2');
    assert.lengthOf($nexts, 1);
    assert.isTrue($nexts.eq(0).is('#child2-2'));
  });
});

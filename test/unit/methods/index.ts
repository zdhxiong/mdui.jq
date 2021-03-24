import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.index()', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="a">a</div>
<div id="b">b</div>
<div id="c" class="haha">c</div>
<div id="d" class="haha">d</div>
<div id="e">e</div>
    `);
  });

  it('.index()', function () {
    assert.deepEqual($('#c').index(), 2);
    assert.deepEqual($('#notfound').index(), -1);
  });

  it('.index(selector)', function () {
    const $divs = $('#test div');

    assert.deepEqual($divs.index($('#c')[0]), 2);
    assert.deepEqual($divs.index($('#c')), 2);
    assert.deepEqual($divs.index($('.haha')), 2); // JQ 对象中有多个元素时，匹配第一个元素
    assert.deepEqual($divs.index('#c'), -1);
    assert.deepEqual($('#d').index('.haha'), 1);
    assert.deepEqual($divs.index('#notfound'), -1);
    assert.deepEqual($divs.index('.haha'), -1);
  });
});

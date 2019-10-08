import $ from '../../jq_or_jquery';

describe('.find()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div class="child" id="child-1"></div>
  <div class="child" id="child-2">
    <div class="child2" id="child-2-1"></div>
    <div class="child2" id="child-2-2"></div>
  </div>
</div>
    `);
  });

  it('.find(selector)', function() {
    let $children = $('#child').find('.child');
    chai.assert.lengthOf($children, 2);
    chai.assert.isTrue($children.eq(0).is('#child-1'));
    chai.assert.isTrue($children.eq(1).is('#child-2'));

    $children = $('#child').find('.child2');
    chai.assert.lengthOf($children, 2);
    chai.assert.isTrue($children.eq(0).is('#child-2-1'));
    chai.assert.isTrue($children.eq(1).is('#child-2-2'));

    $children = $('#child').find('#child-2-1');
    chai.assert.lengthOf($children, 1);
    chai.assert.isTrue($children.eq(0).is('#child-2-1'));

    $children = $('#child').find('div');
    chai.assert.lengthOf($children, 4);

    chai.assert.lengthOf($(window).find('.child'), 0);
    chai.assert.lengthOf($(document).find('.child'), 2);
  });
});

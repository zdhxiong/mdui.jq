import $ from '../../jq_or_jquery';

describe('.siblings()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child1" class="child1">
  <div id="child1-1" class="child2">
    <div id="child1-1-1" class="child3"></div>
    <div id="child1-1-2" class="child3"></div>
  </div>
  <div id="child1-2" class="child2"></div>
  <div id="child1-3" class="child2"></div>
</div>
    `);
  });

  it('.siblings(selector:? string): JQ', function() {
    // 所有同辈元素
    const $siblings = $('#child1-2').siblings();

    chai.assert.lengthOf($siblings, 2);
    chai.assert.isTrue($siblings.eq(0).is('#child1-1'));
    chai.assert.isTrue($siblings.eq(1).is('#child1-3'));
  });
});

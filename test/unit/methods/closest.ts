import $ from '../../jq_or_jquery';

describe('.closest()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child1" class="child">
  <div id="child2" class="child">
    <div id="child3">
      <div id="child4"></div>
    </div>
  </div>
</div>
    `);
  });

  it('.closest(JQSelector): JQ', function() {
    // $().closest(selector)
    let $dom = $('#child4').closest('.child');
    chai.assert.lengthOf($dom, 1);
    chai.assert.isTrue($dom.eq(0).is('#child2'));

    // $().closest(selector) 当前元素已匹配
    $dom = $('#child4').closest('#child4');
    chai.assert.lengthOf($dom, 1);
    chai.assert.isTrue($dom.eq(0).is('#child4'));
  });
});

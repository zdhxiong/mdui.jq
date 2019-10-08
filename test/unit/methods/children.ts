import $ from '../../jq_or_jquery';

describe('.children()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div id="child1"></div>
  <div id="child2" class="child">
    <div id="child2-1"></div>
    <div id="child2-2"></div>
  </div>
  <div id="child3" class="child"></div>
</div>
`);
  });

  it('.children()', function() {
    const $childs = $('#child').children();

    chai.assert.lengthOf($childs, 3);
    chai.assert.isTrue($childs.eq(0).is('#child1'));
    chai.assert.isTrue($childs.eq(1).is('#child2'));
    chai.assert.isTrue($childs.eq(2).is('#child3'));
  });

  it('.children(selector)', function() {
    let $childs = $('#child').children('.child');
    chai.assert.lengthOf($childs, 2);
    chai.assert.isTrue($childs.eq(0).is('#child2'));
    chai.assert.isTrue($childs.eq(1).is('#child3'));

    $childs = $('#child').children('#child2-1');
    chai.assert.lengthOf($childs, 0);
  });
});

import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/remove';

describe('.remove()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="child">
  <div class="child2" id="child2-1">
    <div class="child3"></div>
  </div>
  <div class="child2" id="child2-2">
    <div class="child3"></div>
  </div>
</div>
    `);
  });

  it('.remove(): JQ', function() {
    $('#child2-1').remove();
    chai.assert.lengthOf($('#child2-1'), 0);
    chai.assert.lengthOf($('.child'), 1);
    chai.assert.lengthOf($('#child2-2'), 1);

    // 未匹配的元素上执行 remove()
    $('#hgufdg').remove();
  });
});

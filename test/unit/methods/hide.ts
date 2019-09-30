import $ from '../../../es/$';
import '../../../es/methods/hide';
import '../../../es/methods/html';

describe('.hide()', function() {
  beforeEach(function() {
    $('#test').html('<div class="child"></div><div class="child"></div>');
  });

  it('.hide(): JQ', function() {
    const $children = $('.child');

    chai.assert.equal($children[0].style.display, '');
    chai.assert.equal($children[1].style.display, '');

    $('.child').hide();

    chai.assert.equal($children[0].style.display, 'none');
    chai.assert.equal($children[1].style.display, 'none');
  });
});

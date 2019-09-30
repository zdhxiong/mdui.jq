import $ from '../../jq_or_jquery';

describe('.toggle()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="child" style="display: none"></div>
<div class="child"></div>
    `);
  });

  it('.toggle(): JQ', function() {
    $('.child').toggle();

    chai.assert.equal($('.child')[0].style.display, '');
    chai.assert.equal($('.child')[1].style.display, 'none');
  });
});

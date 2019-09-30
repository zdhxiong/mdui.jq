import $ from '../../jq_or_jquery';

describe('.show()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="div" style="display: none"></div>
<div class="div" style="display: none"></div>
<span class="span" style="display: none"></span>
    `);
  });

  it('.show(): JQ', function() {
    $('.div').show();
    $('.span').show();

    chai.assert.equal($('.div')[0].style.display, '');
    chai.assert.equal($('.div')[1].style.display, '');
    chai.assert.equal($('.span')[0].style.display, '');
  });
});

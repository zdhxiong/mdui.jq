import $ from '../../jq_or_jquery';

describe('.val()', function() {
  beforeEach(function() {
    $('#test').html('<input type="text" id="input" value="test"/>');
  });

  it('.val(value: string | number | string[]): JQ', function() {
    const $input = $('#input');
    $input.val('dddd');
    chai.assert.equal($input.val(), 'dddd');
  });

  it('.val(): JQ', function() {
    const $input = $('#input');
    chai.assert.equal($input.val(), 'test');
  });
});

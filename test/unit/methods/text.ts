import $ from '../../jq_or_jquery';

describe('.text()', function() {
  beforeEach(function() {
    $('#test').html('<div id="text">test</div>');
  });

  it('.text(text: string | number | boolean): JQ', function() {
    const $text = $('#text');
    $text.text('dddd');
    chai.assert.equal($text.text(), 'dddd');
  });

  it('.text(): string', function() {
    const $text = $('#text');
    chai.assert.equal($text.text(), 'test');
  });
});

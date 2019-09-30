import $ from '../../../es/$';
import '../../../es/methods/html';

describe('.html()', function() {
  beforeEach(function() {
    $('#test').html('<div id="html"><p>test</p></div>');
  });

  it('.html(string): JQ', function() {
    $('#test').html('test');
    chai.assert.equal($('#test').html(), 'test');

    $('#test').html('<div>dd</div>');
    chai.assert.equal($('#test').html(), '<div>dd</div>');
  });

  it('.html(): string', function() {
    chai.assert.equal($('#test').html(), '<div id="html"><p>test</p></div>');
  });
});

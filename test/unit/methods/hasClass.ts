import $ from '../../../es/$';
import '../../../es/methods/hasClass';
import '../../../es/methods/html';

describe('.hasClass()', function() {
  beforeEach(function() {
    $('#test').html('<div class="mdui">Goodbye</div>');
  });

  it('.hasClass(string): boolean', function() {
    const $div = $('#test div');
    chai.assert.isTrue($div.hasClass('mdui'));
    chai.assert.isFalse($div.hasClass('test'));
  });
});

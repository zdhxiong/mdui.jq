import $ from '../../../es/$';
import '../../../es/methods/get';
import '../../../es/methods/html';
import '../../../es/methods/removeAttr';

describe('.removeAttr()', function() {
  beforeEach(function() {
    $('#test').html('<div id="child" mdui="test"></div>');
  });

  it('.removeAttr(name: string): JQ', function() {
    chai.assert.equal(
      $('#child')
        .get(0)
        .getAttribute('mdui'),
      'test',
    );

    $('#child').removeAttr('mdui');
    chai.assert.equal(
      $('#child')
        .get(0)
        .getAttribute('mdui'),
      null,
    );
  });
});

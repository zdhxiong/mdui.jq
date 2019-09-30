import $ from '../../jq_or_jquery';

describe('.removeProp()', function() {
  beforeEach(function() {
    $('#test').html('<input type="checkbox" id="child"/>');
  });

  it('.removeProp(name: string): JQ', function() {
    const $child = $('#child');

    $child.prop('mmmm', 'nnnn');
    chai.assert.equal($child.prop('mmmm'), 'nnnn');

    $child.removeProp('mmmm');
    chai.assert.isUndefined($child.prop('mmmm'));
  });
});

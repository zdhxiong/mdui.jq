import $ from '../../jq_or_jquery';

describe('.replaceWith()', function() {
  function reset(): void {
    $('#test').html(
      '<div id="child">' +
        '<div id="child1"></div>' +
        '<div id="child2"></div>' +
        '<div id="child3"></div>' +
        '</div>',
    );
  }

  it('.replaceWith(JQSelector): JQ', function() {
    reset();
    $('#child2').replaceWith('<div id="test2"></div>');
    chai.assert.equal(
      $('#child').html(),
      '<div id="child1"></div><div id="test2"></div><div id="child3"></div>',
    );

    reset();
    $('#child1').replaceWith($('#child3'));
    chai.assert.equal(
      $('#child').html(),
      '<div id="child3"></div><div id="child2"></div>',
    );

    reset();
    $('#child1').replaceWith($('#child3').get(0));
    chai.assert.equal(
      $('#child').html(),
      '<div id="child3"></div><div id="child2"></div>',
    );
  });
});

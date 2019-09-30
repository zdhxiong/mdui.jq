import $ from '../../jq_or_jquery';

describe('.is()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="child" id="child1"></div>
<div class="child" id="child2"></div>
<div class="child" id="child3"></div>
    `);
  });

  it('.is(JQSelector): boolean', function() {
    // selector
    chai.assert.isTrue($('.child').is('.child'));
    chai.assert.isTrue($('.child').is('#child1'));
    chai.assert.isFalse($('.child').is('.test'));

    // window, document
    chai.assert.isTrue($(document).is(document));
    // assert.isTrue($(window).is(window));
    chai.assert.isFalse($(document).is(window));
    chai.assert.isFalse($(window).is(document));

    // Node
    chai.assert.isTrue($('.child').is(document.getElementById('child1')));
    chai.assert.isFalse($('.child').is(document.getElementById('child6')));

    // NodeList
    chai.assert.isTrue($('.child').is(document.querySelectorAll('.child')));
    chai.assert.isFalse($('.child').is(document.querySelectorAll('#test')));

    // Array
    chai.assert.isTrue($('.child').is($('.child').get()));

    // JQ
    chai.assert.isTrue($('.child').is($('.child')));
    chai.assert.isTrue($('.child').is($('#child1')));
    chai.assert.isFalse($('.child').is($('#child6')));
  });
});

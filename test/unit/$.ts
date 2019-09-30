import $ from '../jq_or_jquery';

describe('$()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="testid"></div>
<div class="testclass"></div>
<span class="testclass"></div>
<span id="span1"></span>
<span id="span2"></span>
`);
  });

  it('$(window)', function() {
    const $window = $(window);
    chai.assert.lengthOf($window, 1);
    chai.assert.instanceOf($window[0], Window);
  });

  it('$(document)', function() {
    const $document = $(document);
    chai.assert.lengthOf($document, 1);
    chai.assert.instanceOf($document[0], Document);
  });

  it('$(html_element)', function() {
    const $element = $(document.getElementById('testid'));
    chai.assert.lengthOf($element, 1);
    chai.assert.instanceOf($element[0], HTMLDivElement);
  });

  it('$(html_element)', function() {
    const nodeList = document.querySelectorAll('.testclass');
    const nodes = [];
    for (let i = 0; i < nodeList.length; i++) {
      nodes.push(nodeList[i]);
    }
    const $elements = $(nodes);
    chai.assert.lengthOf($elements, 2);
  });

  it('$(html_string)', function() {
    const $htmlElement = $('<div><p>Hello</p></div>');
    chai.assert.lengthOf($htmlElement, 1);
    chai.assert.equal($htmlElement[0].outerHTML, '<div><p>Hello</p></div>');
    chai.assert.instanceOf($htmlElement[0], HTMLDivElement);
  });

  it('$(id_selector)', function() {
    const $id = $('#testid');
    chai.assert.lengthOf($id, 1);
    chai.assert.instanceOf($id[0], HTMLDivElement);
  });

  it('$(class_selector)', function() {
    const $class = $('.testclass');
    chai.assert.lengthOf($class, 2);
    chai.assert.instanceOf($class[0], HTMLDivElement);
    chai.assert.instanceOf($class[1], HTMLSpanElement);
  });

  it('$(tag_selector)', function() {
    const $tag = $('#test span');
    chai.assert.lengthOf($tag, 3);
  });

  it('$(nodeList)', function() {
    const $nodeList = $(document.querySelectorAll('.testclass'));
    chai.assert.lengthOf($nodeList, 2);
  });

  it('$($elements)', function() {
    const $class = $('.testclass');
    const $jq = $($class);
    chai.assert.equal($class, $jq);
  });

  it('$(callback)', function() {
    const $fc = $(function(_$) {
      chai.assert.equal(this, document);
      chai.assert.equal($, _$);
    });

    chai.assert.lengthOf($fc, 1);
    chai.assert.equal($fc[0], document);
  });

  it('$(not_found)', function() {
    const $element = $('#test button');
    chai.assert.lengthOf($element, 0);

    const $selector = $('.not-found');
    chai.assert.lengthOf($selector, 0);
  });
});

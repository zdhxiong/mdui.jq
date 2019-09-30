import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/index';

describe('.index()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <div id="child1"></div>
  <div id="child2"></div>
  <div id="child3"></div>
  <div id="child4"></div>
</div>
    `);
  });

  it('.index(): number', function() {
    chai.assert.equal($('#child3').index(), 2);
  });

  it('.index(selector): number', function() {
    chai.assert.equal($('#child3').index('#child div'), 2);
  });

  it('.index(element): number', function() {
    chai.assert.equal($('#child div').index($('#child3').get(0)), 2);
  });

  it('.index(JQ): number', function() {
    chai.assert.equal($('#child div').index($('#child3')), 2);
  });
});

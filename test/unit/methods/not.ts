import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/html';
import '../../../es/methods/is';
import '../../../es/methods/not';

describe('.not()', function() {
  beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div class="haha">b</div>
<div class="haha">c</div>
<div>d</div>
    `);
  });

  it('.not(Selector): JQ', function() {
    // $().not('.haha')
    let $ret = $('#test div').not('.haha');
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'a');
    chai.assert.equal($ret[1].innerHTML, 'd');

    // $().not($('.haha'))
    $ret = $('#test div').not($('.haha'));
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'a');
    chai.assert.equal($ret[1].innerHTML, 'd');

    // $().not(element)
    $ret = $('#test div').not($('.haha').get(0));
    chai.assert.lengthOf($ret, 3);
    chai.assert.equal($ret[0].innerHTML, 'a');
    chai.assert.equal($ret[1].innerHTML, 'c');
    chai.assert.equal($ret[2].innerHTML, 'd');
  });

  it('.not(callback): JQ', function() {
    // $().not(function (index) {})
    let $ret = $('#test div').not(function(index) {
      return index === 0 || index === 3;
    });
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'b');
    chai.assert.equal($ret[1].innerHTML, 'c');

    // $().not(function (index, element) {})
    $ret = $('#test div').not(function(index, element) {
      if (index === 0) {
        return true;
      }

      return (element as HTMLElement).innerHTML === 'd';
    });
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'b');
    chai.assert.equal($ret[1].innerHTML, 'c');
  });
});

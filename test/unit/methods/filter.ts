import $ from '../../../es/$';
import '../../../es/methods/filter';

describe('.filter()', function() {
  beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div class="haha">b</div>
<div class="haha">c</div>
<div>d</div>
    `);
  });

  it('.filter(JQSelector): JQ', function() {
    // $().filter('.haha')
    let $ret = $('#test div').filter('.haha');
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'b');
    chai.assert.equal($ret[1].innerHTML, 'c');

    // $().filter($('.haha'))
    $ret = $('#test div').filter($('.haha'));
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'b');
    chai.assert.equal($ret[1].innerHTML, 'c');

    // $().filter(element)
    $ret = $('#test div').filter($('.haha').get(0));
    chai.assert.lengthOf($ret, 1);
    chai.assert.equal($ret[0].innerHTML, 'b');
  });

  it('.filter(callback): JQ', function() {
    // $().filter(function (index) {})
    let $ret = $('#test div').filter(function(index) {
      return index === 0 || index === 3;
    });
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'a');
    chai.assert.equal($ret[1].innerHTML, 'd');

    // $().filter(function (index, element) {})
    $ret = $('#test div').filter(function(index, element) {
      if (index === 0) return false;
      if (this.innerHTML === 'c') return true; // this 指向 element

      return element.innerHTML === 'd';
    });
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'c');
    chai.assert.equal($ret[1].innerHTML, 'd');
  });
});

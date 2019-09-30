import $ from '../../../es/$';
import '../../../es/methods/eq';
import '../../../es/methods/html';
import '../../../es/methods/slice';

describe('.slice()', function() {
  beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
    `);
  });

  it('.slice(start: number, end?: number): JQ', function() {
    // $().slice(start)
    let $ret = $('#test div').slice(2);
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret.eq(0).html(), 'c');
    chai.assert.equal($ret.eq(1).html(), 'd');

    // $().slice(start, end)
    $ret = $('#test div').slice(1, 3);
    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret.eq(0).html(), 'b');
    chai.assert.equal($ret.eq(1).html(), 'c');
  });
});

import $ from '../../../es/$';
import '../../../es/methods/get';
import '../../../es/methods/html';

describe('.get()', function() {
  this.beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
    `);
  });

  it('.get(index: number): JQElement', function() {
    const ret = $('#test div').get(1);
    chai.assert.equal(ret.innerHTML, 'b');
  });

  it('.get(): JQElement[]', function() {
    const ret = $('#test div').get();
    chai.assert.isArray(ret);
    chai.assert.lengthOf(ret, 4);
    chai.assert.equal(ret[2].innerHTML, 'c');
  });
});

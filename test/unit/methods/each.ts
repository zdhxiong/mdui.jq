import $ from '../../../es/$';
import '../../../es/methods/each';
import '../../../es/methods/html';

describe('.each()', function() {
  beforeEach(function() {
    $('#test').html('<div>a</div><div>b</div><div>c</div><div>d</div>');
  });

  it('.each(callback): JQ', function() {
    const thiss: string[] = [];
    const keys: number[] = [];
    const values: string[] = [];
    const ret = $('#test div').each(function(i, item) {
      thiss.push(this.innerHTML);
      keys.push(i);
      values.push(item.innerHTML);
    });

    chai.assert.lengthOf(ret, 4);
    chai.assert.sameOrderedMembers(thiss, ['a', 'b', 'c', 'd']);
    chai.assert.sameOrderedMembers(keys, [0, 1, 2, 3]);
    chai.assert.sameOrderedMembers(values, ['a', 'b', 'c', 'd']);
  });
});

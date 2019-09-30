import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/map';

describe('.map()', function() {
  beforeEach(function() {
    $('#test').html(`
<div>a</div>
<div>b</div>
<div>c</div>
<div>d</div>
    `);
  });

  it('.map(callback): JQ', function() {
    const _thiss: string[] = [];
    const ids: number[] = [];
    const items: string[] = [];

    const $ret = $('#test div').map(function(i, item) {
      _thiss.push(this.innerHTML);
      ids.push(i);
      items.push(item.innerHTML);

      // null 和 undefined 会被过滤
      if (i === 1) return null;
      if (i === 2) return undefined;

      return item;
    });

    chai.assert.lengthOf($ret, 2);
    chai.assert.equal($ret[0].innerHTML, 'a');
    chai.assert.equal($ret[1].innerHTML, 'd');
    chai.assert.sameOrderedMembers(_thiss, ['a', 'b', 'c', 'd']);
    chai.assert.sameOrderedMembers(ids, [0, 1, 2, 3]);
    chai.assert.sameOrderedMembers(items, ['a', 'b', 'c', 'd']);
  });
});

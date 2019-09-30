import $ from '../../jq_or_jquery';

describe('$.merge', function() {
  it('$.merge(array1, array2)', function() {
    const first = ['a', 'b', 'c'];
    const second = ['c', 'd', 'e'];
    const result = $.merge(first, second);

    chai.assert.sameOrderedMembers(result, ['a', 'b', 'c', 'c', 'd', 'e']);
    chai.assert.sameOrderedMembers(first, result);
    chai.assert.sameOrderedMembers(second, ['c', 'd', 'e']);
  });
});

import $ from '../../jq_or_jquery';

describe('$.unique', function() {
  it('$.unique(array1, array2)', function() {
    // 过滤数组中的重复元素
    chai.assert.sameOrderedMembers(
      $.unique([1, 2, 12, 3, 2, 1, 2, 1, 1, 1, 1]),
      [1, 2, 12, 3],
    );
  });
});

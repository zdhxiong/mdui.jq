import $ from '../../jq_or_jquery';

describe('$.param', function() {
  it('$.param(object)', function() {
    chai.assert.equal(
      $.param({ width: 1680, height: '1050' }),
      'width=1680&height=1050',
    );
    chai.assert.equal(
      $.param({
        width: 100,
        null: null,
        undefined: undefined,
        true: true,
        false: false,
      }),
      'width=100&null=&undefined=&true=true&false=false',
    );
    chai.assert.equal(
      decodeURIComponent($.param({ foo: { one: 1, two: 2 } })),
      'foo[one]=1&foo[two]=2',
    );
    chai.assert.equal(
      decodeURIComponent(
        $.param({ ids: ['a1', 'b2', 'c3'], c: { g: 23, e: [567] }, a: 3 }),
      ),
      'ids[]=a1&ids[]=b2&ids[]=c3&c[g]=23&c[e][]=567&a=3',
    );
    chai.assert.equal(
      decodeURIComponent($.param({ ids: [1, 2, 3] })),
      'ids[]=1&ids[]=2&ids[]=3',
    );
    chai.assert.equal(
      decodeURIComponent($.param({ a: 'a+b', b: 'b c' })),
      'a=a+b&b=b c',
    );
  });
});
//# sourceMappingURL=param.js.map

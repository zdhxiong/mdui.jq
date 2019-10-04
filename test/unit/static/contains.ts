import $ from '../../jq_or_jquery';

describe('$.contains', function() {
  beforeEach(function() {
    $('#test').html('<div id="child"></div>');
  });

  it('$.contains(parent, child)', function() {
    chai.assert.isTrue($.contains(document.documentElement, document.body));
    chai.assert.isFalse($.contains(document.body, document.documentElement));
    chai.assert.isFalse(
      $.contains(
        document.getElementById('test') as HTMLElement,
        document.documentElement,
      ),
    );
    chai.assert.isTrue(
      $.contains(
        document.getElementById('test') as HTMLElement,
        document.getElementById('child') as HTMLElement,
      ),
    );
    chai.assert.isFalse(
      $.contains(
        document.getElementById('child') as HTMLElement,
        document.getElementById('test') as HTMLElement,
      ),
    );
  });
});

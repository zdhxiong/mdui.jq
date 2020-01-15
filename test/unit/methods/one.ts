import $ from '../../jq_or_jquery';

// @ts-ignore
const isJquery = typeof jQuery !== 'undefined';

let eventCount = 0;
const callback = function(): void {
  eventCount++;
};
const callback2 = function(): void {
  eventCount = eventCount + 2;
};

describe('.one()', function() {
  beforeEach(function() {
    // 每次都移除元素，并重新创建，确保原有事件全部移除
    $('#test').html('<div id="inner"><button id="button"></button></div>');
  });

  it('.one(type, fn)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.one('click', function() {
      // this 指向触发事件的元素
      chai.assert.deepEqual($inner[0], this);
      eventCount++;
    });
    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);
    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);
  });

  it('.one(muliple_type, fn)', function() {
    const $inner = $('#inner');
    eventCount = 0;

    $inner.one('click input customEvent', callback);

    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);
    $inner.trigger('click');
    chai.assert.equal(eventCount, 1);

    $inner.off('input');
    $inner.trigger('input');
    chai.assert.equal(eventCount, 1);

    $inner.trigger('customEvent');
    chai.assert.equal(eventCount, 2);
    $inner.trigger('customEvent');
    chai.assert.equal(eventCount, 2);
  });
});

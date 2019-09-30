import $ from '../../jq_or_jquery';

describe('.add()', function() {
  beforeEach(function() {
    $('#test').html(`
<ul>
  <li>list item 1</li>
  <li>list item 2</li>
</ul>
<p>a paragraph</p>
<div id="other-paragraph">other paragraph</div>
<span>inline text</span>
`);
  });

  it('.add(selector)', function() {
    let $selected = $('#test li')
      .add('#test p') // CSS 选择器
      .add(document.getElementById('other-paragraph')) // HTMLElement
      .add($('#test span')) // JQ 对象
      .add('<label>test</label>') // HTML 字符串
      .css('background-color', 'red');

    chai.assert.lengthOf($selected, 6);
    chai.assert.instanceOf($selected[0], HTMLLIElement);
    chai.assert.instanceOf($selected[1], HTMLLIElement);
    chai.assert.instanceOf($selected[2], HTMLParagraphElement);
    chai.assert.instanceOf($selected[3], HTMLDivElement);
    chai.assert.instanceOf($selected[4], HTMLSpanElement);
    chai.assert.instanceOf($selected[5], HTMLLabelElement);

    $selected.each(function() {
      chai.assert.equal(this.style.backgroundColor, 'red');
    });

    // 同一个元素不重复添加
    $selected = $selected.add('#test p').add('#test p');
    chai.assert.lengthOf($selected, 6);
  });
});

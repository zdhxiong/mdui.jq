import $ from '../../jq_or_jquery';

describe('.serialize()', function() {
  beforeEach(function() {
    $('#test').html(`
<form id="form">
  <div>
    <input type="text" name="text" value="text"/>
    <input type="number" name="number" value="123"/>
    <input type="hidden" name="hidden" value="hide"/>
    <input type="checkbox" name="checkbox" value="checkbox1" checked/>
  </div>
  <input type="checkbox" name="checkbox" value="checkbox2" checked/>
  <input type="checkbox" name="checkbox" value="checkbox3"/>
  <input type="radio" name="radio" value="radio1" checked/>
  <input type="radio" name="radio" value="radio2"/>
  <input type="text" name="disabled" value="disabled" disabled/>
  <input type="button" name="button" value="button"/>
  <input type="reset" name="reset" value="reset"/>
  <input type="submit" name="reset" value="submit"/>
</form>
    `);
  });

  it('.serialize(): string', function() {
    const value = $('#form').serialize();
    chai.assert.equal(
      value,
      'text=text&number=123&hidden=hide&checkbox=checkbox1&checkbox=checkbox2&radio=radio1',
    );
  });
});

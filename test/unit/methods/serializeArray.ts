import $ from '../../../es/$';
import '../../../es/methods/html';
import '../../../es/methods/serializeArray';

describe('.serializeArray()', function() {
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

  it('.serializeArray(): {name: string, value: string}[]', function() {
    const value = $('#form').serializeArray();

    chai.assert.lengthOf(value, 6);
    chai.assert.deepEqual(value[0], { name: 'text', value: 'text' });
    chai.assert.deepEqual(value[1], { name: 'number', value: '123' });
    chai.assert.deepEqual(value[2], { name: 'hidden', value: 'hide' });
    chai.assert.deepEqual(value[3], { name: 'checkbox', value: 'checkbox1' });
    chai.assert.deepEqual(value[4], { name: 'checkbox', value: 'checkbox2' });
    chai.assert.deepEqual(value[5], { name: 'radio', value: 'radio1' });
  });
});

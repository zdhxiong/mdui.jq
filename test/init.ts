import $ from '../es/$';
import '../es/methods/empty';
import '../es/methods/off';
import '../es/methods/removeData';

afterEach(function() {
  $('#test')
    .empty()
    .removeData();
  // $(document).off();
  // $(document.body).off();
});

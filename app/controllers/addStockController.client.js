'use strict';

(function () {
  var formElement = document.forms['add-stock'];
  // console.dir(formElement);
  formElement.addEventListener('submit', function (e) {
    e.preventDefault();
    // console.log(formElement.elements.search.value);
    var formValue = formElement.elements.search.value;
    var url = formElement.action;
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', url, function(response) {
      console.log(response);
    }));
  });
})();
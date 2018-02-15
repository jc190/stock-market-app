'use strict';

(function () {

  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  var formElement = document.forms['add-stock'];

  formElement.addEventListener('submit', function (e) {
    e.preventDefault();

    $('.loader').addClass('active');

    var formValue = formElement.elements.search.value;
    var url = formElement.action + '?s=' + formValue;

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, function(response) {
      response = JSON.parse(response);
      if (response.error) {
        toastr.error(response.error);
      }
      if (response.ok) {
        toastr.success(response.ok);
      }
    }));
  });

})();
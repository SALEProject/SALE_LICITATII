$(document).ready(function() {
  $('#register-form').validate({

    focusInvalid: false,
    ignore: "",
    rules: {
      username: {
        minlength: 2,
        required: true
      },
      password: {
        required: true
      },
      password_repeat: {
        required: true,
        equalTo: '#password'
      },
      email: {
        required: true,
        email: true
      },
      company_name: {
        required: true
      },
      phone: {
        required: true
      },
      social_code: {
        required: true
      }
    },

    invalidHandler: function (event, validator) {
      //display error alert on form submit
    },

    errorPlacement: function (label, element) { // render error placement for each input type
      $('<span class="error"></span>').insertAfter(element).append(label)
      var parent = $(element).parent('.input-with-icon');
      parent.removeClass('success-control').addClass('error-control');
    },

    highlight: function (element) { // hightlight error inputs

    },

    unhighlight: function (element) { // revert the change done by hightlight

    },

    success: function (label, element) {
      var parent = $(element).parent('.input-with-icon');
      parent.removeClass('error-control').addClass('success-control');
    },
    submitHandler: function(form) {
      $('#register-form').css('opacity','0.3');
      form.submit();
    }
  });

});

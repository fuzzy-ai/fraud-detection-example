var lastEvalID;
var billingGeo;
var shippingGeo;
var IPGeo;
var phoneGeo;

$(function() {
  resetForm();

  var billing = document.getElementById('billing-address');
  var autocompleteBilling = new google.maps.places.Autocomplete(billing);
  autocompleteBilling.addListener('place_changed', function() {
    var place = autocompleteBilling.getPlace();
    billingGeo = place.geometry.location;
  });

  var shipping = document.getElementById('shipping-address');
  var autocompleteShipping = new google.maps.places.Autocomplete(shipping);
  autocompleteShipping.addListener('place_changed', function() {
    var place = autocompleteShipping.getPlace();
    shippingGeo = place.geometry.location;
  });

  var ip = document.getElementById('ip-address');
  var autocompleteIP = new google.maps.places.Autocomplete(ip, {types: ['(cities)']});
  autocompleteIP.addListener('place_changed', function() {
    var place = autocompleteIP.getPlace();
    IPGeo = place.geometry.location;
  });

  var phone = document.getElementById('phone-address');
  var autocompletePhone = new google.maps.places.Autocomplete(phone, {types: ['(cities)']});
  autocompletePhone.addListener('place_changed', function() {
    var place = autocompletePhone.getPlace();
    phoneGeo = place.geometry.location;
  });

  // submit handler
  $('#fraud-form').submit(function(e) {
    e.preventDefault();

    var inputs = {};

    if ($('#signup-date').val()) {
      var signup = moment($('#signup-date').val());
      var today = moment();
      inputs['userAgeInDays'] = today.diff(signup, 'days');
    }

    if (billingGeo && shippingGeo) {
      inputs['shippingDistance'] =  google.maps.geometry.spherical.computeDistanceBetween(billingGeo, shippingGeo) / 1000;
    }

    if (billingGeo && IPGeo) {
      inputs['IPDistance'] =  google.maps.geometry.spherical.computeDistanceBetween(billingGeo, IPGeo) / 1000;
    }

    if (billingGeo && phoneGeo) {
      inputs['phoneDistance'] =  google.maps.geometry.spherical.computeDistanceBetween(billingGeo, phoneGeo) / 1000;
    }

    if ($('#purchase-price').val() && $('#avg-price').val()) {
      inputs['priceDifference'] = Math.max($('#purchase-price').val() - $('#avg-price').val(), 0);
    }

    switch ($('#shipping-option').val()) {
      case 'standard':
        inputs['shippingOption'] = 1;
        break;
      case 'express':
        inputs['shippingOption'] = 10;
        break;
      case 'next_day':
      inputs['shippingOption'] = 20;
      break;
    }

    if ($('#ip-transactions').val()) {
      inputs['numberPreviousFromIP'] = parseInt($('#ip-transactions').val());
    }

    if ($('#address-transactions').val()) {
      inputs['numberPreviousShipping'] = parseInt($('#address-transactions').val());
    }

    $.ajax({
      method: "POST",
      url: "/data/evaluate",
      data: JSON.stringify(inputs),
      contentType: 'application/json',
      success: function(data) {
        lastEvalID = data.evaluation.meta.reqID;
        var likelihood = parseInt(data.evaluation.likelihood);
        $('#results-value').html(likelihood);
        $('#big-num span').html(likelihood);
        $('#results-description').show();
        $('#feedback').show();
      },
      error: function () {
        setMessage('Something went wrong.', 'error');
      }
    });
    $('html, body').animate({
      scrollTop: $(".results").offset().top
    }, 500);
  });

  $('#feedback-form').submit(function(e) {
    e.preventDefault();
    var likelihood = parseInt($('input[type=radio]:checked').val());
    if (lastEvalID) {
      var feedback = {likelihood: likelihood}
      $.ajax({
        method: "POST",
        url: "/data/feedback/" + lastEvalID,
        data: JSON.stringify(feedback),
        contentType: 'application/json',
        success: function(data) {
          setMessage('Thanks for the feedback!');
          resetForm();
        },
        error: function () {
          setMessage('Something went wrong.', 'error');
        }
      });
    }
  });
});

$(function(){
  $('#signup-date').datepicker({
    todayHighlight: true,
     orientation: "bottom left",
     format: "yyyy-mm-dd",
    container: ".bdc"
    //container: console.log($(this).datepicker())
  });
});

function resetForm() {
  $('#results-description').hide();
  $('#feedback').hide();
  lastEvalID = null;
  billingGeo = null;
  shippingGeo = null;
  IPGeo = null;
  phoneGeo = null;
}

function setMessage(message, type='success') {
  $('#messages').html('<p class="'+ type +'">'+ message + '</p>');
  $('html, body').animate({
    scrollTop: $(".results").offset().top
  }, 500);
}

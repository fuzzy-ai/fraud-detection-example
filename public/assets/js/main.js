var lastEvalID;
var billingGeo;
var shippingGeo;
var IPGeo;
var phoneGeo;

$(function() {
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


    $.ajax({
      method: "POST",
      url: "/data/evaluate",
      data: JSON.stringify(inputs),
      contentType: 'application/json',
      success: function(data) {
        console.log(data);
      }
    });
  });

});

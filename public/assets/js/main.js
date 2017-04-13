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

    var inputs = {
      userAgeInDays: 0,
      shippingDistance: 0,
      IPDistance: 0,
      phoneDistance: 0,
      priceDifference: 0,
      shippingOption: 1,
      numberPreviousFromIP: 0,
      numberPreviousShipping: 0
    };

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
    $('#messages').html('');
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
        $('.result-heading').show();
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
    if (isNaN(likelihood)) {
      setMessage('Please select an option to provide feedback.');
    } else if (lastEvalID) {
      var feedback = {likelihood: likelihood}
      $.ajax({
        method: "POST",
        url: "/data/feedback/" + lastEvalID,
        data: JSON.stringify(feedback),
        contentType: 'application/json',
        success: function(data) {
          setMessage('Thanks for the feedback!', 'success');
          resetForm();
        },
        error: function () {
          setMessage('Something went wrong.', 'error');
        }
      });
    }
  });

  $('#fill-random').on('click', function(e) {
    e.preventDefault();

    var randomBilling = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    $('#billing-address').val(randomBilling['name']);
    billingGeo = new google.maps.LatLng(randomBilling['lat'], randomBilling['lng']);

    var randomShipping = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    $('#shipping-address').val(randomShipping['name']);
    shippingGeo = new google.maps.LatLng(randomShipping['lat'], randomShipping['lng']);

    var randomIP = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    $('#ip-address').val(randomIP['name']);
    IPGeo = new google.maps.LatLng(randomIP['lat'], randomIP['lng']);

    var randomPhone = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    $('#phone-address').val(randomPhone['name']);
    phoneGeo = new google.maps.LatLng(randomPhone['lat'], randomPhone['lng']);

    var start = moment('2016-01-01');
    var randomDate = moment(start + Math.random() * (moment() - start ));
    $('#signup-date').val(randomDate.format('YYYY-MM-DD'));
    $('#avg-price').val((Math.random() * 100).toFixed(2));
    $('#purchase-price').val((Math.random() * 100).toFixed(2));
    $('#ip-transactions').val(Math.floor(Math.random() * 20));
    $('#address-transactions').val(Math.floor(Math.random() * 20));

  });

  $('#signup-date').datepicker({
    todayHighlight: true,
    orientation: "bottom left",
    format: "yyyy-mm-dd",
    container: ".fuzzy-cal"
  });

  var fillRandom = document.querySelector('#fill-random');

  fillRandom.addEventListener('click', function(){
    $('html, body').animate({
      scrollTop: $("#submit-btn").offset().top
    }, 1500);
  })


});

function resetForm() {
  $('#results-description').hide();
  $('#feedback').hide();
  $('.result-heading').hide();
  lastEvalID = null;
}

function setMessage(message, type) {
  $('#messages').html('<p class="'+ type +'">'+ message + '</p>');
  $('html, body').animate({
    scrollTop: $(".results").offset().top
  }, 500);
}

var randomLocations = [
  {name: 'Toronto, ON, Canada', lat: 43.653226, lng: -79.3831843},
  {name: 'Montreal, QC, Canada', lat: 45.5016889, lng: -73.567256},
  {name: 'San Francisco, CA, USA', lat: 37.7749295, lng: -122.4194155},
  {name: 'New York, NY, USA', lat: 40.7127837, lng: -74.0059413},
  {name: 'Paris, France', lat: 48.856614, lng: 2.3522219},
  {name: 'Beijing, China', lat: 39.904211, lng: 116.407395}
];

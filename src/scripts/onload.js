$( document ).ready(function() {

  /* var eventList = $.parseJSON($.ajax({
    url:  'https://stn.wim.usgs.gov/STNServices/Events.json',
    dataType: "json",
    async: false
  }).responseText);
  
  var eventFiles = $.parseJSON($.ajax({
    url:  'https://stn.wim.usgs.gov/STNServices/Events.json',
    dataType: "json",
    async: false
  }).responseText);

  var eventFiles = $.parseJSON($.ajax({
    url:  'https://stn.wim.usgs.gov/STNServices/Events.json',
    dataType: "json",
    async: false
  }).responseText); */
  
  $( "#test" ).on( "click", function() {
    $.getJSON('https://stn.wim.usgs.gov/STNServices/Events.json', function(evt) {
      var eventList = evt[0].event_name;
  
      /* $.each( evt, function( event_name, val ) {
        items.push( "<li id='" + key + "'>" + val + "</li>" );
      });
      $( "<ul/>", {
        "class": "grid-item",
        html: items.join( "" )
      }).appendTo( "#test" ); */
    });
  });
});



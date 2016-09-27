//get data
$(document).ready(function() {

  var $body = $('body');







  
  $('#username').text(app.getQueryVariable('username'));
  app.init();
  app.refresh();
  // setInterval(app.refresh, 5000);
});




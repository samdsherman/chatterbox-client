//get data
$(document).ready(function() {
  $('#username').text(app.getQueryVariable('username'));



  app.refresh();
  setInterval(app.refresh, 5000);





});
// console.log(data)
  //diplay the data
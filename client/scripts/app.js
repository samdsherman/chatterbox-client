// https://api.parse.com/1/classes/messages

//get data from app.server
var data;
var app = {};

//app properties/////////////////////////////////////////////////////

app.server = 'https://api.parse.com/1/classes/messages';

//app functions//////////////////////////////////////////////////////
app.fetchSuccess = function fetchSuccess(data) {
  var messages = data.responseJSON.results;
  console.log(messages);
  messages.forEach(function(message) {
    app.renderMessage(message);
  });
};

app.init = function init() {
  $('.username').on('click', app.handleUsernameClick);
  $('#send').submit( app.handleSubmit );
  console.log( $('form') );
};

app.send = function send(data) {
  data = JSON.stringify(data);
  $.ajax({
    type: 'POST',
    url: app.server,
    data: data,
    complete: app.success,
    dataType: 'JSON'
  });
};

app.fetch = function fetch() {
  // $.get(app.server, success);
  var data = $.ajax({
    type: 'GET',
    url: app.server,
    complete: app.fetchSuccess
  });
  return data;
};

app.clearMessages = function clearMessages() {
  $('#chats').empty();
};

app.renderMessage = function renderMessage(message) {

  var $newMessage = $(
    `<div class="message">
      <span class="username"></span>

      <span class="text"></span>
     </div>`);
  $newMessage.find('.username').text(message.username);
  $newMessage.find('.text').text(message.text);

  $('#chats').append($newMessage);
};

app.renderRoom = function renderRoom(roomName) {
  var newRoom = $('<div class="room"></div>');
  newRoom.text(roomName);
  $('#roomSelect').append(newRoom);
};

app.handleUsernameClick = function handleUsernameClick() {

};

app.handleSubmit = function handleSubmit(event) {
  console.log('got into handleSubmit');
  // event.preventDefault();
  var obj = {
    text: $('#message').val(),
    username: app.getQueryVariable('username')
  };
  console.log(obj);
  app.send(obj);

};

app.getQueryVariable = function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
};
























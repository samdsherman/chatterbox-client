// https://api.parse.com/1/classes/messages
console.log('page refreshed');
//get data from app.server
var data;
var app = {};

//app properties/////////////////////////////////////////////////////

app.server = 'https://api.parse.com/1/classes/messages';
app.room = 'lobby';
app.roomNames = {};
app.friends = {};

//app functions//////////////////////////////////////////////////////
app.fetchSuccess = function fetchSuccess(data) {
  var messages = data.responseJSON.results;
  messages.forEach(function(message) {
    app.renderMessage(message);
    //look at message.roomname
    app.renderRoom(message.roomname);
      //update rooms
  });
};

app.init = function init() {
  $('body').on('click', '.username', app.handleUsernameClick);
  $('body').on('submit', '#send', app.handleSubmit );
  $('body').on('change', '.roomDropDown', app.roomChange);
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

app.fetch = function fetch(handler) {
  // $.get(app.server, success);
  var data = $.ajax({
    type: 'GET',
    url: app.server,
    complete: handler || app.fetchSuccess
  });
  return data;
};

app.clearMessages = function clearMessages() {
  $('#chats').empty();
};

app.renderMessage = function renderMessage(message) {

  var $newMessage = $(
    `<div class="chat">
      <span class="username"></span>

      <span class="text"></span>
     </div>`);
  $newMessage.find('.username').text(message.username);
  $newMessage.find('.text').text(message.text);

  $('#chats').append($newMessage);
};

app.renderRoom = function renderRoom(roomName) {
  if ( app.roomNames[roomName] ) {
    return;
  }
  app.roomNames[roomName] = 1;
  var newRoom = $('<option></option>').attr('value', roomName);
  newRoom.text(roomName).attr('selected', 'selected');
  $('#roomSelect').find('.roomDropDown').append(newRoom);
};

app.handleUsernameClick = function handleUsernameClick() {
  var $this = $(this);
  var username = $this.text();
  app.friends[username] = !app.friends[username];
  
  app.highlightFriends();
};

app.roomChange = function roomChange() {
  app.room = $('#roomSelect').find('.roomDropDown').val();
  console.log(app.room);
  if (app.room === 'newroom') {
    app.room = window.prompt('New room name', 'Enter new room name');

    app.renderRoom(app.room);
  }

  app.clearMessages();
  if (app.room === 'lobby') {
    app.fetch();
  } else {
    app.fetch(app.roomChangeFetchHandler);
  }
};

app.roomChangeFetchHandler = function(data) {
  var messages = data.responseJSON.results;
  messages.forEach(function(message) {
    if (message.roomname === app.room) {
      app.renderMessage(message);
    }
  });
};

app.handleSubmit = function handleSubmit(event) {
  // console.log('got into handleSubmit');
  // event.preventDefault();
  var obj = {
    text: $('#message').val(),
    username: app.getQueryVariable('username'),
    roomname: app.room
  };
  console.log(obj);
  app.send(obj);
  app.refresh();
  return false;

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

app.refresh = function refresh() {
  app.clearMessages();
  if (app.room === 'lobby') {
    app.fetch();
  } else {
    app.fetch(app.roomChangeFetchHandler);
  }
};

app.highlightFriends = function highlightFriends() {
  var messages = $('.chat');
  messages.each(function(index) {
    var element = $(messages[index]);
    var username = element.find('.username').text();
    if (app.friends[username]) {
      element.addClass('friend');
    } else {
      element.removeClass('friend');
    }

  });
};























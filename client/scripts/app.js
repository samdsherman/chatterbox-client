// https://api.parse.com/1/classes/messages
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
  });
  app.highlightFriends();
};

app.init = function init() {
  $('body').on('click', '.username', app.handleUsernameClick);
  $('body').on('submit', '#send', app.handleSubmit );
  $('body').on('change', '#roomSelect', app.roomChange);
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


app.handleUsernameClick = function handleUsernameClick() {
  var $this = $(this);
  var username = $this.text();
  app.friends[username] = !app.friends[username];
  app.highlightFriends();
};

app.renderRoom = function renderRoom(roomName, setDefault) {
  if ( app.roomNames[roomName] ) {
    // $('#roomSelect').filter(function() {
    //   return $(this).val() === roomName;
    // }).attr('selected', 'selected');
    return;
  }

  app.roomNames[roomName] = 1;
  var newRoom = $('<option></option>').attr('value', roomName);
  newRoom.text(roomName);
  //Will set the room you chose as the default if it existed
  if (setDefault) { newRoom.attr('selected', 'selected'); }

  $('#roomSelect').append(newRoom);
};

app.roomChange = function roomChange() {
  app.room = $('#roomSelect').find('#roomSelect').val();
  if (app.room === 'newroom') {
    app.room = window.prompt('New room name', 'Enter new room name');
    app.renderRoom(app.room, true);
  }

  app.clearMessages();
  if (app.room === 'lobby') {
    app.fetch();
  } else {
    app.fetch(app.roomChangeFetchHandler);
  }
  //selects the room you want as default
  $('#roomSelect').filter(function() {
    return $(this).val() === app.room;
  }).attr('selected', 'selected');


  app.highlightFriends();

};

app.roomChangeFetchHandler = function(data) {
  var messages = data.responseJSON.results;
  messages.forEach(function(message) {
    if (message.roomname === app.room) {
      app.renderMessage(message);
    }
  });
  app.highlightFriends();

};

app.handleSubmit = function handleSubmit(event) {
  // console.log('got into handleSubmit');
  // event.preventDefault();
  var obj = {
    text: $('#message').val(),
    username: app.getQueryVariable('username'),
    roomname: app.room
  };
  app.send(obj);
  app.refresh();
  $( '#send' ).each(function() {
    this.reset();
  });
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























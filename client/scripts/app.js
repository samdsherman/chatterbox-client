// https://api.parse.com/1/classes/messages
//get data from app.server
var data;
var app = {};

//app properties/////////////////////////////////////////////////////

app.server = 'https://api.parse.com/1/classes/messages';
app.room = 'default';
app.roomNames = {};
app.friends = {};

//app functions//////////////////////////////////////////////////////
app.fetchSuccess = function fetchSuccess(data, urlParameter) {
  var messages = data.responseJSON.results;
  // if (urlParameter) {
  //   for (var i = messages.length - 1; i >= 0; i--) {
  //     app.renderMessage(messages[i]);
  //     app.renderRoom(messages[i].roomname);
  //   }
  // } else {
  messages.forEach(function(message) {
    app.renderMessage(message);
    //look at message.roomname
    app.renderRoom(message.roomname);
  }); 
  // }
  app.highlightFriends();
};

app.init = function init() {
  $('body').on('click', '.panel-heading', app.handleUsernameClick);
  $('body').on('submit', '#send', app.handleSubmit );
  $('body').on('change', '#roomSelect', app.roomChange);
  $('body').on('click', '#refreshButton', app.refresh);
  $('body').on('click', '.nav-tabs', function(event) {
    $(this).tab('show');
  });
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

app.fetch = function fetch(urlParameter) {
  // $.get(app.server, success);


  var data = $.ajax({
    type: 'GET',
    url: app.server + (urlParameter || ''),
    complete: function(data) { app.fetchSuccess(data, urlParameter); }
  });
  return data;
};

app.clearMessages = function clearMessages() {
  $('#chats').empty();
};

app.handleUsernameClick = function handleUsernameClick() {
  var $this = $(this).find('.username');
  var username = $this.text();
  app.friends[username] = !app.friends[username];
  app.highlightFriends();
};

app.renderMessage = function renderMessage(message) {

  var $newMessage = $(
    `<div class="chat panel panel-info">
      <div class="panel-heading">
        <span class="at">@</span>
        <h3 class="username panel-title"></h3>
      </div>
      <div class="text panel-body"></div>
      <div class="panel-footer"></div>
     </div>`);
  $newMessage.find('.panel-footer').text(app.formatTime(message.createdAt));
  $newMessage.find('.username').text(message.username);
  $newMessage.find('.text').text(message.text);

  $('#chats').append($newMessage);
};

app.renderRoom = function renderRoom(roomName, setDefault) {
  console.log(roomName);
  if ( app.roomNames[roomName] ) {
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
  app.room = $('#roomSelect').val();
  if (app.room === 'newroom') {
    app.room = window.prompt('New room name', 'Enter new room name');
    app.renderRoom(app.room, true);
  }
  app.addTab();

  app.clearMessages();
  var urlParameter = app.getRoomParameter();
  console.log(urlParameter);

  app.fetch( urlParameter );
  //selects the room you want as default
  $('#roomSelect').filter(function() {
    return $(this).val() === app.room;
  }).attr('selected', 'selected');
  app.highlightFriends();
};

app.addTab = function addTab() {
  var newTab = $('<li role="presentation"><a role="tab" data-toggle="tab"></a></li>')
                .attr('href', '#' + app.room);
  newTab.find('a').text(app.room);
  $('.nav-tabs').append(newTab);
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
  var param = app.getRoomParameter();
  console.log(param);
  app.fetch(param);
};

app.getRoomParameter = function getRoomParameter() {
  return app.room !== 'default' ? '?order=-createdAt&where={"roomname":"' + app.room + '"}'
                                : '?order=-createdAt';
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


app.formatTime = function formatTime(timeString) {
  var result = '';
  var [date, time] = timeString.split('T');
  var [year, month, day] = date.split('-');
  var [hour, minute, second] = time.split(':');

  result += app.monthToString(month);
  result += ' ';
  result += day;
  result += ', ';
  result += app.militaryHourTo12(hour, minute);

  return result;
};

app.monthToString = function monthToString(monthVal) {
  var months = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  };
  return months[monthVal];
};

app.militaryHourTo12 = function militaryHourTo12(hour, minutes) {
  var suffix = 'am';
  if (+hour >= 12) {
    suffix = 'pm';
    hour = +hour - 12;
  }
  return hour + ':' + minutes + suffix;
};




















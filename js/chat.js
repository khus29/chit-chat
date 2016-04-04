var server = io.connect("http://localhost:8080");

server.on('messages', function(data) {
	insertMessage(data);
	scrollToBottom();
});
server.on('user', function(data) {
	insertUsers(data);
});
server.on('connectUser', function(user) {
	 $("#chats").append("<div class='connected-user'>"+user+" is connected..</div>");
	 scrollToBottom();
});

server.on('connect', function() {
	$('.info').html('<i>You are connected to Chat-room</i>');
	var nickname = prompt("What is your nickname?");
	if(nickname.trim() == "") {
		nickname = "unknown";
	}
	server.emit('join', nickname);

});

$("#chat-form").submit(function(event) {
	event.preventDefault();
	var message = $("#chat").val();
	if(message.trim().length > 0) {
		server.emit('messages', message);
		//server.emit('private message',message);
		$("#chat").val("");
	}
});

var insertMessage = function(data) {
	 if(($("#chats").find("ul").length > 0) && $("#chats ul").is(":last-child")) {
	 	var ObjUl =  $("#chats ul").last();
	 } else {
	 	var ObjUl = $('<ul></ul>');
	 }
	 
	 var Objli = $('<li></li>');
	 Objli.html(data);
	 ObjUl.append(Objli);
	 $("#chats").append(ObjUl);
};

var insertUsers = function(user) {
	 var displayName = true;
	 if($( ".user-active" ).length > 0) {
	 	 $( ".user-active" ).each(function( index ) {
		 	if($( this ).text() === user.trim()) {
				displayName = false;
				return false;
			 }
		 });
	 }
 	if(displayName) {
		 var userElem = "<div class='user-active'><i class='glyphicon glyphicon-user'></i>"+user+"</div>"
		 $("#users").append(userElem);
	 }
};

var scrollToBottom = function() {
	var chatelem = $('.chat-div');
    var height = chatelem[0].scrollHeight;
    chatelem.scrollTop(height);
};
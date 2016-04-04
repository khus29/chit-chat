var express = require("express");
//var socket = require("socket.io");
var request = require("request");
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io")(server);
var totalMessages = [];
var totalUsers = [];
//private message
var clients = {};
var users = {};

//Function to store messages. Max size - 15
var storeMessage = function(name, data) {
	totalMessages.push({name: name, data: data});
	if(totalMessages.length > 15) {
		totalMessages.shift();
	}
};
//When connection is established
io.on('connection', function(client) {
	console.log("Connected ..");
	client.on('messages', function(data) {
		var message = "<strong>"+client.nickname+"</strong>: "+data;
		storeMessage(client.nickname, data);
		client.broadcast.emit('messages', message);
		client.emit('messages', message);
	});
	//Event when user joins chat room
	client.on('join', function(name) {
		client.nickname = name;
		//To new user show all the messages stored in array.
		totalMessages.forEach(function(message) {
			client.emit('messages', "<strong>"+message.name+"</strong>: "+message.data);
		});
		console.log("User "+name+" has joined..");
		//Update users list for other users
		client.broadcast.emit('user', name);

		totalUsers.push(name);
		//Show updated user list to the new user
		totalUsers.forEach(function(userName) {
			client.emit('user', userName);
		});
		//Show new user connection message event to other users
		client.broadcast.emit('connectUser', name);

		
	});

   
});
app.get('/', function(req, res) {
	res.sendFile(__dirname +'/index.html');
});
app.use(express.static(__dirname));

server.listen(8080);
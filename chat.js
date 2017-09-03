var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
	fs.readFile(__dirname + '/chat.html', (err, data) => 
	{
		if(err) {
			res.writeHead(500);
			return res.end('Error loading chat.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}

io.sockets.on('connection', (socket) => {
	socket.on('addme', (username) => {
		socket.username = username;
		socket.emit('chat', 'SERVER', username + ' is on deck');
	});

	socket.on('sendchat', (data) => {
		io.sockets.emit('chat', socket.username, data);
	});

	socket.on('disconnect', () => {
		io.sockets.emit('chat', 'SERVER', socket.username + 'has left the building');
	});
});
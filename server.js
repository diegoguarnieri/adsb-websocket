//websocket
const WebSocket = require('ws')
const port = 2020
const wss = new WebSocket.Server({ port: port })

console.log('Server started on port: ' + port)

/*setInterval(function() {
	wss.broadcast((new Date()) + ': ' + makeid(5))
}, 2000)*/

wss.on('connection', (ws, request) => {
	console.log('New connection from -> ' + request.connection.remoteAddress)

	ws.on('message', message => {
		console.log('Received message -> ' + message)
	})

	ws.on('close', conn => {
		//console.log(conn)

		/*wss.clients.forEach((socket) => {
			console.log(socket)

			//if([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
			//	socket.terminate();
			//}
		})*/

		/*wss.clients.forEach(function each(client) {
			console.log(client)
		})*/
	})

	//ws.send('Hello! Message From Server!!')

	/*setTimeout(function() {
		ws.send('Message From Server 2')
	}, 3000)*/
	
})

wss.broadcast = function broadcast(message) {
	//console.log(message)

	wss.clients.forEach(function each(client) {
		client.send(message)
	})
}

//http server
const http = require('http')

http.createServer((request, response) => {
	const { headers, method, url } = request

	let body = [];
	request.on('error', error => {
		console.log(error)
	})
	.on('data', (chunk) => {
		body.push(chunk)
	})
	.on('end', () => {
		body = Buffer.concat(body).toString();

		console.log("method: " + method);
		console.log("url: " + url);
		console.log("headers:");
		console.log(headers);
		console.log("body: " + body);

		//broadcast
		wss.broadcast(body)

		response.writeHead(200, {"Content-Type": "application/json"});
		response.write('{"return": "success"}');
		response.end();
	})

}).listen(9090, function() {
	console.log('Server started on port: 9090')
})
//http server

function makeid(length) {
	var result = ''
	//var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	var charactersLength = characters.length

	for(var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result
}
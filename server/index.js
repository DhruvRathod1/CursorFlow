const http = require('http');
const { WebSocketServer } = require('ws')
require('dotenv').config();

const port = process.env.PORT;
const url = require('url');
const server = http.createServer()
const wsServer = new WebSocketServer({ server })

wsServer.on("connection", (connection, request) => {
    // first of all we need to initilaize server protocol ws or wss just like htttp and https 
    //ws://localhost:8000

    // connection.send("message")

    const { username } = url.parse(request.url, true).query
    console.log(username)

})
server.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
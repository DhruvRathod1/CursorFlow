const http = require('http');
const { WebSocketServer } = require('ws')
require('dotenv').config();
const uuidv4 = require("uuid").v4

const port = process.env.PORT;
const url = require('url');
const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const connections = {}
const users = {}

const broadcastUsers = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid]
        const message = JSON.stringify(users)
        connection.send(message)
    })
}

const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]
    user.state = message

    broadcastUsers()

    console.log(`${user.username} updated their state: ${JSON.stringify(user.state)}`)

}
const handleClose = (uuid) => {

    console.log(`${users[uuid].username} disconnected`)
    delete connections[uuid]
    delete users[uuid]

    broadcastUsers()
}
wsServer.on("connection", (connection, request) => {
    // first of all we need to initilaize server protocol ws or wss just like htttp and https 
    //ws://localhost:8000

    // connection.send("message")

    const { username } = url.parse(request.url, true).query
    const uuid = uuidv4();
    console.log(username)
    console.log(uuid)

    //be=roadcast
    connections[uuid] = connection

    users[uuid] = {
        username,
        state: {
        }
    }

    connection.on("message", message => handleMessage(message, uuid))
    connection.on("close", () => handleClose(uuid))



})
server.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
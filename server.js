const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

lines = [];

// Use client folder. Automatically uses index.html
app.use(express.static(__dirname + '/client'));

// Whenever a client connects
io.on('connection', socket => {
    console.log(`ID: ${socket.id} has joined.`);

    // Push all lines to new connections so lines are persistent (only on initial connection)
    for (l of lines) {
        socket.emit("line", l);
    }

    // When client disconnects
    socket.on('disconnect', () => { /* … */ });

    // When client draws a line
    socket.on('line', line => {
        socket.broadcast.emit('line', line);
        lines.push(line);
        // console.log(line);
    })
});
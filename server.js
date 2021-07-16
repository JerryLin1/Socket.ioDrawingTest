const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;

lines = [];
app.use(express.static(__dirname + '/client'));
io.on('connection', socket => {
    console.log(`ID: ${socket.id} has joined.`);
    for (l of lines) {
        io.to(socket.id).emit("line", l);
    }

    socket.on('disconnect', () => { /* … */ });
    socket.on('line', line => {
        io.emit('line', line);
        lines.push(line);
        // console.log(line);
    })
});
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
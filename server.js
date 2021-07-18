const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 6567;
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

lines = [];

// Use client folder. Automatically uses index.html
app.use(express.static(__dirname + '/client'));

// Whenever a client connects
io.on('connection', socket => {
    console.log(`ID: ${socket.id} has joined.`);
    // When client disconnects
    socket.on('disconnect', () => {
        console.log(`ID: ${socket.id} has disconnected.`);
    });

    // Push all lines to new connections so lines are persistent (only on initial connection)
    for (l of lines) {
        socket.emit("line", l);
    }

    // When client draws a line
    socket.on('line', line => {
        socket.broadcast.emit('line', line);
        lines.push(line);
        // console.log(line);
    })

    // When client presses clear canvas button
    socket.on("message", msg => {
        if (msg === "clear") {
            lines = [];
            socket.broadcast.emit("message", "clear");
            console.log(`Canvas has been cleared by ${socket.id}.`);
        }
    })
});

// Print number of lines drawn
// setTimeout(cllines, 5000);
// function cllines() {
//     console.log(lines.length);
//     setTimeout(cllines, 5000);
// }
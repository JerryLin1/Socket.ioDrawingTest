socket = io();
var lastMousePos;
var linesToDraw = [];

// p5.js function that is called once at start
function setup() {
    createCanvas(800, 500);
    background(255);
    lastMousePos = createVector(mouseX, mouseY);
}

// p5.js function that constantly updates
function draw() {
    if (mouseIsPressed) {
        strokeWeight(2);
        // Draw line locally
        line(lastMousePos.x, lastMousePos.y, mouseX, mouseY);

        // Emit line to server, which will be broadcasted (emitted to all but the client that sent it)
        socket.emit("line", [lastMousePos.x, lastMousePos.y, mouseX, mouseY]);
    }
    
    // Draws all lines sent by the server. Ex. other clients' lines, or lines drawn before you connected
    for (l of linesToDraw) {
        strokeWeight(2);
        line(l[0], l[1], l[2], l[3]);
    }
    linesToDraw = [];
    lastMousePos.set(mouseX, mouseY);
}

// When receiving lines from server, push them to linesToDraw so that they will all be drawn in draw()
socket.on("line", line => {
    linesToDraw.push(line);
});

// Reload page on disconnect from server
socket.on("disconnect", () => {
    location.reload();
});
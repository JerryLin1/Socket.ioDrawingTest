socket = io();
var isDrawing = false;
var lastMousePos;
var linesToDraw = [];
function setup() {
    createCanvas(800, 500);
    background(255);
    lastMousePos = createVector(mouseX, mouseY);
}
function draw() {
    if (mouseIsPressed) {
        strokeWeight(2);
        line(lastMousePos.x, lastMousePos.y, mouseX, mouseY);
        socket.emit("line", [lastMousePos.x, lastMousePos.y, mouseX, mouseY]);
    }
    for (l of linesToDraw) {
        strokeWeight(2);
        line(l[0], l[1], l[2], l[3]);
    }
    linesToDraw = [];
    lastMousePos.set(mouseX, mouseY);
}
socket.on("line", line => {
    linesToDraw.push(line);
});
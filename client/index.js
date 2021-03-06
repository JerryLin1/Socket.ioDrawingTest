socket = io();
var linesToDraw = [];
var canvas;
var thicknessSliderLabel;
var thicknessSlider;
var colorPickerLabel;
var colorPicker;
var clearButton;
var downloadButton;

// p5.js function that is called once at start
function setup() {
    createCanvas(800, 500);
    canvas = document.getElementById("defaultCanvas0");
    background(255);
    for (let element of document.getElementsByClassName("p5Canvas")) {
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    thicknessSliderLabel = createDiv("Line thickness: ")
    thicknessSliderLabel.position(10, 10);
    thicknessSlider = createSlider(2, 50, 2, 4);
    thicknessSlider.parent(thicknessSliderLabel);

    colorPickerLabel = createDiv("Color: ")
    colorPickerLabel.position(10, 40);
    colorPicker = createColorPicker("#000000");
    colorPicker.size(200, 10);
    colorPicker.parent(colorPickerLabel);

    clearButton = createButton("Clear canvas");
    clearButton.size(100, 30)
    clearButton.position(10, 100);
    clearButton.mousePressed(() => {
        // Clear own canvas, then tell server to broadcast to other clients to clear canvas
        clearCanvas();
        socket.emit("message", "clear");
    });

    downloadButton = createButton("Save image");
    downloadButton.size(100, 30)
    downloadButton.position(10, 150);
    downloadButton.mousePressed(downloadImage);
}

// p5.js function that constantly updates
function draw() {
    let thickness = thicknessSlider.value();
    strokeWeight(thickness);

    if (mouseIsPressed) {
        let color;
        if (mouseButton === LEFT) {
            color = colorPicker.value();
        }
        else if (mouseButton === RIGHT) {
            color = 255
        }
        stroke(color)
        // Draw line locally
        line(pmouseX, pmouseY, mouseX, mouseY);

        // Emit line to server, which will be broadcasted (emitted to all but the client that sent it)
        socket.emit("line", lineStruct(pmouseX, pmouseY, mouseX, mouseY, thickness, color));
    }

    // Draws all lines sent by the server. Ex. other clients' lines, or lines drawn before you connected
    for (l of linesToDraw) {
        stroke(l.color);
        strokeWeight(l.thickness);
        line(l.x1, l.y1, l.x2, l.y2);
    }
    linesToDraw = [];
}

// When receiving lines from server, push them to linesToDraw so that they will all be drawn in draw()
socket.on("line", line => {
    linesToDraw.push(line);
});

// Reload page on disconnect from server
socket.on("disconnect", () => {
    location.reload();
});

// Clear canvas when server tells you to (which is when another client presses clear canvas button)
socket.on("message", msg => {
    if (msg === "clear") {
        clearCanvas();
    }
})

// t = line thickness (strokeWeight)
// c = color
function lineStruct(x1, y1, x2, y2, thickness, color) {
    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        thickness: thickness,
        color: color
    }
}

// p5.js function that calls whenever mouse wheel is scrolled
function mouseWheel(e) {
    // Change thickness slider whenever mouse wheel is scrolled
    // e.delta is the amount scrolled, which varies based on mouse settings
    // -Math.sign(e.delta) is direction scrolled, which we multiply by 4 (one increment of slider)
    thicknessSlider.value(thicknessSlider.value() - 4 * Math.sign(e.delta));
}

// Function called when Save Image button is pressed
function downloadImage() {
    let fileName = `${hour()}${minute()}${second()}`
    saveCanvas(fileName, "png");
}

// Function called when Clear canvas button is pressed
function clearCanvas() {
    clear();
    background(255);
}
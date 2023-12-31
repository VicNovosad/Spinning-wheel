var rotation = 0; // current rotation
var targetRotation = 0; // rotation we're animating towards
var startRotation = 0; // rotation at start of animation
var startTime; // when the animation started
var duration = 3000; // spin duration in milliseconds
var tags = []; // tag for each section

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function drawSections() {
    var numParts = document.getElementById("numParts").value;
    var canvas = document.getElementById("circleCanvas");
    var context = canvas.getContext("2d");

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    // Apply rotation
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(rotation);
    context.translate(-canvas.width / 2, -canvas.height / 2);

    // Set up some parameters
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 200;

    // Resize tags array
    while (tags.length < numParts) {
        tags.push("");
    }
    while (tags.length > numParts) {
        tags.pop();
    }

    // Draw circle and lines
    for (var i = 0; i < numParts; i++) {
        var startAngle = (i * 2 * Math.PI) / numParts;
        var endAngle = ((i + 1) * 2 * Math.PI) / numParts;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startAngle, endAngle, false);
        context.lineTo(centerX, centerY);

        // Choose color for this section
        var hue = (i * 360) / numParts;
        context.fillStyle = "hsl(" + hue + ", 100%, 50%)";
        context.fill();

        // Draw boundary for section
        context.lineWidth = 2;
        context.strokeStyle = "#000000";
        context.stroke();

        // Draw tag
        if (tags[i] !== "") {
            var midAngle = (startAngle + endAngle) / 2;
            context.save();
            context.translate(
                centerX + (Math.cos(midAngle) * radius) / 2,
                centerY + (Math.sin(midAngle) * radius) / 2
            );
            context.rotate(midAngle + Math.PI / 2);
            context.fillStyle = "#000000";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.font = "25px sans-serif"; // Set font size to 20px
            context.fillText(tags[i], 0, 0);
            context.restore();
        }
    }

    context.restore();

    // If an animation is in progress, update the rotation
    if (startTime !== undefined) {
        var progress = (Date.now() - startTime) / duration;
        if (progress >= 1) {
            // animation complete
            rotation = targetRotation;
            startTime = undefined;
        } else {
            rotation =
                startRotation +
                (targetRotation - startRotation) * easeInOutCubic(progress);
            requestAnimationFrame(drawSections);
        }
    }
}

function spin() {
    var rotations = Math.floor(Math.random() * 10) + 1; // 1 to 10 rotations
    var randomAngle = Math.random() * 2 * Math.PI; // random angle
    startRotation = rotation;
    targetRotation = rotation + rotations * 2 * Math.PI + randomAngle;
    startTime = Date.now();
    requestAnimationFrame(drawSections);
}

function canvasClick(event) {
    var canvas = document.getElementById("circleCanvas");
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left - canvas.width / 2;
    var y = event.clientY - rect.top - canvas.height / 2;
    var angle = Math.atan2(y, x);
    var numParts = document.getElementById("numParts").value; // get current number of sections

    // Adjust for rotation
    var adjustedAngle = angle - (rotation % (2 * Math.PI));
    if (adjustedAngle < 0) adjustedAngle += 2 * Math.PI;

    var section = Math.floor((adjustedAngle / (2 * Math.PI)) * numParts); // use numParts instead of tags.length
    var tag = prompt("Enter a tag for this section:");
    if (tag !== null) {
        tags[section] = tag;
        drawSections();
    }
}

// Draw initial circle
drawSections();

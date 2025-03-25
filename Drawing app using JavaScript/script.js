const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false, paths = [], redoStack = [];

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseout', stopDraw);

function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    paths.push({ color: ctx.strokeStyle, size: ctx.lineWidth, path: [{ x: e.offsetX, y: e.offsetY }] });
    redoStack = [];
}

function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    paths[paths.length - 1].path.push({ x: e.offsetX, y: e.offsetY });
}

function stopDraw() {
    drawing = false;
}

document.getElementById('colorPicker').addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
    ctx.lineWidth = e.target.value;
});

function undo() {
    if (paths.length > 0) {
        redoStack.push(paths.pop());
        redraw();
    }
}

function redo() {
    if (redoStack.length > 0) {
        paths.push(redoStack.pop());
        redraw();
    }
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let path of paths) {
        ctx.beginPath();
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.size;
        ctx.moveTo(path.path[0].x, path.path[0].y);
        for (let point of path.path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}

function clearCanvas() {
    paths = [];
    redoStack = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImage() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}

function changeBgColor(color) {
    canvas.style.backgroundColor = color;
}
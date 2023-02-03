//import './boardUtils.js';
// Square size
var ss = 100;
// Board width
var bw = 500;
// Board height
var bh = 500;
// Padding
var p = 10;

function drawGrid(ctx) {
    ctx.beginPath();
    for (var x = 0; x <= bw; x += ss) {
        ctx.moveTo(0.5 + x + p, p);
        ctx.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += ss) {
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(bw + p, 0.5 + x + p);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.strokeStyle = "red";
    ctx.rect(0.5, 0.5, 520, 520);


    ctx.stroke();
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function drawPuzzle(ctx, board, movedRockets = []) {
    // artificial wait to slow down display, until we get animation
    await delay(200);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = "18px Arial";

    board.forEach((row, y) => {
        row.forEach((square, x) => {
            if (square?.rockets?.[0]) {
                ctx.fillText("^", x*ss+50+p, y*ss+50+p);
            }
            if (square?.explosion) {
                ctx.fillText("*", x*ss+60+p, y*ss+50+p);
            }
        })
    })
}

function drawBoard() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    drawGrid(ctx);
    drawPuzzle(ctx, staticBoard);
    return ctx;
}

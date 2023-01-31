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

function drawPuzzle(ctx, board) {
    ctx.font = "18px Arial";

    board.forEach((row, y) => {
        row.forEach((rocket, x) => {
            if (rocket) {
                ctx.fillText("*", x*ss+50+p, y*ss+50+p);
            }
        })
    })
}

function drawBoard() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    drawGrid(ctx);
    drawPuzzle(ctx, staticBoard);
}

//import './boardUtils.js';
// Square size
var ss = 100.0;
// Board width
var bw = 501;
// Board height
var bh = 501;
// Padding
var p = 10;

function drawGrid(ctx) {
    ctx.beginPath();
    for (var x = 100.5; x <= bw-100; x += ss) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, bh);
    }

    for (var x = 100.5; x <= bh-100; x += ss) {
        ctx.moveTo(0, x);
        ctx.lineTo(bw, x);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
}


function drawPuzzle(ctx, board) {
    var rocketImage = new Image();
    rocketImage.src = 'static/images/rocket.png';

    rocketImage.onload = function(){
    board.forEach((row, y) => {
        row.forEach((rocket, x) => {
            if (rocket) {
                ctx.drawImage(rocketImage, x*ss+12, y*ss+12, 75, 75);
            }
        })
    })
    }
}

function drawBoard() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    drawGrid(ctx);
    drawPuzzle(ctx, staticBoard);
}

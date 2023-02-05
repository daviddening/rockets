//import './boardUtils.js';
// Square size
const boardRows = 5;
const boardColumns = 5;
// Board width
var bw = 500;
// Board height
var bh = 500;

function drawGrid(ctx, board) {
    const columns = board.length;
    const rows = board[0].length;
    const squareWidth = bw / columns;
    const squareHeight = bh / rows;

    ctx.beginPath();
    for (var x = (squareWidth + 0.5); x <= bw; x += squareWidth) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, bh);
    }

    for (var x = (squareHeight + 0.5); x <= bh; x += squareHeight) {
        ctx.moveTo(0, x);
        ctx.lineTo(bw, x);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function drawPuzzle(ctx, board, movedRockets = []) {
    // TODO temporary artificial wait to slow down display, until we get animation
    await delay(200);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = "18px Arial";

    const columns = board.length;
    const rows = board[0].length;
    const squareWidth = bw / columns;
    const squareHeight = bh / rows;
    const imageSize = (squareHeight * 0.75);
    var rocketImage = new Image();
    rocketImage.src = 'static/images/rocket.png';

    rocketImage.onload = function () {
        board.forEach((row, y) => {
            row.forEach((square, x) => {
                const rocket = square.rockets[0];
                if (rocket) {
                    ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                }
                if (square?.explosion) {
                    console.log(`explosion ${x} ${y}`);
                }
            })
        })
    }
}

function drawBoard() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    drawGrid(ctx, staticBoard);
    drawPuzzle(ctx, staticBoard);
    return ctx;
}

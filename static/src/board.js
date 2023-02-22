//import './boardUtils.js';
// Square size
const boardRows = 5;
const boardColumns = 5;
// Board width
var bw = 500;
// Board height
var bh = 500;

var rocketImage = new Image();
var explosionImage = new Image();
var board = staticBoard;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let raf;

function igniter() {
    console.log('DOMContentLoaded');
    const button = document.getElementsByClassName('igniteButton')[0];
    button.addEventListener('click', () => {
        window.cancelAnimationFrame(raf);
        resolveMove({x: 2, y: 0}, staticBoard, drawPuzzle)
    });
}

function drawGrid(board) {
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

async function drawPuzzle(updatedBoard, movedRockets = []) {
    board = updatedBoard;
    window.requestAnimationFrame(draw);
    // TODO temporary artificial wait to slow down display, until we get animation
    await delay(200);
}

async function draw() {
    ctx.font = "18px Arial";
    const columns = board.length;
    const rows = board[0].length;
    const squareWidth = bw / columns;
    const squareHeight = bh / rows;
    const imageSize = (squareHeight * 0.75);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.forEach((row, y) => {
        row.forEach((square, x) => {
            square.rockets.forEach((rocket) => {
                if (rocket) {
                    ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                }
                if (square?.explosion) {
                    ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                    console.log(`explosion ${x} ${y}`);
                }
            })
        })
    })

   raf=window.requestAnimationFrame(draw);
}

function drawBoard() {
    drawGrid(staticBoard);
    rocketImage.src = 'static/images/rocket.png';
    explosionImage.src = 'static/images/explosion.png';

    raf=window.requestAnimationFrame(draw);

    return ctx;
}

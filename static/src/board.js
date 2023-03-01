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
rocketImage.src = 'static/images/rocket.png';
explosionImage.src = 'static/images/explosion.png';

var board = staticBoard;
let boardsAndMoves = [];
let boardAndMoves = null;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let raf;

let frameCounter = 0;

function igniter() {
    console.log('DOMContentLoaded');
    const button = document.getElementsByClassName('igniteButton')[0];
    button.addEventListener('click', () => {
        window.cancelAnimationFrame(raf);
        resolveMove({ x: 2, y: 0 }, staticBoard, drawPuzzle)
    });
}

function drawGrid(board) {
    const rows = board.length;
    const columns = board[0].length;
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

async function drawPuzzle(updatedBoards) {
    boardsAndMoves = updatedBoards;
    window.requestAnimationFrame(draw);
}

async function draw() {
    var raf = requestAnimationFrame(draw);

    if (!boardAndMoves) {
        if (boardsAndMoves.length == 0) {
            window.cancelAnimationFrame(raf);
            return;
        }
        boardAndMoves = boardsAndMoves.shift();
    }

    const { board, movedRockets } = boardAndMoves;

    const columns = board.length;
    const rows = board[0].length;
    const squareWidth = bw / columns;
    const squareHeight = bh / rows;
    const imageSize = (squareHeight * 0.75);

    // Draw the grid, rockets that aren't moving and explosions
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // drawGrid(staticBoard);
    board.forEach((row, y) => {
        row.forEach((square, x) => {
            square.rockets.forEach((rocket) => {
                if (rocket && !rocket.moved) {
                    ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                }
                // if (square?.explosion) {
                //     ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                //     console.log(`explosion ${x} ${y}`);
                // }
            })
        })
    })

    // Draw the moving rockets in their new position each loop until the loop ends
    movedRockets.forEach((mover) => {
        let rocketPos_x = (mover.startPosition.x * squareWidth) + (squareWidth * 0.2);
        let rocketPos_y = (mover.startPosition.y * squareHeight) + (squareHeight * 0.2);
        if (mover.endPosition.x < mover.startPosition.x) {
            rocketPos_x -= frameCounter;
        }
        if (mover.endPosition.x > mover.startPosition.x) {
            rocketPos_x += frameCounter;
        }
        if (mover.endPosition.y < mover.startPosition.y) {
            rocketPos_y -= frameCounter;
        }
        if (mover.endPosition.y > mover.startPosition.y) {
            rocketPos_y += frameCounter;
        }
        ctx.drawImage(rocketImage, rocketPos_x, rocketPos_y, imageSize, imageSize);
    })
    frameCounter += 2;

    console.log('frameCounter', frameCounter);
    console.log('movedRockets', movedRockets);
    if (frameCounter == 100 || movedRockets.length == 0) {
        boardAndMoves = null;
        frameCounter = 0;
    }
}






function drawBoard() {
    drawGrid(staticBoard);

    boardsAndMoves = [{ board: staticBoard, movedRockets: [] }]
    rocketImage.onload = function () {
        raf = window.requestAnimationFrame(draw);
    }
    return ctx;
}

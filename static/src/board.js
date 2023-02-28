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

    ctx.font = "18px Arial";
    const { board, movedRockets } = boardAndMoves;

    const columns = board.length;
    const rows = board[0].length;
    const squareWidth = bw / columns;
    const squareHeight = bh / rows;
    const imageSize = (squareHeight * 0.75);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.forEach((row, y) => {
        row.forEach((square, x) => {
            square.rockets.forEach((rocket) => {
                if (rocket && !rocket.moved) {
                    ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                }
                if (square?.explosion) {
                    ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                    console.log(`explosion ${x} ${y}`);
                }
            })
        })
    })
    function animate() {
        var frame = window.requestAnimationFrame(animate);
        // const imageSize = (squareHeight * 0.75);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // drawGrid(staticBoard);
        movedRockets.forEach((mover) => {
            let rocketStart_x = (mover.startPosition.x * squareWidth) - (squareWidth / 2);
            let rocketStart_y = (mover.startPosition.y * squareHeight) - (squareHeight / 2);
            if (mover.endPosition.x < mover.startPosition.x) {
                if (rocketStart_x < (mover.endPosition.x * squareWidth) - (squareWidth / 2)) {
                    cancelAnimationFrame(frame);
                    return;
                }
                else {
                    rocketStart_x += -1;
                    ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
                }
            }
            if (mover.endPosition.x > mover.startPosition.x) {
                if (rocketStart_x > (mover.endPosition.x * squareWidth) - (squareWidth / 2)) {
                    cancelAnimationFrame(frame);
                    return;
                }
                else {
                    rocketStart_x++;
                    ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
                }
            }
            if (mover.endPosition.y < mover.startPosition.y) {
                if (rocketStart_y < (mover.endPosition.y * squareHeight) - (squareHeight / 2)) {
                    cancelAnimationFrame(frame);
                    return;
                }
                else {
                rocketStart_y += -1;
                ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
                }
            }
            if (mover.endPosition.y > mover.startPosition) {
                if (rocketStart_y < (mover.endPosition.y * squareHeight) - (squareHeight / 2)) {
                    cancelAnimationFrame(frame);
                    return;
                }
                else {
                rocketStart_y++;
                ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
                }
            }
        })
        board.forEach((row, y) => {
            row.forEach((square, x) => {
                square.rockets.forEach((rocket) => {
                    if (rocket && !rocket.moved) {
                        ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                    }
                    if (square?.explosion) {
                        ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                        console.log(`explosion ${x} ${y}`);
                    }
                })
            })
        })

    }
    window.requestAnimationFrame(animate);
}



function drawBoard() {
    drawGrid(staticBoard);

    boardsAndMoves = [{ board: staticBoard, movedRockets: [] }]
    rocketImage.onload = function () {
        raf = window.requestAnimationFrame(draw);
    }
    return ctx;
}

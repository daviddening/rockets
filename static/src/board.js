//import './boardUtils.js';
// Square size
const boardRows = 5;
const boardColumns = 5;
// Board width
var bw = 500;
// Board height
var bh = 500;

var unlitSheet = new Image();
var litSheet = new Image()

var rocketImage = new Image();
var explosionImage = new Image();

unlitSheet.src = 'static/images/unlit-400x100.png';
litSheet.src = 'static/images/lit-800x100.png';
rocketImage.src = 'static/images/rocket.png';
explosionImage.src = 'static/images/explosion.png';

var board = staticBoard;
let boardsAndMoves = [];
let boardAndMoves = null;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let raf;

let frameCounter = 0;
let score = 0;
let chain = 0;

function igniter() {
    console.log('DOMContentLoaded');
    const button = document.getElementsByClassName('igniteButton')[0];
    button.addEventListener('click', () => {
        window.cancelAnimationFrame(raf);
        resolveMove({ x: 2, y: 0 }, staticBoard, updateBoard)
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

async function updateBoard(updatedBoards) {
    boardsAndMoves = updatedBoards;
    window.requestAnimationFrame(draw);
}

async function showScore() {
    const scoreText = window.document.querySelector('.scoreBox > b');
    // scoreText.style.animationPlayState='paused';
    scoreText.style.animationName = 'none';
    await delay(1);
    scoreText.textContent = score
    // scoreText.style.animationPlayState='running';
    scoreText.style.animationName = 'flash';
}

async function draw() {
    var raf = requestAnimationFrame(draw);

    if (!boardAndMoves) {
        if (boardsAndMoves.length == 0) {
            chain = 0;
            window.cancelAnimationFrame(raf);
            return;
        }
        boardAndMoves = boardsAndMoves.shift();
        // count explosions
        const explosions = boardAndMoves.board.reduce((e, r) => { const exp = r.reduce((ee, c) => { return c.explosion ? ee + 1 : ee }, 0); return e + exp }, 0)
        if (explosions) {
        // increase the chain
        chain++;
        // calculate score
        score += chain*1000*explosions;
        showScore();
        }
    }

    const { board, movedRockets } = boardAndMoves;

    const columns = board.length;
    const rows = board[0].length;
    const squareWidth = bw / columns;
    const squareHeight = bh / rows;
    const imageSize = (squareHeight);

    // Draw the grid, rockets that aren't moving and explosions
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // drawGrid(staticBoard);
    // I think this loop is slowing us down. Possible?
    board.forEach((row, y) => {
        row.forEach((square, x) => {
            square.rockets.forEach((rocket) => {
                if (rocket && !rocket.moved) {
                    console.log('rocket: ', rocket);
                    if (rocket.type == 'single') {
                        if (rocket.direction == 1) {
                            ctx.drawImage(unlitSheet, 0, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                        }
                        if (rocket.direction == 2) {
                            ctx.drawImage(unlitSheet, 200, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                        }
                        if (rocket.direction == 3) {
                            ctx.drawImage(unlitSheet, 100, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                        }
                        if (rocket.direction == 4) {
                            ctx.drawImage(unlitSheet, 300, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                        }
                    }
                    if (rocket.type == 'double') {
                        if (rocket.direction == 1) {
                            ctx.drawImage(unlitSheet, 100, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                            ctx.drawImage(unlitSheet, 0, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                        }
                        if (rocket.direction == 2) {
                            ctx.drawImage(unlitSheet, 200, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                            ctx.drawImage(unlitSheet, 300, 0, 100, 100, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                        }
                    }
                }
                if (square?.explosion && frameCounter > 60) {
                    ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
                    console.log(`explosion ${x} ${y}`);
                }
            })
        })
    })

    // Draw the moving rockets in their new position each loop until the loop ends
    movedRockets.forEach((mover) => {
        let rocketPos_x = (mover.startPosition.x * squareWidth) + (squareWidth * 0.2);
        let rocketPos_y = (mover.startPosition.y * squareHeight) + (squareHeight * 0.2);
        if (mover.endPosition.x < mover.startPosition.x) {
            rocketPos_x -= frameCounter;
            if (frameCounter % 2 == 0) {
                ctx.drawImage(litSheet, 600, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
            else {
                ctx.drawImage(litSheet, 700, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
        }
        if (mover.endPosition.x > mover.startPosition.x) {
            rocketPos_x += frameCounter;
            if (frameCounter % 2 == 0) {
                ctx.drawImage(litSheet, 400, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
            else {
                ctx.drawImage(litSheet, 500, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
        }
        if (mover.endPosition.y < mover.startPosition.y) {
            rocketPos_y -= frameCounter;
            if (frameCounter % 2 == 0) {
                ctx.drawImage(litSheet, 100, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
            else {
                ctx.drawImage(litSheet, 0, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
        }
        if (mover.endPosition.y > mover.startPosition.y) {
            rocketPos_y += frameCounter;
            if (frameCounter % 2 == 0) {
                ctx.drawImage(litSheet, 200, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
            else {
                ctx.drawImage(litSheet, 300, 0, 100, 100, rocketPos_x, rocketPos_y, imageSize, imageSize);
            }
        }

    })
    frameCounter += 3.5;

    console.log('frameCounter', frameCounter);
    console.log('movedRockets', movedRockets);
    if (frameCounter >= squareWidth || movedRockets.length == 0) {
        boardAndMoves = null;
        frameCounter = 0;
    }
}






function drawBoard() {
    // drawGrid(staticBoard);

    boardsAndMoves = [{ board: staticBoard, movedRockets: [] }]
    unlitSheet.onload = function () {
        raf = window.requestAnimationFrame(draw);
    }
    return ctx;
}

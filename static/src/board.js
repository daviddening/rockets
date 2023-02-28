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
        frame = window.requestAnimationFrame(animate);
        const imageSize = (squareHeight * 0.75);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawGrid(staticBoard);
        movedRockets.forEach((mover) => {
            let rocketStart_x = (mover.startPosition.x * squareWidth) / 2;
            let rocketStart_y = (mover.startPosition.y * squareHeight) / 2;
            if (mover.endPosition.x < mover.startPosition.x) {
                rocketStart_x += -1;
                ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
            }
            if (mover.endPosition.x > mover.startPosition.x) {
                rocketStart_x += 1;
                ctx.drawImage(rocketImage, rocketStart_x + (frameCounter * (squareWidth / 30)), rocketStart_y, imageSize, imageSize);
            }
            if (mover.endPosition.y < mover.startPosition.y) {
                rocketStart_y += -1;
                ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
            }
            if (mover.endPosition.y > mover.startPosition) {
                rocketStart_y += 1;
                ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
            }
            if (rocketStart_x == (mover.endPosition.x * squareWidth) / 2 || rocketStart_y == (mover.endPosition.y * squareHeight) / 2) {
                window.cancelAnimationFrame(frame);
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
        //requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(animate);
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // drawGrid(staticBoard);
    // board.forEach((row, y) => {
    //     row.forEach((square, x) => {
    //         square.rockets.forEach((rocket) => {
    //             if (rocket && !rocket.moved) {
    //                 ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
    //             }
    //             if (square?.explosion) {
    //                 ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
    //                 console.log(`explosion ${x} ${y}`);
    //             }
    //         })
    //     })
    // })
    console.log('movedRockets', movedRockets);
    // movedRockets
    // ATTN: Ben animate here
    // for each rocket, move it 1/30th(or some other number) between its initial and end positions  (a movedRocket has  { startPosition: {x ,y}, endPosition: { x, y } })
    // after the loop increment frameCounter;
    // if frameCounter == 30, reset frameCounter and set boardAndMoves equal to null
    boardAndMoves = null;
    // TODO temporary artificial wait to slow down display, until we get animation
    await delay(200);
    raf = window.requestAnimationFrame(draw);
}

// async function draw() {
//     if (!boardAndMoves) {
//         if (boardsAndMoves.length == 0) {
//             window.cancelAnimationFrame(raf);
//             return;
//         }
//         boardAndMoves = boardsAndMoves.shift();
//     }

//     ctx.font = "18px Arial";
//     const { board, movedRockets } = boardAndMoves;

//     const rows = board.length;
//     const columns = board[0].length;
//     const squareWidth = bw / columns;
//     const squareHeight = bh / rows;
//     const imageSize = (squareHeight * 0.75);
//     function animate() {
//         const imageSize = (squareHeight * 0.75);
//         window.requestAnimationFrame(animate);
//         if (movedRockets.length == 0 || frameCounter > 30) {
//             boardAndMoves = null;
//             frameCounter = 0;
//             window.cancelAnimationFrame(raf);
//         }
//         else {
//             ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//             drawGrid(staticBoard);
//             movedRockets.forEach((mover) => {
//                 let rocketStart_x = (mover.startPosition.x * squareWidth) / 2;
//                 let rocketStart_y = (mover.startPosition.y * squareHeight) / 2;
//                 if (mover.endPosition.x < mover.startPosition.x) {
//                     rocketStart_x += -1;
//                     ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
//                 }
//                 if (mover.endPosition.x > mover.startPosition.x) {
//                     rocketStart_x += 1;
//                     ctx.drawImage(rocketImage, rocketStart_x + (frameCounter * (squareWidth / 30)), rocketStart_y, imageSize, imageSize);
//                 }
//                 if (mover.endPosition.y < mover.startPosition.y) {
//                     rocketStart_y += -1;
//                     ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
//                 }
//                 if (mover.endPosition.y > mover.startPosition) {
//                     rocketStart_y += 1;
//                     ctx.drawImage(rocketImage, rocketStart_x, rocketStart_y, imageSize, imageSize);
//                 }
//                 if (rocketStart_x == (mover.endPosition.x * squareWidth) / 2 || rocketStart_y == (mover.endPosition.y * squareHeight) / 2) {
//                     window.cancelAnimationFrame(raf);
//                 }
//             })
//             board.forEach((row, y) => {
//                 row.forEach((square, x) => {
//                     square.rockets.forEach((rocket) => {
//                         if (rocket && !rocket.moved) {
//                             ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
//                         }
//                         if (square?.explosion) {
//                             ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
//                             console.log(`explosion ${x} ${y}`);
//                         }
//                     })
//                 })
//             })
//             raf = window.requestAnimationFrame(animate);
//             //requestAnimationFrame(draw);
//         }
//     }
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     drawGrid(staticBoard);
//     board.forEach((row, y) => {
//         row.forEach((square, x) => {
//             square.rockets.forEach((rocket) => {
//                 if (rocket && !rocket.moved) {
//                     ctx.drawImage(rocketImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
//                 }
//                 if (square?.explosion) {
//                     ctx.drawImage(explosionImage, (x * squareWidth) + (squareWidth / columns), (y * squareHeight) + (squareHeight / rows), imageSize, imageSize);
//                     console.log(`explosion ${x} ${y}`);
//                 }
//             })
//         })
//         requestAnimationFrame(animate);
//     })

//     console.log('movedRockets', movedRockets);
//     // movedRockets
//     // ATTN: Ben animate here
//     // for each rocket, move it 1/30th(or some other number) between its initial and end positions  (a movedRocket has  { startPosition: {x ,y}, endPosition: { x, y } })
//     // after the loop increment frameCounter;
//     // if frameCounter == 30, reset frameCounter and set boardAndMoves equal to null
//     window.requestAnimationFrame(animate);
//     // TODO temporary artificial wait to slow down display, until we get animation
//     // await delay(2000);
//     raf = window.requestAnimationFrame(draw);
// }




function drawBoard() {
    drawGrid(staticBoard);

    boardsAndMoves = [{ board: staticBoard, movedRockets: [] }]
    rocketImage.onload = function () {
        raf = window.requestAnimationFrame(draw);
    }
    return ctx;
}

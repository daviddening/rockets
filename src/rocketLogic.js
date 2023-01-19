

const DIRECTION_UP = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_DOWN = 3;
const DIRECTION_LEFT = 4;

const DIR_CHANGE_MAP =[
    { x: 0, y: 0 }, // PLACEHOLDER
    { x: 0, y: -1}, //UP
    { x: 1, y: 0}, // RIGHT
    { x: 0, y: 1}, // DOWN
    { x: -1, y: 0}  // LEFT
];

const tempDirectionArrowMap = [
    ' ',
    '▲',
    '►',
    '▼',
    '◄'
]

// 0 ------ >  X
// |
// |
// V
//
// Y

const staticBoardDB = [
    [3, 0, 0, 0, 4],
    [2, 0, 0, 3, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 4, 0]
];

const ROCKET_ID_TO_OBJ_MAP = [
    null,
    { direction: DIRECTION_UP },
    { direction: DIRECTION_RIGHT },
    { direction: DIRECTION_DOWN },
    { direction: DIRECTION_LEFT },
];

const staticBoard = staticBoardDB.map ((row) => {
    return row.map((id) => {
        return ROCKET_ID_TO_OBJ_MAP[id];
    })
});

const tempUpdateBoard = (nextBoard, movedObjects) => {
    nextBoard.forEach((row) => {
        row.forEach((col) => {
        process.stdout.write(col ? tempDirectionArrowMap[col?.direction] : '_');
        });
        process.stdout.write('\n')
    })
    process.stdout.write('-----------\n')
}
/**
 * Uploads an array of attachments to the respective service.
 *
 * @param {object} intialPosition, {x, y}
 * @param {array} board or rocket objects { direction}
 * @param {function} updateBoard, a callback function that takes (nextBoard, movedObjects) movedObjects is an array of objects { startPosition, endPosition}
 * @returns {object}
 */

const resolveMove = async(initialPosition, board, updateBoard) => {
    let activeRockets = [];
    const startRocket = board[initialPosition.y][initialPosition.x]
    if (startRocket) {
        activeRockets.push({ rocket: startRocket, initialPosition});
    }

    while ( activeRockets.length ) {
        const { movedRockets, newActiveRockets} = moveRockets(board, activeRockets)

        activeRockets = newActiveRockets;
        updateBoard(board, movedRockets);
    }

    updateBoard(board, [])
    return;
}

 const isMoveOnTheBoard = (board, move) => {
    const maxX = board.length -1;
    const maxY = board[0].length - 1;
    console.log(`On board x: ${move.x} y: ${move.y}`);
    return !(move.x < 0 || move.y < 0 || move.x > maxX || move.y > maxY);
 }
/*
*  updates board positions, and activeRockets, returns a list of changed rocket positions
*/

const moveRockets = (board, activeRockets) => {
    const movedRockets = activeRockets.map((activeRocket) => {
        console.log(`----${activeRocket}`)
        const { initialPosition: {x, y}, rocket} = activeRocket;
        console.log(activeRocket);
        console.log(`====${x} ${y} ${rocket.direction}`);
        const endX = x + DIR_CHANGE_MAP[rocket.direction].x;
        const endY = y + DIR_CHANGE_MAP[rocket.direction].y;
        return { startPosition: {x, y}, endPosition: {x: endX, y:endY}, rocket}
    })

    const newActiveRockets = movedRockets.filter(( move )=>{
        const { endPosition } = move;
        console.log(move);
        return isMoveOnTheBoard(board, endPosition)
    }).map((move)=> {
        const { startPosition, endPosition: {x, y} } = move;
        const hitRocket = board[y][x];
        console.log(`x: ${x} y: ${y} rocket = ${move.rocket}`);


        // TODO put a moving rocket on the board!
        if ( hitRocket ) {
            console.log('hit a rocket '+hitRocket);
           // board[y][x] = null; // TODO later we'll want to mark a collision
        } else {
            board[y][x] = move.rocket;
        }
        board[startPosition.y][startPosition.x] = null;


        // TODO: here we could do additional work, like special rockets that go in two, three, directions, or don't fire at all

        if (hitRocket) {
         return { initialPosition: { x, y }, rocket: hitRocket }
         }
         return { initialPosition: { x, y }, rocket: move.rocket};
    })

    //console.log(newActiveRockets[0].rocket);
    return { movedRockets, newActiveRockets };
}

// Display initial board
tempUpdateBoard(staticBoard, []);
const initialPosition = {x:4, y:0};
// Resolve a move that sets off a rocket at 4,0
resolveMove(initialPosition, staticBoard, tempUpdateBoard);
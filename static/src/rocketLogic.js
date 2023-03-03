const DEBUG = false;
const debugLog = (log) => {
    if (DEBUG) {
        console.log(log);
    }
}

/**
 * lightRocket takes a rocket and 'lights' it, converts it into one or more active rockets
 *
 * @param {object} position, {x, y}
 * @param {object} rocket
 *
 *  @return array[object] array of moving rocket objects
 */
const lightRocket = (position, hitRocket) => {
    const { x, y } = position
    var movingRockets = []
    switch (hitRocket.type) {

        case 'double':
            if (hitRocket.direction == DIRECTION_UP) {
                movingRockets = [{ initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_UP] }, { initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_DOWN] }]
            } else {
                movingRockets = [{ initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_RIGHT] }, { initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_LEFT] }]
            }
            break
        case 'single':
        default: {
            movingRockets = [{ initialPosition: { x, y }, rocket: hitRocket }]
        }
    }
    return movingRockets;
}

/**
 * Reset Explosions - set all explosions false
 * @param {any[]} board
 * @return
 */
const resetExplosions = (board) => {
    board.forEach((row) => {
        row.forEach((square) => {
            square.explosion = false;
        })
    })
}

const resetMoved = (board) => {
    board.forEach((row) => {
        row.forEach((square) => {
            square.rockets.forEach((rocket) => {
                if (rocket) { rocket.moved = false }
            });
        })
    })
}

/**
 * Uploads an array of attachments to the respective service.
 *
 * @param {object} intialPosition, {x, y}
 * @param {array} board or rocket objects { direction}
 * @param {function} updateBoard, a callback function that takes (nextBoard, movedObjects) movedObjects is an array of objects { startPosition, endPosition}
 * @return empty
 */

const resolveMove = async (initialPosition, board, updateBoard) => {
    let boardsAndMoves = []
    let activeRockets = [];
    const startRocket = board[initialPosition.y][initialPosition.x]?.rockets?.[0];
    if (startRocket) {
        activeRockets = lightRocket(initialPosition, startRocket);
        board[initialPosition.y][initialPosition.x].rockets = activeRockets.map((movingRocket) => movingRocket.rocket)
    }

    while (activeRockets.length) {
        const { movedRockets, newActiveRockets } = moveRockets(board, activeRockets)
        //debugLog(`movedRockets: ${movedRockets} newActiveRockets: ${newActiveRockets}`);
        debugLog()
        activeRockets = newActiveRockets;
        boardsAndMoves.push(JSON.parse(JSON.stringify({ board, movedRockets })));
        resetExplosions(board)
        resetMoved(board)
    }

    boardsAndMoves.push(JSON.parse(JSON.stringify({ board, movedRockets: [] })));
    updateBoard(boardsAndMoves);
}

/**
 * Checks whether a rocket is on the board
 *
 * @param {array} board or rocket objects { direction}
 * @param {object} position, {x, y}
 * @return boolean
 */

const isMoveOnTheBoard = (board, position) => {
    const maxY = board.length - 1;
    const maxX = board[0].length - 1;
    //debugLog(`checking on board x: ${position.x} y: ${position.y}`);
    return !(position.x < 0 || position.y < 0 || position.x > maxX || position.y > maxY);
}

const resolveRocketMoveOnBoard = (board, moveRocket) => {
    const { startPosition, endPosition: { x, y } } = moveRocket;

    // clean up old rocket position
    board[startPosition.y][startPosition.x].rockets = [];

    var movingRockets = [{ initialPosition: moveRocket.endPosition, rocket: moveRocket.rocket }];
    var litRockets = null
    // is rocket NOT flying off the board
    if (!isMoveOnTheBoard(board, { x, y })) {
        return [];
    }
    const hitRocket = board[y][x]?.rockets[0];
    debugLog(moveRocket);
    debugLog(hitRocket);

    if (hitRocket) {
        debugLog('Hit a rocket')
        debugLog(hitRocket);
        board[y][x].explosion = true;
        litRockets = lightRocket({ x, y }, hitRocket);
    } else {
        board[y][x].rockets = [{ ...moveRocket.rocket, moved: true }];
    }

    return litRockets ? litRockets : movingRockets;
}
/*
*  moveRocket updates board positions, and activeRockets, returns a list of changed rocket positions
 * @param {array} board or rocket objects { direction}
 * @param {object} { intialPosition: {x, y}, rocket }
 * @return { movedRockets: {startPosition, endPosition, rocket}, newActiveRockets: {initialPosition, rocket}}
*/
const moveRockets = (board, activeRockets) => {
    const movedRockets = activeRockets.map((activeRocket) => {
        const { initialPosition: { x, y }, rocket } = activeRocket;
        debugLog(activeRocket);
        const endX = x + DIR_CHANGE_MAP[rocket.direction].x;
        const endY = y + DIR_CHANGE_MAP[rocket.direction].y;
        return { startPosition: { x, y }, endPosition: { x: endX, y: endY }, rocket }
    })

    const rocketsOnBoard = movedRockets.filter((moveRocket) => {
        const { startPosition } = moveRocket;
        return isMoveOnTheBoard(board, startPosition)
    })
    const newActiveRockets = rocketsOnBoard.map((moveRocket) => {
        movingRockets = resolveRocketMoveOnBoard(board, moveRocket)
        return movingRockets;
    }).flat()

    debugLog(newActiveRockets);
    debugLog(movedRockets);
    return { movedRockets, newActiveRockets };
}
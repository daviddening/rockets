// RUN with `node rocketLogic.js`
const utils = require('./boardUtils.js');


const DEBUG = false;
const debugLog = (log) => {
    if (DEBUG) {
        console.log(log);
    }
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
    let activeRockets = [];
    const startRocket = board[initialPosition.y][initialPosition.x]
    if (startRocket) {
        activeRockets.push({ rocket: startRocket, initialPosition });
    }

    while (activeRockets.length) {
        const { movedRockets, newActiveRockets } = moveRockets(board, activeRockets)

        activeRockets = newActiveRockets;
        updateBoard(board, movedRockets);
    }

    updateBoard(board, [])
    return;
}

/**
 * Checks whether a rocket is on the board
 *
 * @param {array} board or rocket objects { direction}
 * @param {object} position, {x, y}
 * @return boolean
 */

const isMoveOnTheBoard = (board, position) => {
    const maxX = board.length - 1;
    const maxY = board[0].length - 1;
    //debugLog(`checking on board x: ${position.x} y: ${position.y}`);
    return !(position.x < 0 || position.y < 0 || position.x > maxX || position.y > maxY);
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
        const endX = x + utils.DIR_CHANGE_MAP[rocket.direction].x;
        const endY = y + utils.DIR_CHANGE_MAP[rocket.direction].y;
        return { startPosition: { x, y }, endPosition: { x: endX, y: endY }, rocket }
    })

    const newActiveRockets = movedRockets.filter((moveRocket) => {
        const { endPosition } = moveRocket;
        return isMoveOnTheBoard(board, endPosition)
    }).map((moveRocket) => {
        const { startPosition, endPosition: { x, y } } = moveRocket;
        const hitRocket = board[y][x];
        debugLog(moveRocket);

        // TODO put a moving rocket on the board!
        if (hitRocket) {
            debugLog('Hit a rocket')
            debugLog(hitRocket);
        } else {
            board[y][x] = moveRocket.rocket;
        }
        // clean up old rocket position
        board[startPosition.y][startPosition.x] = [];

        // TODO: here we could do additional work, like special rockets that go in two, three, directions, or don't fire at all

        if (hitRocket) {
            var rockets = []
            switch (type) {

                case 'double':
                    if (hitRocket.direction = DIRECTION_UP) {
                        rockets = [{ initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_UP] }, { initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_DOWN] }]
                    } else {
                        rockets = [{ initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_RIGHT] }, { initialPosition: { x, y }, rocket: ROCKET_ID_TO_OBJ_MAP[DIRECTION_LEFT] }]
                    }
                    break
                case 'single':
                default: {
                    rockets = [{ initialPosition: { x, y }, rocket: hitRocket }]
                }
            }
            return rockets;
        }
        return { initialPosition: { x, y }, rocket: moveRocket.rocket };
    }).flat()

    return { movedRockets, newActiveRockets };
}

// Display initial board
utils.tempDisplay(utils.staticBoard, []);
const initialPosition = { x: 4, y: 0 };
// Resolve a move that sets off a rocket at 4,0
resolveMove(initialPosition, utils.staticBoard, utils.tempDisplay);
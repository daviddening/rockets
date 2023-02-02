const DIRECTION_UP = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_DOWN = 3;
const DIRECTION_LEFT = 4;

const DIR_CHANGE_MAP = [
    { x: 0, y: 0 }, // PLACEHOLDER
    { x: 0, y: -1 }, //UP
    { x: 1, y: 0 }, // RIGHT
    { x: 0, y: 1 }, // DOWN
    { x: -1, y: 0 }  // LEFT
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

const staticBoard = staticBoardDB.map((row) => {
    return row.map((id) => {
        return ROCKET_ID_TO_OBJ_MAP[id];
    })
});

const tempDisplay = (nextBoard, movedObjects) => {
    nextBoard.forEach((row) => {
        row.forEach((col) => {
            process.stdout.write(col ? tempDirectionArrowMap[col?.direction] : '_');
        });
        process.stdout.write('\n')
    })
    process.stdout.write('\n')
}

module.exports = { staticBoard, tempDisplay };
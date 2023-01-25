export const DIRECTION_UP = 1;
export const DIRECTION_RIGHT = 2;
export const DIRECTION_DOWN = 3;
export const DIRECTION_LEFT = 4;

export const DIR_CHANGE_MAP = [
    { x: 0, y: 0 }, // PLACEHOLDER
    { x: 0, y: -1 }, //UP
    { x: 1, y: 0 }, // RIGHT
    { x: 0, y: 1 }, // DOWN
    { x: -1, y: 0 }  // LEFT
];

export const tempDirectionArrowMap = [
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

export const ROCKET_ID_TO_OBJ_MAP = [
    null,
    { direction: DIRECTION_UP },
    { direction: DIRECTION_RIGHT },
    { direction: DIRECTION_DOWN },
    { direction: DIRECTION_LEFT },
];

export const staticBoard = staticBoardDB.map((row) => {
    return row.map((id) => {
        return ROCKET_ID_TO_OBJ_MAP[id];
    })
});


'use strict';

// Utility Functions Script


function getRandCell(board) {
    var i = getRandomIntInclusive(0, board.length - 1);
    var j = getRandomIntInclusive(0, board[0].length - 1);
    return { i, j };
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
    // The maximum is inclusive and the minimum is inclusive
}

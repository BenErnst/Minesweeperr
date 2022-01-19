'use strict';


var gBoard;
const MINE = '💣';


var gLevel = {
    size: 8,
    mines: 12
};


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
};


function setLevel(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;

    resetGame();
}


function init() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}


function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            var cell = createCell();
            board[i][j] = cell;
        }
    }
    return board;
}


function createCell() {
    return {
        minesAroundCount: '',
        isShown: false,
        isMine: false,
        isMarked: false
    };
}


function createMines(board, clickedI, clickedJ) {
    for (var i = 0; i < gLevel.mines; i++) {
        var randCellPos = getRandCell(board);

        if (randCellPos.i === clickedI && randCellPos.j === clickedJ) {
            i--;
            continue;
        }

        if (board[randCellPos.i][randCellPos.j].isMine) {
            i--;
            continue;
        }

        board[randCellPos.i][randCellPos.j].isMine = true;
    }
    setMinesNegsCount(board);
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            if (cell.isMine) continue;
            var minesNegsCount = countMinesNegs(board, i, j);
            cell.minesAroundCount = minesNegsCount;
        }
    }
}


function countMinesNegs(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (board[i][j].isMine) count++;
        }
    }
    return (count) ? count : '';
}


function renderBoard(board) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];

            var cellContent = (cell.isMine) ? MINE : cell.minesAroundCount;

            var className = (cell.isMine) ? 'mine ' : `number${cell.minesAroundCount} `;
            className += `cell cell-${i}-${j} covered`;

            strHTML += `<td class="${className}" onclick="cellClicked(${i}, ${j})" onmouseup="cellMarked(event, ${i}, ${j})">${cellContent}</td>`;

        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>'

    var elBoardContainer = document.querySelector('.board-container');
    elBoardContainer.innerHTML = strHTML;

    // Needed when Smiley has been clicked after Game Over:
    elBoardContainer.style.display = 'inline-block';
}



function resetGame() {
    console.clear();

    // Reseting Timer:
    clearInterval(gTimerInterval);
    gGame.secsPassed = 0;
    var elTimerNum = document.querySelector('.timer-num');
    elTimerNum.innerText = gGame.secsPassed;

    // Reseting Game Properties:
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;

    gGame.lives = gGame.lives;

    // Rebuilding MODEL and DOM:
    init();
}
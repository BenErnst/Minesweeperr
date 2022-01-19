'use strict';


const FLAG = '🚩';
const SECOND = 1000;


// A Single Global Variable, aimed to store the cell content after the cell has been marked:
var gPrevCellContent;

// 
var gIsAllMinesMarked = false;
var gIsAllNonMinesCellsShown = false;

// 
var gTimerInterval;



function cellClicked(i, j) {
    if (!gGame.shownCount) {
        // Only if it's the first cell to be clicked:

        createMines(gBoard, i, j);
        renderBoard(gBoard);

        gGame.isOn = true;
        startTimer();
    }

    if (!gGame.isOn) return;

    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;

    if (gBoard[i][j].isMine) {
        if (gIsHintOn) {
            showHint(i, j);
            return;
        }
        checkGameOver('explosion');
        return;
    }

    if (gIsHintOn) showHint(i, j);

    // Show/Reveal the Clicked Cell, and Expanding all its negs ONLY if they aren't Mines:
    if (gBoard[i][j].minesAroundCount) showCell(i, j);
    else expandShown(gBoard, i, j);
}



function cellMarked(event, i, j) {
    if (gBoard[i][j].isShown) return;

    var elCell = document.querySelector(`.cell-${i}-${j}`);

    if (!elCell.classList.contains('covered')) return;
    if (!gGame.isOn) return;
    if (!gGame.shownCount) return;

    // If right-clicked:
    if (event.button === 2) {

        if (gBoard[i][j].isMarked) {

            // MODEL:
            gBoard[i][j].isMarked = false;
            gGame.markedCount--;

            // DOM:
            elCell.innerHTML = gPrevCellContent;
            elCell.classList.remove('marked');

        } else {

            // MODEL (any mark):
            gBoard[i][j].isMarked = true;

            // Counting ONLY marked mines, and if all mines are marked - sending to check if game ends:
            if (gBoard[i][j].isMine) {
                gGame.markedCount++;
                if (gGame.markedCount === gLevel.mines) {
                    checkGameOver('all mines are marked');
                }
            }

            // DOM (any mark):
            gPrevCellContent = elCell.innerHTML;

            elCell.innerHTML = FLAG;

            elCell.classList.add('marked');
        }
    }
}



function startTimer() {
    var elTimerNum = document.querySelector('.timer-num');
    var startTime = Date.now();
    gTimerInterval = setInterval(() => {
        gGame.secsPassed = `${((Date.now() - startTime) / 1000).toFixed(0)}`
        elTimerNum.innerText = gGame.secsPassed;
    }, SECOND);
}



function showCell(i, j) {
    // MODEL:
    gBoard[i][j].isShown = true;
    gGame.shownCount++;

    // DOM:
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.classList.remove('covered');

    // Checking if all non-mine cells are shown, and if they are - sending to check if game ends:
    var desiredShownCount = (gLevel.size ** 2) - gLevel.mines;
    if (gGame.shownCount === desiredShownCount) {
        checkGameOver('all non-mine cells are shown');
    }

    areAllCellsShown();
}



function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;

            // MODEL:
            if (!board[i][j].isShown) gGame.shownCount++;
            board[i][j].isShown = true;

            // DOM:
            var elNeg = document.querySelector(`.cell-${i}-${j}`);
            elNeg.classList.remove('covered');
        }
    }
    board[rowIdx][colIdx].isShown = true;
    gGame.shownCount++;

    var elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`);
    elCell.classList.remove('covered');

    areAllCellsShown();
}



function areAllCellsShown() {
    // Checking if all non-mine Cells are shown, and if they are - checking if game ends:

    var desiredShownCount = (gLevel.size ** 2) - gLevel.mines;
    if (gGame.shownCount === desiredShownCount) {
        checkGameOver('all non-mine cells are shown');
    }
}



function checkGameOver(trigger) {
    // Loosing Case:
    if (trigger === 'explosion') {
        var elMines = document.querySelectorAll('.mine');
        for (var i = 0; i < elMines.length; i++) {
            var elMine = elMines[i];
            elMine.classList.remove('covered');
            if (!gPrevCellContent) {
                gPrevCellContent = MINE
            }
            elMine.innerHTML = gPrevCellContent;
        }
        controlLivesCounter();

        clearInterval(gTimerInterval);
        gGame.isOn = false;

        // console.log('Boom!');
    }

    // Winning Case:
    if (trigger === 'all mines are marked') gIsAllMinesMarked = true;
    if (trigger === 'all non-mine cells are shown') gIsAllNonMinesCellsShown = true;

    if (gIsAllMinesMarked && gIsAllNonMinesCellsShown) {
        gGame.isOn = false;

        clearInterval(gTimerInterval);
        setBestScore();

        var elSmiley = document.querySelector('.smiley')
        elSmiley.innerHTML = '😎';

        // Reseting to False in order to be prepeard for the next round if there will be one:
        gIsAllMinesMarked = false;
        gIsAllNonMinesCellsShown = false;

        // console.log('winning!');
    }
}



function controlLivesCounter() {
    gGame.lives--;

    var elBoardContainer = document.querySelector('.board-container');

    var elLivesCounter = document.querySelector('.lives-counter');

    var elCounter = elLivesCounter.querySelector('span');
    if (gGame.lives < 0) gGame.lives = 3;
    else elCounter.innerHTML = gGame.lives;

    elLivesCounter.style.display = 'block';

    setTimeout(() => {
        elLivesCounter.style.display = 'none';
        elLivesCounter.style.transition = 'none 3s';
    }, SECOND * 3);

    if (!gGame.lives) {
        elLivesCounter.innerHTML = 'GAME OVER';
        elBoardContainer.style.display = 'none';

        var elSmiley = document.querySelector('.smiley')
        elSmiley.innerHTML = '🤯';
        // console.log('loosing!');

        gGame.lives--;
    } else {
        setTimeout(() => {
            resetGame();
        }, SECOND * 4);
    }
}


function smileyClicked(elSmiley) {
    elSmiley.innerHTML = '😀';
    resetGame();
}




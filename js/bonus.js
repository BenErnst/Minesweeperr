'use strict';


// Hint Lamps:

var gIsHintOn = false;
var gElLamp;

function isHintOn(elLamp) {
    gIsHintOn = true;
    gElLamp = elLamp;
    gElLamp.style.backgroundColor = 'gray';
}

function showHint(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            // DOM:
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            show(elCell);
        }
    }
}

function show(elCell) {
    elCell.classList.remove('covered');
    setTimeout(() => {
        elCell.classList.add('covered');
        gIsHintOn = false;
        gElLamp.style.visibility = 'hidden';
    }, SECOND);
}



// Best Score:

var gScores = {
    beginner: [],
    medium: [],
    expert: []
};

function setBestScore() {
    if (gLevel.size === 4) gScores.beginner.push(gGame.secsPassed);
    if (gLevel.size === 8) gScores.medium.push(gGame.secsPassed);
    if (gLevel.size === 12) gScores.expert.push(gGame.secsPassed);

    for (var levelScores in gScores) {
        var bestScore = Infinity;
        for (var i = 0; i < levelScores.length; i++) {
            var score = levelScores[i];
            if (score < bestScore) bestScore = score;
        }
        localStorage.setItem('bestScore of level ' + levelScores, bestScore + ' seconds');
    }
}
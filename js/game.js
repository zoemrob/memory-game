"use strict";
const emptyStar = '&#9734;';
const fullStar = '&#9733;';
let currentBoard;

function load () {
    /**
     * @description: Checks if localStorage exists
     * @return:      {boolean} indicator of whether localStorage exists
     * sourced from: https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available/16427747
     */
    const useLocalStorage = (() => {
        const test = 'test';
        try {
            localStorage.setItem('test', test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    })();
    const saveLoadButton = document.getElementById('js-save-load-btn'),
        startRestartButton = document.getElementById('js-start-restart-btn'),
        timer = document.getElementById('js-timer'),
        avgStars = document.getElementById('js-star-avg'),
        controls = document.getElementById('js-controls'),
        cardContainer = document.getElementById('js-card-container'),
        cardSetName = document.getElementById('js-card-set-name'),
        board = new Board();
    let boardSet = false;

    if (useLocalStorage) {
        getAvgStars();
    } else {
        avgStars.classList.toggle('hidden');
        saveLoadButton.classList.toggle('hidden');
    }

    startRestartButton.addEventListener('click', standardStart);

    saveLoadButton.addEventListener('click', loadPrevGame);

    function loadPrevGame() {
        const lastGame = JSON.parse(localStorage.getItem('lastGame'));
        if (lastGame) {
            sharedSetup(board.setLastBoardInfo(lastGame));
        } else {
            window.alert('There is no saved game.');
        }
    }

    function clickHandler (e) {
        let card,
            id;
        id = board.getCardId(e);
        if (id) {
            card = board.handleClicks(id);
            console.log(card);
        } else { return false; }
        if (card) {
            board.updateBoard(card)
        } else { return false; }
    }

    function standardStart () {
        // reset board state, remove event listener
        board.resetBoard();
        cardContainer.removeEventListener('click', clickHandler);
        sharedSetup(board.setNewBoardInfo());
        saveLoadButton.removeEventListener('click', loadPrevGame);
        saveLoadButton.addEventListener('click', saveGame);
    }

    function sharedSetup (boardInfo) {
        currentBoard = boardInfo;
        startRestartButton.innerText = 'Restart';
        saveLoadButton.innerText = 'Save';
        cardSetName.innerText = currentBoard[0];
        if (!boardSet) {
            cardContainer.appendChild(board.makeBoardElements());
            boardSet = true;
        } else {
            cardContainer.innerHTML = '';
            cardContainer.appendChild(board.makeBoardElements());
        }

        cardContainer.addEventListener('click', clickHandler);
        console.log(currentBoard);
    }

    function getAvgStars() {
        const starHistory = localStorage.getItem('starHistory');
        if (starHistory === null || starHistory === undefined || !starHistory.length) {
            // if starHistory is empty or if it does not exist
            avgStars.classList.toggle('hidden');
        } else {
            let total = 0;
            starHistory.forEach(star => {
                total += star;
            });
            avgStars.innerText = (total/starHistory).toString();
        }
    }

    function saveGame() {
        const gameState = board.saveGameState();
        localStorage.setItem('lastGame', JSON.stringify(gameState));
        saveLoadButton.innerText = 'Load';
        startRestartButton.innerText = 'Start';
        saveLoadButton.removeEventListener('click', saveGame);
        saveLoadButton.addEventListener('click', loadPrevGame);
        window.alert('Game Saved. Start a new game or load your saved game. Only one game may be saved at a time.');
        cardSetName.innerText = '';
        cardContainer.innerHTML = '';
        boardSet = false;
    }
}



function camelCaseToHyphen (str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}

function hyphenCaseToCamel (str) {
    return str.replace(/-([a-z])/g, g => {
        return g[1].toUpperCase();
    });
}

function camelCaseToNormal (str) {
    let init = str.replace(/([A-Z])/g, " $1");
    return init.charAt(0).toUpperCase() + init.slice(1);
}

function shuffle(elements) {
    // TODO implement shuffle method
}

document.addEventListener('DOMContentLoaded', load);
"use strict";
const emptyStar = '<i class="fa fa-star-o"></i>',
    fullStar = '<i class="fa fa-star"></i>',
    starMap = {
        "5"  : `${fullStar}\n${fullStar}\n${fullStar}\n${fullStar}\n${fullStar}`,
        "4"  : `${fullStar}\n${fullStar}\n${fullStar}\n${fullStar}\n${emptyStar}`,
        "3"  : `${fullStar}\n${fullStar}\n${fullStar}\n${emptyStar}\n${emptyStar}`,
        "2"  : `${fullStar}\n${fullStar}\n${emptyStar}\n${emptyStar}\n${emptyStar}`,
        "1"  : `${fullStar}\n${emptyStar}\n${emptyStar}\n${emptyStar}\n${emptyStar}`
    };
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
        avgStars = document.getElementById('js-avg-stars'),
        cardContainer = document.getElementById('js-card-container'),
        cardSetName = document.getElementById('js-card-set-name'),
        winModal = document.getElementById('js-win-modal'),
        modalNewGameButton = document.getElementById('js-modal-start'),
        starCounter = document.getElementById('js-stars'),
        statsPanel = document.getElementById('js-stats-dock'),
        board = new Board();

    let boardSet = false,
        timerVal = 0,
        timer,
        secs = document.getElementById('js-timer-secs'),
        mins = document.getElementById('js-timer-mins'),
        winStatus = false;

    if (useLocalStorage) {
        getAvgStars();
    } else {
        avgStars.classList.toggle('hidden');
        saveLoadButton.classList.toggle('hidden');
    }

    startRestartButton.addEventListener('click', standardStart);

    saveLoadButton.addEventListener('click', loadPrevGame);
    // hidden win modal
    modalNewGameButton.addEventListener('click', standardStart);
    // closes win modal
    winModal.addEventListener('click', (e) => {
        let id = e.target.getAttribute('id');
        switch (id) {
            case 'js-modal-bg':
            case 'js-modal-close-btn':
            case 'js-modal-start':
                winModal.classList.toggle('hidden');
                break;
            default:
                e.stopPropagation();
        }
    });


    function loadPrevGame() {
        const lastGame = JSON.parse(localStorage.getItem('lastGame'));
        if (lastGame) {
            sharedSetup(board.setLastBoardInfo(lastGame));
            setTimer(lastGame.timer)
        } else {
            window.alert('There is no saved game.');
        }
    }

    function clickHandler(e) {
        let card,
            id,
            winObject = false;
        id = board.getCardId(e);
        if (id) {
            // if valid click, and timer is 0
            if (timerVal === 0 || timerVal === board.timer) {
                clearInterval(timer);
                startTimer();
            }
            board.setTimer(timerVal);
            card = board.handleClicks(id);
            console.log(card);
        } else { return false; }
        if (card) {
            board.updateBoard(card);
            winObject = board.checkWin();
        } else { return false; }
        if (winObject) {
            win(winObject);
        } else { return false; }
    }

    function standardStart() {
        // reset board state, remove event listener
        board.resetBoard();
        timerVal = 0;
        clearInterval(timer);
        cardContainer.removeEventListener('click', clickHandler);
        sharedSetup(board.setNewBoardInfo());
        saveLoadButton.removeEventListener('click', loadPrevGame);
        saveLoadButton.addEventListener('click', saveGame);
        cardContainer.addEventListener('click', clickHandler);
        starCounter.innerHTML = starMap['5'];
    }

    function sharedSetup(boardInfo) {
        if (cardContainer.classList.contains('hidden')) {
            cardContainer.classList.remove('hidden');
        }
        if (statsPanel.classList.contains('hidden')) {
            statsPanel.classList.remove('hidden');
        }
        winStatus = false;
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
        const winHistory = JSON.parse(localStorage.getItem('winHistory'));
        if (!winHistory) {
            // if starHistory is empty or if it does not exist
            avgStars.classList.toggle('hidden');
        } else {
            let total = 0;
            winHistory.forEach(win => {
                total += win.stars;
            });
            let avg = total/winHistory.length;
            avgStars.innerHTML = "Average Stars: " + starMap[Math.round(avg).toString()] + " (" + avg.toString().slice(0, 3) + ")";
        }
    }

    function saveGame() {
        cardContainer.classList.add('hidden');
        clearInterval(timer);
        board.setTimer(timerVal);

        const gameState = board.saveGameState();
        localStorage.setItem('lastGame', JSON.stringify(gameState));
        saveLoadButton.innerText = 'Load';
        startRestartButton.innerText = 'New Game';
        saveLoadButton.removeEventListener('click', saveGame);
        saveLoadButton.addEventListener('click', loadPrevGame);
        window.alert('Game Saved. Start a new game or load your saved game. Only one game may be saved at a time.');
        cardSetName.innerText = '';
        cardContainer.innerHTML = '';
        boardSet = false;
    }

    function win(winObject) {
        console.log(winObject);
        // stop timer
        clearInterval(timer);
        if (useLocalStorage) {
            // clear saved game to avoid cheating and boosting score
            localStorage.removeItem('lastGame');
            let winHistory = localStorage.getItem('winHistory');
            if (winHistory) {
                winHistory = JSON.parse(winHistory);
                winHistory.push(winObject);
                localStorage.setItem('winHistory', JSON.stringify(winHistory));
                getAvgStars();
            } else {
                winHistory = [];
                winHistory.push(winObject);
                localStorage.setItem('winHistory', JSON.stringify(winHistory));
                getAvgStars();
            }
        }
        // Remove event listener from board, reset start/load buttons
        cardContainer.removeEventListener('click', clickHandler);
        saveLoadButton.innerText = 'Load';
        saveLoadButton.removeEventListener('click', saveGame);
        saveLoadButton.addEventListener('click', loadPrevGame);
        startRestartButton.innerText = 'New Game';
        winStatus = true;

        getWinPopup(winObject);
    }

    function getWinPopup(winObject) {
        const turnStats = document.getElementById('js-modal-turns'),
            starStats = document.getElementById('js-modal-win-stars'),
            cardSetName = document.getElementById('js-modal-set-name'),
            winTimer = document.getElementById('js-win-timer');

        turnStats.innerHTML = "Congratulations!<br>You won in " + winObject.turns + " turns!";
        starStats.innerHTML = "Star Rating: " + starMap[winObject.stars.toString()];
        cardSetName.innerText = winObject.cardSet;
        if (winObject.winTime) {
            let min = parseInt((winObject.winTime / 60), 10).toString(),
                secs = (winObject.winTime % 60).toString();
            winTimer.innerText += "Win time: ";
            winTimer.innerText += min > 0 ? min + " mins & " + secs + " seconds!" : secs + " seconds!";
            winTimer.classList.toggle('hidden');
        }
        winModal.classList.toggle('hidden');
    }

    /** Starts game timer from whatever the value of timerVal is
     * Sourced in part: http://jsfiddle.net/fc37nckg/
     */
    function startTimer() {
        timer = setInterval(function () {
            secs.innerText = pad(++timerVal % 60);
            mins.innerText = pad(parseInt(timerVal / 60, 10));
        }, 1000);
    }

    function setTimer(val) {
        timerVal = val;
    }
}

function pad(val) {
    return val > 9 ? val : "0" + val;
}

function camelCaseToNormal(str) {
    let init = str.replace(/([A-Z])/g, " $1");
    return init.charAt(0).toUpperCase() + init.slice(1);
}

document.addEventListener('DOMContentLoaded', load);
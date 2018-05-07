"use strict";
const emptyStar = '&#9734;';
const fullStar = '&#9733;';

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
        moveCounter = document.getElementById('js-move-counter'),
        avgStars = document.getElementById('js-star-avg'),
        controls = document.getElementById('js-controls'),
        cardContainer = document.getElementById('card-container'),
        board = new Board();

    useLocalStorage ? getAvgStars() : hideAvgStars();

    startRestartButton.addEventListener('click', () => {
        board.resetBoard();
        console.log(board.setNewBoardInfo());
    });
}

function getAvgStars() {
    const starHistory = localStorage.getItem('starHistory');
    if (starHistory === null || starHistory === undefined || !starHistory.length) {
        // if starHistory is empty or if it does not exist
        hideAvgStars();
    } else {
        let total = 0;
        stars.forEach(star => {
            total += star;
        });
    }
}

function hideAvgStars() {
    // TODO hide average stars
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

document.addEventListener('DOMContentLoaded', load);
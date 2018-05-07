"use strict";

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
}

function getAvgStars() {
    const starHistory = localStorage.getItem('starHistory');
    if (!starHistory.length || starHistory === undefined) {
        // if starHistory is empty or if it does not exist
        hideAvgStars();
    }
    let total = 0;
    stars.forEach(star => {
        total += star;
    });
}

function hideAvgStars() {
    // TODO hide average stars
}

document.addEventListener('DOMContentLoaded', load);
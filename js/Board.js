"use strict";

/**
 * @description representative of board state, supplies methods
 * and properties to save or load board
 * @constructor
 */
const Board = function () {
    this.emptyStar = 'fa-star-o';
    this.fullStar = 'fa-star';
    this.starCounter = 5;
    this.timer = null;
    this.clickCounter = 0;
    this.firstClick = null;
    this.secondClick = null;
    this.turnCounter = 0;
    this.cardSet = [];
    this.cardSetName = '';
    this.boardInfo = [];
    this.cardSets = {
        sets: [
            'animals',
            'beverages',
            'cocktails',
            'programmingLanguages',
            'boardGames'
        ],
        animals: [
            "Dog",
            "Cat",
            "Ferret",
            "Mouse",
            "Pigeon",
            "Chipmunk",
            "Squirrel",
            "Raccoon"
        ],
        beverages: [
            "Coffee",
            "Matcha",
            "Sarsaparilla",
            "Apple Cider",
            "Tea",
            "Wine",
            "Vodka",
            "Tequila"
        ],
        cocktails: [
            "Old Fashioned",
            "Long-Island",
            "Manhattan",
            "White Russian",
            "Martini",
            "Margarita",
            "Whisky Sour",
            "Bloody Mary"
        ],
        programmingLanguages: [
            "PHP",
            "JavaScript",
            "TypeScript",
            "C",
            "Clojure",
            "Python",
            "Haskell",
            "Golang"
        ],
        boardGames: [
            "Monopoly",
            "Settlers of Catan",
            "Scrabble",
            "Risk",
            "Chess",
            "Sequence",
            "The Game of Life",
            "Munchkin"
        ]
    };
};

/**
 * @description returns a compact object of current game state
 * @return {{cards: (Array), turns: (number), timer: (number)}}
 */
Board.prototype.saveGameState = function () {
    return {
        cards: this.boardInfo,
        turns: this.turnCounter,
        timer: this.timer
    };
};

/**
 * @description creates a new board
 * @return {Array} - board elements as objects
 */
Board.prototype.setNewBoardInfo = function () {
    this.setCardSet();
    // sets the title of the board
    this.boardInfo[0] = this.cardSetName;

    // creates unique ids based on card name
    this.cardSet.forEach(card => {
        let cardObj = {};
        let init = card.toLowerCase().replace(' ', '-');
        const first = 'js-' + init + '-1';
        const second = 'js-' + init + '-2';

        cardObj.cardNameText = card;
        cardObj.id1 = first;
        cardObj.id2 = second;
        cardObj.matched = false;

        this.boardInfo.push(cardObj);
    });
    return this.boardInfo;
};

/**
 * @description used when loaded a saved game
 * @param {object} boardInfo - boardInfo object
 * @return {Array} - array of boardInfo
 */
Board.prototype.setLastBoardInfo = function (boardInfo) {
    this.boardInfo = boardInfo.cards;
    this.turnCounter = boardInfo.turns;
    this.timer = boardInfo.timer;
    return this.boardInfo;
};

/**
 * @description returns a random cardset, gets the cards
 */
Board.prototype.setCardSet = function () {
    const setIndex = Math.floor(Math.random() * 5),
        set = this.cardSets.sets[setIndex];

    this.cardSetName = camelCaseToNormal(set);
    this.cardSet = this.cardSets[set];
};

/**
 * @description creates DOM elements from boardInfo
 * @return {documentFragment} cardBoard - returns DOM elements
 */
Board.prototype.makeBoardElements = function () {
    const cardBoard = document.createDocumentFragment();
    let cards = this.boardInfo.slice(1),
        elements = [];

    cards.forEach(cardData => {
        const matchedCheck = cardData['matched'] ? 'matched' : false,
            card1 = this.createCard(cardData['cardNameText'], cardData['id1'], matchedCheck),
            card2 = this.createCard(cardData['cardNameText'], cardData['id2'], matchedCheck);
        elements.push(card1);
        elements.push(card2);
    });

    elements.forEach(element => {
        cardBoard.appendChild(element);
    });
    // shuffle twice, just to be safe ;)
    return this.shuffleBoard(this.shuffleBoard(cardBoard));
};

/**
 * @description clears boardInfo and resets turns
 */
Board.prototype.resetBoard = function () {
    this.boardInfo = [];
    if (this.turnCounter > 0) {
        this.resetTurns();
    }

};

/**
 * @description creates individual DOM nodes for a card
 * @param {string} cardName
 * @param {string} cardId - html id attribute
 * @param {boolean} matched
 * @return {HTMLDivElement} cardDiv - complete card DOM Node
 */
Board.prototype.createCard = function (cardName, cardId, matched = false) {
    const cardDiv = document.createElement('div'),
        name = document.createElement('h3');
    cardDiv.setAttribute('id', cardId);
    cardDiv.appendChild(name);
    cardDiv.classList.add('card');
    matched ? cardDiv.classList.toggle('matched'): '';
    name.innerText = cardName;
    return cardDiv;
};

/** Shuffles nodes on documentFragment
 * sourced: https://stackoverflow.com/questions/25175798/how-to-shuffle-a-nodelist
 * @return documentFragment list
 */
Board.prototype.shuffleBoard = function (documentFrag) {
    let list = documentFrag;
    for (let i = list.children.length; i >= 0; i--) {
        list.appendChild(list.children[Math.random() * i | 0]);
    }
    return list;
};

/**
 * @description if a valid click, fetches id attribute of card
 * @param {MouseEvent} e - click event from game.js
 * @return {string|boolean} id
 */
Board.prototype.getCardId = function (e) {
    let id;
    if (this.clickCounter === 2) {
        e.stopPropagation();
        return false;
    }
    if (e.target.nodeName === 'H3') {
        id = e.target.parentElement.getAttribute('id');
    } else if (e.target.nodeName === 'DIV') {
        id = e.target.getAttribute('id');
        // make sure it's not the background div
        id = id === 'js-card-container' ? false : id;
    }
    return id;
};

/**
 * @description validates clicks, changes card state
 * @param {string} id
 * @return {boolean|object} cardChange - either false bool, or updated card
 */
Board.prototype.handleClicks = function (id) {
    let cardChange = false;
    this.boardInfo.forEach(card => {
        // skip iteration if card isn't clicked card
        if (id === card.id1 || id === card.id2) {

            // invalidate click if click was a matched card
            if (card.matched) { return false;}

            // invalidate click if same card was clicked
            else if (this.firstClick === id) { return false; }
            // valid click!
            else {
                this.addClick();
                if (this.clickCounter === 1) {
                    this.firstClick = id;
                    this.toggleOpen(id);
                } else if (this.clickCounter === 2) {
                    // increment turn every two valid clicks
                    this.addTurn();
                    this.secondClick = id;
                    cardChange = this.checkMatches();
                }
            }
        } else { return false; }
    });
    return cardChange;
};

/**
 * @description increment click counter
 */
Board.prototype.addClick = function () {
    if (this.clickCounter < 2) {
        this.clickCounter++;
    }
};

/**
 * @description increment board turnCounter, update DOM turn counter
 */
Board.prototype.addTurn = function () {
    this.turnCounter++;
    const moveCounter = document.getElementById('js-moves');
    moveCounter.innerText = this.turnCounter.toString();
    this.checkScore();
};

/**
 * @description used for new game
 */
Board.prototype.resetTurns = function () {
    this.turnCounter = 0;
    this.starCounter = 5;
    const moveCounter = document.getElementById('js-moves');
    moveCounter.innerText = '';
};

/**
 * Update board and DOM star count based on number of turns
 */
Board.prototype.checkScore = function () {
    const stars = document.getElementById('js-stars');
    switch (this.turnCounter) {
        case 12:
            this.starCounter = 4;
            stars.children[4].classList.toggle(this.fullStar);
            stars.children[4].classList.toggle(this.emptyStar);
            break;
        case 14:
            this.starCounter = 3;
            stars.children[3].classList.toggle(this.fullStar);
            stars.children[3].classList.toggle(this.emptyStar);
            break;
        case 16:
            this.starCounter = 2;
            stars.children[2].classList.toggle(this.fullStar);
            stars.children[2].classList.toggle(this.emptyStar);
            break;
        case 19:
            this.starCounter = 1;
            stars.children[1].classList.toggle(this.fullStar);
            stars.children[1].classList.toggle(this.emptyStar);
            break;
    }
};

/**
 * @description returns card object if matching elements were clicked,
 * send Board.incorrectGuess to set timeout if incorrect guess
 * @return {boolean|object} matchedCard
 */
Board.prototype.checkMatches = function () {
    if (this.firstClick.slice(0, -1) === this.secondClick.slice(0, -1)) {
        let matchedCard;
        this.boardInfo.forEach(card => {
            // skip already matched cards
            if (card.matched) { return false; }
            else {
                if (card.id1 === this.firstClick || card.id1 === this.secondClick) {
                    // remove "open" class from first clicked card
                    this.toggleOpen(this.firstClick);
                    card.matched = true;
                    matchedCard = card;
                    this.firstClick = null;
                    this.secondClick = null;
                } else {
                    return false;
                }
            }
        });
        return matchedCard;
    } else {
        this.toggleOpen(this.secondClick);
        // pass context so that Board.incorrectGuess() is not exec on Window in 1.5 secs
        let that = this;
        setTimeout(function() {
            Board.prototype.incorrectGuess(that);
        }, 1500);
    }
};

/**
 * @description Toggles 'open' on incorrectly guessed cards, resets click properties
 * @param that context of instanced Board, for setTimeout
 */
Board.prototype.incorrectGuess = function (that) {
    that.toggleOpen(that.firstClick);
    that.toggleOpen(that.secondClick);
    that.clickCounter = 0;
    that.firstClick = null;
    that.secondClick = null;
};

/**
 * @description adds 'open' class to passed in element id
 * @param {string} element - html id attribute
 */
Board.prototype.toggleOpen = function (element) {
    const open = document.getElementById(element);
    if (open) {
        open.classList.toggle('open');
    }
};

/**
 * @description verifies passed in card object matches board state,
 * updates DOM based on matches or open
 * @param {object} card
 */
Board.prototype.updateBoard = function(card) {
    const card1 = document.getElementById(card.id1),
        card2 = document.getElementById(card.id2);
    if (card.matched) {
        card1.classList.toggle('matched');
        card2.classList.toggle('matched');
        this.clickCounter = 0;
    }
    if (this.clickCounter === 1) {
        if (this.firstClick === card.id1) {
            card1.classList.toggle('open');
        } else if (this.firstClick === card.id2) {
            card2.classList.toggle('open');
        }
    } else if (this.clickCounter === 2) {
        if (this.secondClick === card.id1) {
            card1.classList.toggle('open');
        } else if (this.secondClick === card.id2) {
            card2.classList.toggle('open');
        }
    }

};

/**
 * @description sets value of timer
 * @param {number} val
 */
Board.prototype.setTimer = function(val) {
    this.timer = val;
};

/**
 * @description checks if all of the cards are matched
 * @return {object} winObject - contains win stats
 */
Board.prototype.checkWin = function () {
    let matchedCount = 0,
        win = 8;
    this.boardInfo.forEach(card => {
        card.matched ? ++matchedCount: false;
    });
    if (matchedCount === win) {
        let winObject = {};
        winObject.timeStamp = new Date();
        winObject.stars = this.starCounter;
        winObject.turns = this.turnCounter;
        winObject.cardSet = this.cardSetName;
        winObject.winTime = this.timer;
        return winObject;
    }
};
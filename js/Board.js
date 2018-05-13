"use strict";
const Board = function () {
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
    this.lastBoard = {};
};

Board.prototype.saveGameState = function () {
    return {cards: this.boardInfo, turns: this.turnCounter};
};

Board.prototype.setNewBoardInfo = function () {
    this.setCardSet();

    this.boardInfo[0] = this.cardSetName;

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
    console.log(this.boardInfo);
    return this.boardInfo;
};

Board.prototype.setLastBoardInfo = function (boardInfo) {
    this.boardInfo = boardInfo.cards;
    this.turnCounter = boardInfo.turns;
    return this.boardInfo;
};

Board.prototype.setCardSet = function (optSet = null) {
    if (optSet) {
        this.cardSetName = camelCaseToNormal(optSet);
        this.cardSet = this.cardSets(optSet);
    } else {
        const setIndex = Math.floor(Math.random() * 5);
        const set = this.cardSets.sets[setIndex];
        this.cardSetName = camelCaseToNormal(set);
        this.cardSet = this.cardSets[set];
    }
};

Board.prototype.makeBoardElements = function () {
    const cardBoard = document.createDocumentFragment();
    let cards = this.boardInfo.slice(1),
        elements = [];

    cards.forEach(cardData => {
        const matchedCheck = cardData['matched'] ? 'matched' : false;
        const card1 = this.createCard(cardData['cardNameText'], cardData['id1'], matchedCheck);
        const card2 = this.createCard(cardData['cardNameText'], cardData['id2'], matchedCheck);
        elements.push(card1);
        elements.push(card2);
    });

    console.log(elements);

    elements.forEach(element => {
        cardBoard.appendChild(element);
    });
    // shuffle twice, just to be safe ;)
    return this.shuffleBoard(this.shuffleBoard(cardBoard));
};

Board.prototype.resetBoard = function () {
    this.boardInfo = [];
};

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
 * sourced: https://stackoverflow.com/questions/25175798/how-to-shuffle-a-nodelist?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
 * @param documentFrag
 * @return documentFragment list
 */
Board.prototype.shuffleBoard = function (documentFrag) {
    let list = documentFrag;
    for (let i = list.children.length; i >= 0; i--) {
        list.appendChild(list.children[Math.random() * i | 0]);
    }
    return list;
};

Board.prototype.getCardId = function (e) {
    if (this.clickCounter === 2) {
        e.stopPropagation();
        return false;
    }
    let id;
    console.log('in getCardId');
    if (e.target.nodeName === 'H3') {
        id = e.target.parentElement.getAttribute('id');
    } else if (e.target.nodeName === 'DIV') {
        id = e.target.getAttribute('id');
        id = id === 'js-card-container' ? false : id;
    }
    return id;
};

Board.prototype.handleClicks = function (id) {
    let cardChange = false;
    this.boardInfo.forEach(card => {
        if (id === card.id1 || id === card.id2) {
            console.log('entered 1st con');
            if (card.matched) { return false;}
            else if (this.firstClick === id) { return false; }
            else {
                this.addClick();
                if (this.clickCounter === 1) {
                    this.firstClick = id;
                    this.toggleOpen(id);
                } else if (this.clickCounter === 2) {
                    this.addTurn();
                    // this.clickCounter = 0;
                    this.secondClick = id;
                    cardChange = this.checkMatches();
                }
            }
        } else { return false; }
    });
    return cardChange;
};

Board.prototype.addClick = function () {
    if (this.clickCounter < 2) {
        this.clickCounter++;
    }
};

Board.prototype.addTurn = function () {
    this.turnCounter++;
    const moveCounter = document.getElementById('js-moves');
    moveCounter.innerText = this.turnCounter.toString();
};

// returns card obj if not already matched, else returns false
Board.prototype.checkMatches = function () {
    if (this.firstClick.slice(0, -1) === this.secondClick.slice(0, -1)) {
        let matchedCard = false;
        this.boardInfo.forEach(card => {
            if (card.matched) { return false; }
            else {
                if (card.id1 === this.firstClick || card.id1 === this.secondClick) {
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
        let that = this;
        setTimeout(function() {
            Board.prototype.incorrectGuess(that);
        }, 1500);
    }
};

/**
 * Toggles 'open' on incorrectly guessed cards
 * @param that context of instanced Board, for setTimeout
 */
Board.prototype.incorrectGuess = function (that) {
    that.toggleOpen(that.firstClick);
    that.toggleOpen(that.secondClick);
    that.clickCounter = 0;
    that.firstClick = null;
    that.secondClick = null;
};

Board.prototype.toggleOpen = function (element) {
    console.log('supposedly toggled');
    const open = document.getElementById(element);
    open.classList.toggle('open');
};

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

Board.prototype.debug = function () {
    console.log(this);
};
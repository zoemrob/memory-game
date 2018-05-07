"use strict";
const Board = function () {
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
    // TODO implement a way to append elements to document fragment
};

Board.prototype.resetBoard = function () {
    this.boardInfo = [];
};
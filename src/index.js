const Rx = require('rx');
const $ = require('jquery');
const _ = require('lodash');
const gameBoardTemplate = require('../partials/game-board.handlebars');
const scoreBoardTemplate = require('../partials/score-board.handlebars');


const defaultGameState = { rows: [['', '', ''], ['', '', ''], ['', '', '']], player: 'x' };


// Observable of 'resets'
let $scoreBoard = $('.score-board');
let resets = Rx.Observable.fromEventPattern(
    (h) => $scoreBoard.on('click', '.reset', h),
    (h) => $scoreBoard.off('click', '.reset', h)).startWith({});


// Observable of moves
let $gameBoard = $('.game-board');
let moves = Rx.Observable.fromEventPattern(
    (h) => $gameBoard.on('click', '.square', h),
    (h) => $gameBoard.off('click', '.square', h))

    // Map each square click to a move with position/status information
    .map((click) => {
        let $square = $(click.target);

        return {
            position: $square.data('position'),
            status: $square.data('status')
        };
    });


// Stream of game states
var gameStates = moves

    // Ignore moves made on squares that are already filled
    .filter((move) => !move.status)

    // Update game state as moves come in
    .scan(defaultGameState, (previousState, move) => {
        if (previousState.winner) return previousState;
        
        let newPlayer = previousState.player == 'x' ? 'o' : 'x';
        let newRows  = JSON.parse(JSON.stringify(previousState.rows));
        newRows[move.position.row][move.position.col] = previousState.player;

        return {
            rows: newRows,
            player: newPlayer,
            winner: checkWinner(newRows),
            draw: checkDraw(newRows)
        };
    })
    .startWith(defaultGameState);


// Render as updates come in
resets
    .flatMap(gameStates)
    .subscribe(render);


/**
 * Renders the page.
 */
function render(state) {
    var board = gameBoardTemplate({
        rows: state.rows.map(addPositionData)
    });

    $gameBoard.html(board);

    var score = scoreBoardTemplate({
        winner: state.winner,
        draw: state.draw,
        turn: state.player,
        showReset: state.winner || state.draw
    })

    $scoreBoard.html(score);
}


/**
 * Returns a modified gameState with positional information
 */
function addPositionData(squares, row) {
    return squares
        .map((item, col) => {
            return {
                position: JSON.stringify({ row, col }),
                status: item
            }
    });
}


/**
 * Checks if the current game has ended.
 */
function checkWinner(rows) {
    var allWinningLists = [
        rows,                   // rows
        _.zip(...rows),         // columns
        getDiagonals(rows)      // diagonals
    ];

    return allWinningLists
        .reduce((allLists, lists) => allLists.concat(lists), [])
        .reduce(checkListForWinner, '');
}


/**
 * Checks if the supplied list is a winner. Returns the winner if one has
 * already been decided
 */
function checkListForWinner(winner, list) {
    if (winner) return winner;
    if (list.every(s => s == 'o')) return 'o';
    if (list.every(s => s == 'x')) return 'x';
    return '';
}


/**
 * Returns the two diagonals on the game board.
 */
function getDiagonals(rows) {
    return [
        [rows[0][0], rows[1][1], rows[2][2]],
        [rows[0][2], rows[1][1], rows[2][0]]
    ];
}


/**
 * Checks if each square is filled out
 */
function checkDraw(rows) {
    return rows.every((row) => row.every(status => status));
}

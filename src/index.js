const $ = require('jquery');
const gameBoardTemplate = require('../partials/board.handlebars');

const DefaultGameState = [
  ['x', '', ''],
  ['', 'x', ''],
  ['o', '', '']
];

$('.game-board').html(gameBoardTemplate({ rows: gameInformation(DefaultGameState)}));


/**
 * Returns a modified gameState with some positional information
 */
function gameInformation(gameState) {
  return DefaultGameState
    .map(function (row, rowIndex) {
      return row
        .map(function (item, itemIndex) {
          console.log(item);
          return {
            position: [rowIndex, itemIndex],
            status: item
          }
        });
    });
}

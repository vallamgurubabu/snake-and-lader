import React, { useState } from 'react';
import './App.css'; 
import d1 from './images/dice-six-faces-one.png';
import d2 from './images/dice-six-faces-two.png';
import d3 from './images/dice-six-faces-three.png';
import d4 from './images/dice-six-faces-four.png';
import d5 from './images/dice-six-faces-five.png';
import d6 from './images/dice-six-faces-six.png';
import snakeSound from './sounds/snake-hiss-95241.mp3'
import bgaudio from './sounds/game-music-loop-6-144641.mp3'

function App() {
  const [positions, setPositions] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(1); 
  const [diceRoll, setDiceRoll] = useState(null); 
  const [winner, setWinner] = useState(''); 
  const diceImages = [d1, d2, d3, d4, d5, d6];
  const audio = new Audio(snakeSound);
  const bgm = new Audio(bgaudio);
  const snakes = {
    97: 78,
    95: 56,
    88: 24,
    62: 18,
    48: 26,
    32: 10,
    36: 6,
  };
  const ladders = {
    1: 38,
    4: 14,
    8: 30,
    50: 67,
    21: 42,
    71: 92,
    80: 99,
    28: 76,
  };

  const rollDice = () => {
    if (winner) return;

    const dice = Math.floor(Math.random() * 6) + 1; // Random dice roll between 1 and 6
    setDiceRoll(dice);
    movePlayer(currentPlayer, dice);
  };
 
  const movePlayer = (player, dice) => {
    
    const newPositions = [...positions];
    const playerIndex = player - 1;
    newPositions[playerIndex] += dice;

    // Check for ladders and snakes
    if (ladders[newPositions[playerIndex]]) {
      newPositions[playerIndex] = ladders[newPositions[playerIndex]];
    } else if (snakes[newPositions[playerIndex]]) {
      newPositions[playerIndex] = snakes[newPositions[playerIndex]];
      audio.play();
    }

    // Check for winner (if position 100 or greater)
    if (newPositions[playerIndex] >= 100) {
      bgm.play();
      setWinner(`Player ${player} Wins!`);
    }

    setPositions(newPositions);
    setCurrentPlayer(player === 1 ? 2 : 1); // Switch turn
  };

  const createBoard = () => {
    const cells = [];
    let counter = 100;

    for (let row = 0; row < 10; row++) {
      const rowCells = [];

      // Even rows (left to right)
      if (row % 2 === 0) {
        for (let col = 0; col < 10; col++) {
          rowCells.push(counter--);
        }
      } else {
        // Odd rows (right to left)
        for (let col = 0; col < 10; col++) {
          rowCells.unshift(counter--);
        }
      }
      cells.push(...rowCells);
    }

    return cells;
  };

  const boardCells = createBoard(); // Generate board cells dynamically

  return (
    <div className="App">
      <h1>Snake and Ladder Game</h1>
      <div className="board">
        {boardCells.map((cell, index) => (
          <div key={index} className="cell">
            {/* Display player positions */}
            {positions[0] === cell && (
              <div className="player player1">
                <img
                  src="https://icones.pro/wp-content/uploads/2022/07/icones-d-administration-violet.png"
                  alt="Player 1"
                  className="player-img"
                />
              </div>
            )}
            {positions[1] === cell && (
              <div className="player player2">
                <img
                  src="https://icones.pro/wp-content/uploads/2022/07/icones-d-administration-bleu.png"
                  alt="Player 2"
                  className="player-img"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="game-info">
        <p>Player {currentPlayer}'s Turn</p>
        {winner && <p className="winner">{winner}</p>}
        <div onClick={rollDice} style={{ cursor: 'pointer' }}>
          {diceRoll !== null && (
            <img
              src={diceImages[diceRoll - 1]}
              alt={`Dice ${diceRoll}`}
              style={{ width: '100px', height: '100px' }}
            />
          )}
          <p>Click the dice to roll!</p>
        </div>
      </div>
    </div>
  );
}

export default App;

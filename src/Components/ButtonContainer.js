// ButtonContainer.js
import React from "react";
import {
  generateSudokuMatrix,
  resetBackgroundClasses,
  sudokuSolver,
} from "./../Utils/sudokuUtils";

export default function ButtonContainer({
  CELLS_PER_SUBGRID,
  rawGridData,
  setGridData,
  setRawGridData,
  inputRefs,
}) {
  const runSudokuSolver = () => {
    const copyOfRawGridData = JSON.parse(JSON.stringify(rawGridData));
    if (sudokuSolver(copyOfRawGridData, CELLS_PER_SUBGRID)) {
      setGridData(JSON.parse(JSON.stringify(copyOfRawGridData)));
    }
  };

  const newGame = () => {
    const newGrid = generateSudokuMatrix(CELLS_PER_SUBGRID);
    setRawGridData(newGrid);
    setGridData(JSON.parse(JSON.stringify(newGrid)));
    resetBackgroundClasses(inputRefs);
  };

  const restartGame = () => {
    setGridData(JSON.parse(JSON.stringify(rawGridData)));
    resetBackgroundClasses(inputRefs);
  };

  return (
    <div id="button-container">
      <button onClick={runSudokuSolver} id="solve-btn">
        Solve Sudoku
      </button>
      <button onClick={newGame} id="new-game-btn">
        New Game
      </button>
      <button onClick={restartGame} id="restart-btn">
        Restart
      </button>
    </div>
  );
}

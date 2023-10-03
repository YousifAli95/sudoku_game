import React from "react";
import {
  generateSudokuMatrix,
  resetBackgroundClasses,
  sudokuSolver,
} from "./../Utils/sudokuUtils";
import { startTimer } from "../Utils/timerChartUtils";

export default function ButtonContainer({
  CELLS_PER_SUBGRID,
  rawGridData,
  setGridData,
  setRawGridData,
  inputRefs,
  setTimer,
  timer,
  TIMER_KEY,
}) {
  const runSudokuSolver = () => {
    clearInterval(timer.intervalId);
    const copyOfRawGridData = JSON.parse(JSON.stringify(rawGridData));
    if (sudokuSolver(copyOfRawGridData, CELLS_PER_SUBGRID)) {
      setGridData(JSON.parse(JSON.stringify(copyOfRawGridData)));
    }
  };

  const newGame = () => {
    restartTimer();
    const newGrid = generateSudokuMatrix(CELLS_PER_SUBGRID);
    setRawGridData(newGrid);
    setGridData(JSON.parse(JSON.stringify(newGrid)));
    resetBackgroundClasses(inputRefs);
  };

  const restartGame = () => {
    restartTimer();
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

  function restartTimer() {
    clearInterval(timer.intervalId);
    localStorage.removeItem(TIMER_KEY);
    setTimer((prevTimer) => ({ minutes: 0, seconds: 0, isPaused: false }));
    startTimer(setTimer, TIMER_KEY);
  }
}

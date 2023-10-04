import React from "react";
import {
  generateSudokuMatrix,
  resetBackgroundClasses,
  sudokuSolver,
} from "./../Utils/sudokuUtils";
import { startTimer } from "../Utils/timerChartUtils";

import "./CSS/buttonContainer.css";
import { useSudokuContext } from "../SudokuContext";

export default function ButtonContainer({ CELLS_PER_SUBGRID }) {
  const {
    rawGridData,
    setGridData,
    setRawGridData,
    inputRefs,
    setTimer,
    timer,
    TIMER_KEY,
    setIsSudokuSolved,
    isSudokuSolved,
    setOpenModals,
  } = useSudokuContext();

  const runSudokuSolver = () => {
    if (isSudokuSolved)
      setOpenModals((prevstate) => ({ ...prevstate, finishedModal: true }));
    clearInterval(timer.intervalId);
    const copyOfRawGridData = JSON.parse(JSON.stringify(rawGridData));
    if (sudokuSolver(copyOfRawGridData, CELLS_PER_SUBGRID)) {
      setGridData(JSON.parse(JSON.stringify(copyOfRawGridData)));
    }
  };

  const newGame = () => {
    restartTimer();
    setIsSudokuSolved(false);
    const newGrid = generateSudokuMatrix(CELLS_PER_SUBGRID);
    setRawGridData(newGrid);
    setGridData(JSON.parse(JSON.stringify(newGrid)));
    resetBackgroundClasses(inputRefs);
  };

  const restartGame = () => {
    restartTimer();
    setIsSudokuSolved(false);
    setGridData(JSON.parse(JSON.stringify(rawGridData)));
    resetBackgroundClasses(inputRefs);
  };

  function restartTimer() {
    clearInterval(timer.intervalId);
    localStorage.removeItem(TIMER_KEY);
    setTimer((prevTimer) => ({ minutes: 0, seconds: 0, isPaused: false }));
    startTimer(setTimer, TIMER_KEY);
  }

  return (
    <div id="button-container">
      <button onClick={runSudokuSolver} id="solve-btn">
        {isSudokuSolved ? "See scoreboard" : "Solve with AI"}
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

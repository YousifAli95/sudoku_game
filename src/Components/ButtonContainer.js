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
    openModals,
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

  const openInformationModal = (message, method) => {
    // Setting the information model isOpen property to true in order to open the modal
    // Sets a method delegate that the informationModal component can invoke
    setOpenModals((prevstate) => ({
      ...prevstate,
      informationModal: { isOpen: true, text: message, method: method },
    }));
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
    <div className="button-container">
      <button
        id="solve-btn"
        onClick={() => {
          const message =
            "Are you sure that you want to let the AI solve this puzzle for you? You should know that the AI is humble and will give you the credit for solving this puzzle.";
          openInformationModal(message, runSudokuSolver);
        }}
      >
        {isSudokuSolved ? "See scoreboard" : "Solve with AI"}
      </button>
      <button
        id="new-game-btn"
        onClick={() => {
          const message =
            "Are you sure that you want to start a new game. Doing so will give you a new sudoku puzzle and your progress with this sudoku puzzle will be lost.";
          openInformationModal(message, newGame);
        }}
      >
        New Game
      </button>
      <button
        id="restart-btn"
        onClick={() => {
          const message =
            "Are you sure that you want to restart? Doing so will give remove your progress with this sudoku puzzleand your timer will be reset";
          openInformationModal(message, restartGame);
        }}
      >
        Restart
      </button>
    </div>
  );
}

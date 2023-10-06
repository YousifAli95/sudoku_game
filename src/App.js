// App.js
import React, { useState, useRef } from "react";
import "./App.css";
import SudokuGrid from "./Components/SudokuGrid";
import ButtonContainer from "./Components/ButtonContainer";
import { resetBackgroundClasses } from "./Utils/sudokuUtils";
import TimerElement from "./Components/TimerElement";
import PauseOverlay from "./Components/PauseOverlay";
import InformationModal from "./Components/InformationModal";
import { useSudokuContext } from "./SudokuContext";
import DifficultySelector from "./Components/DifficultySelector";

const CELLS_PER_SUBGRID = 9;
const SUBGRIDS_PER_AXIS = Math.floor(Math.sqrt(CELLS_PER_SUBGRID));

export default function App() {
  const {
    timer,
    setTimer,
    inputRefs,
    gridData,
    setGridData,
    copyOfGridData,
    setCopyOfGridData,
  } = useSudokuContext();

  const [timeResultArray, setTimeResultArray] = useState([]);
  const newGameButtonRef = useRef();

  // Hides all grid values if the timer will be paused
  const timerPauseHandler = () => {
    if (!timer.isPaused) {
      // Create a an empty grid
      const emptyGrid = Array.from({ length: CELLS_PER_SUBGRID }, () =>
        Array(CELLS_PER_SUBGRID).fill(null)
      );

      // Saving a copy of the previous gridData and replacing the gridData with an empty grid
      setCopyOfGridData(JSON.parse(JSON.stringify(gridData)));
      setGridData(emptyGrid);

      resetBackgroundClasses(inputRefs);
    } else {
      // Returns the grid values if the timer will be unpaused
      setGridData(JSON.parse(JSON.stringify(copyOfGridData)));
    }

    // Pauses and unpauses the timer
    setTimer((prevTimer) => ({ ...prevTimer, isPaused: !prevTimer.isPaused }));
  };

  return (
    <>
      <header>
        <a href="/">Yousifs Sudoku Game</a>
      </header>
      <main>
        <InformationModal timeResultArray={timeResultArray} />
        <div className="above-grid-container">
          <DifficultySelector newGameButtonRef={newGameButtonRef} />
          <TimerElement
            timerPauseHandler={timerPauseHandler}
            newGameButtonRef={newGameButtonRef}
          />
        </div>
        <div id="pause-overlay-wrapper">
          <PauseOverlay timerPauseHandler={timerPauseHandler} />
          <SudokuGrid
            CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
            SUBGRIDS_PER_AXIS={SUBGRIDS_PER_AXIS}
            setTimeResultArray={setTimeResultArray}
            timeResultArray={timeResultArray}
          />
        </div>
        <ButtonContainer
          CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
          newGameButtonRef={newGameButtonRef}
        />
      </main>
    </>
  );
}

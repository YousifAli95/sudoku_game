// App.js
import React, { useEffect } from "react";
import "./App.css";
import SudokuGrid from "./Components/SudokuGrid";
import { useState, useRef } from "react";
import ButtonContainer from "./Components/ButtonContainer";
import { resetBackgroundClasses } from "./Utils/sudokuUtils";
import TimerElement from "./Components/TimerElement";
import PauseOverlay from "./Components/PauseOverlay";
import FinishedModal from "./Components/FinishedModal";

const CELLS_PER_SUBGRID = 9;
const SUBGRIDS_PER_AXIS = Math.floor(Math.sqrt(CELLS_PER_SUBGRID));
const TIMER_KEY = "sudokuTimer";
const HIDE_CLASS = "hide";

function App() {
  const [isSudokuSolved, setIsSudokuSolved] = useState(false);
  const [timeResultArray, setTimeResultArray] = useState([]);
  const [openModals, setOpenModals] = useState({ finishedModal: false });
  const [gridData, setGridData] = useState([]);
  const [rawGridData, setRawGridData] = useState([]);
  const [copyOfGridData, setCopyOfGridData] = useState([]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState({
    minutes: 0,
    seconds: 0,
    intervalId: null,
    isPaused: false,
  });

  const timerPauseHandler = () => {
    if (!timer.isPaused) {
      // Hides all grid values if the timer will be paused
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
        <FinishedModal
          openModals={openModals}
          setOpenModals={setOpenModals}
          timeResultArray={timeResultArray}
        />
        <TimerElement
          timer={timer}
          HIDE_CLASS={HIDE_CLASS}
          timerPauseHandler={timerPauseHandler}
          setTimer={setTimer}
          TIMER_KEY={TIMER_KEY}
        />
        <div id="pause-overlay-wrapper">
          <PauseOverlay
            HIDE_CLASS={HIDE_CLASS}
            timer={timer}
            timerPauseHandler={timerPauseHandler}
          />
          <SudokuGrid
            gridData={gridData}
            setGridData={setGridData}
            rawGridData={rawGridData}
            setRawGridData={setRawGridData}
            inputRefs={inputRefs}
            CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
            SUBGRIDS_PER_AXIS={SUBGRIDS_PER_AXIS}
            setOpenModals={setOpenModals}
            timer={timer}
            setTimeResultArray={setTimeResultArray}
            timeResultArray={timeResultArray}
            TIMER_KEY={TIMER_KEY}
            isSudokuSolved={isSudokuSolved}
            setIsSudokuSolved={setIsSudokuSolved}
          />
        </div>
        <ButtonContainer
          setTimer={setTimer}
          setGridData={setGridData}
          rawGridData={rawGridData}
          setRawGridData={setRawGridData}
          timerPauseHandler={timerPauseHandler}
          TIMER_KEY={TIMER_KEY}
          CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
          inputRefs={inputRefs}
          timer={timer}
          setOpenModals={setOpenModals}
          isSudokuSolved={isSudokuSolved}
          setIsSudokuSolved={setIsSudokuSolved}
        />
      </main>
    </>
  );
}

export default App;

// App.js
import React, { useEffect } from "react";
import "./App.css";
import SudokuGrid from "./Components/SudokuGrid";
import { useState, useRef } from "react";
import ButtonContainer from "./Components/ButtonContainer";
import { resetBackgroundClasses } from "./Utils/sudokuUtils";

const CELLS_PER_SUBGRID = 9;
const SUBGRIDS_PER_AXIS = Math.floor(Math.sqrt(CELLS_PER_SUBGRID));
const TIMER_KEY = "sudokuTimer";
const TIME_RESULT_KEY = "timeResult";
const HIDE_CLASS = "hide";

function App() {
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

  useEffect(() => {
    // Initialize timeObject
    const timerObjectJSON = localStorage.getItem(TIMER_KEY);
    const loadedTimer = timerObjectJSON
      ? JSON.parse(timerObjectJSON)
      : { seconds: 0, minutes: 0 };
    setTimer((prevTimer) => ({
      ...prevTimer,
      seconds: loadedTimer.seconds,
      minutes: loadedTimer.minutes,
    }));

    // Updates the timer object every seconds
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (!prevTimer.isPaused) {
          const newSeconds = (prevTimer.seconds + 1) % 60;
          const newMinutes =
            prevTimer.minutes + Math.floor((prevTimer.seconds + 1) / 60);

          // Every 10 second store the timer object in local storage
          if (newSeconds % 10 === 0)
            localStorage.setItem(
              TIMER_KEY,
              JSON.stringify({ seconds: newSeconds, minutes: newMinutes })
            );
          return {
            ...prevTimer,
            seconds: newSeconds,
            minutes: newMinutes,
          };
        }

        return prevTimer; // If paused, return the current state without changes
      });
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
      // Clear the interval when the component unmounts to prevent memory leaks
      clearInterval(intervalId);
    };
  }, []);

  const pauseAndUnpauseTimer = () => {
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
        <div className="above-grid-container">
          <div
            onClick={pauseAndUnpauseTimer}
            id="timer-wrapper"
            className="timer-wrapper"
          >
            <span id="timer" className="timer">
              {timer.minutes}:{timer.seconds.toString().padStart(2, "0")}
            </span>
            <div className="timer-pause">
              <div
                className={`icon icon-pause ${
                  timer.isPaused ? HIDE_CLASS : ""
                }`}
              ></div>
              <div
                className={`icon icon-play ${timer.isPaused ? "" : HIDE_CLASS}`}
              ></div>
            </div>
          </div>
        </div>
        <div id="pause-overlay-wrapper">
          <div
            onClick={pauseAndUnpauseTimer}
            id="pause-overlay"
            className={`pause-overlay ${timer.isPaused ? "" : HIDE_CLASS}`}
          >
            <div id="pause-svg-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-play-big"
                viewBox="0 0 60 60"
              >
                <g fill="none" fillRule="evenodd">
                  <circle cx="30" cy="30" r="30" fill="#0072E3"></circle>
                  <path
                    fill="#FFF"
                    d="M39.12 31.98l-12.56 8.64a2.4 2.4 0 01-3.76-1.98V21.36a2.4 2.4 0 013.76-1.97l12.56 8.63a2.4 2.4 0 010 3.96z"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
          <SudokuGrid
            gridData={gridData}
            setGridData={setGridData}
            rawGridData={rawGridData}
            setRawGridData={setRawGridData}
            inputRefs={inputRefs}
            CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
            SUBGRIDS_PER_AXIS={SUBGRIDS_PER_AXIS}
            isPaused={timer.isPaused}
          />
        </div>
        <ButtonContainer
          setTimer={setTimer}
          setGridData={setGridData}
          rawGridData={rawGridData}
          setRawGridData={setRawGridData}
          CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
          inputRefs={inputRefs}
        />
      </main>
    </>
  );
}

export default App;

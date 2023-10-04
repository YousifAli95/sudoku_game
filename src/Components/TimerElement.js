import React, { useEffect } from "react";
import { startTimer } from "../Utils/timerChartUtils";

import "./CSS/timerElement.css";

export default function TimerElement({
  timer,
  setTimer,
  timerPauseHandler,
  HIDE_CLASS,
  TIMER_KEY,
}) {
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
    startTimer(setTimer, TIMER_KEY);

    return () => {
      // Clear the interval when the component unmounts to prevent memory leaks
      clearInterval(timer.intervalId);
    };
  }, []);

  return (
    <div className="above-grid-container">
      <div
        onClick={timerPauseHandler}
        id="timer-wrapper"
        className="timer-wrapper"
      >
        <span id="timer" className="timer">
          {timer.minutes}:{timer.seconds.toString().padStart(2, "0")}
        </span>
        <div className="timer-pause">
          <div
            className={`icon icon-pause ${timer.isPaused ? HIDE_CLASS : ""}`}
          ></div>
          <div
            className={`icon icon-play ${timer.isPaused ? "" : HIDE_CLASS}`}
          ></div>
        </div>
      </div>
    </div>
  );
}

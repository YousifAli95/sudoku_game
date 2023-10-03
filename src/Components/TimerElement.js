import React, { useEffect } from "react";

const TIMER_KEY = "sudokuTimer";

export default function TimerElement({
  timer,
  setTimer,
  pauseAndUnpauseTimer,
  HIDE_CLASS,
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

  return (
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

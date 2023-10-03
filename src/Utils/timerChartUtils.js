export function startTimer(setTimer, TIMER_KEY) {
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

  setTimer((prevTimer) => ({ ...prevTimer, intervalId }));
}

import { Chart } from "chart.js/auto";
import ConfettiGenerator from "confetti-js";

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

export function configureTimeChart(setChart, timeChartRef, data) {
  setChart(
    new Chart(timeChartRef.current, {
      type: "bar",
      data: data,
      options: {
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
            beginAtZero: true,
            title: {
              display: true,
              text: "Frequency",
            },
          },
          x: {
            title: {
              display: true,
              text: "Minute",
            },
          },
        },
      },
    })
  );
}

export function getTimeResultCountDictionary(timeResultArray) {
  const counts = {};

  timeResultArray.forEach((number) => {
    if (counts[number]) {
      counts[number]++;
    } else {
      counts[number] = 1;
    }
  });
  return counts;
}

export function configureConfetti(dialogRef, confettiRef) {
  // Calculate the width and height of the parent element

  const parentWidth = dialogRef.current.clientWidth;
  const parentHeight = dialogRef.current.clientHeight;

  const confettiSettings = {
    target: confettiRef.current,
    rotate: true,
    width: parentWidth,
    height: parentHeight,
    max: 100,
  };

  var confetti = new ConfettiGenerator(confettiSettings);
  return confetti;
}

export function getChartDataObject(counts) {
  // Extract unique numbers and their counts

  const uniqueNumbers = Object.keys(counts).map(Number);
  const frequencyCounts = Object.values(counts);

  var data = {
    labels: uniqueNumbers,
    datasets: [
      {
        label: "Frequency",
        data: frequencyCounts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1, // Customize the border width
      },
    ],
  };
  return data;
}

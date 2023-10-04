import React, { useEffect, useRef, useState } from "react";
import {
  getTimeResultCountDictionary,
  configureTimeChart,
  configureConfetti,
  getChartDataObject,
} from "../Utils/timerChartUtils";

export default function FinishedModal({
  openModals,
  setOpenModals,
  timeResultArray,
}) {
  const dialogRef = useRef();
  const confettiRef = useRef();
  const timeChartRef = useRef();
  const [chart, setChart] = useState();

  useEffect(() => {
    if (openModals.finishedModal) {
      dialogRef.current?.showModal();
      const confetti = configureConfetti(dialogRef, confettiRef);
      confetti.render();

      // Schedule the clearing of confetti after 4 seconds
      setTimeout(function () {
        confetti.clear();
      }, 4000); // 4000 milliseconds = 4 seconds

      const counts = getTimeResultCountDictionary(timeResultArray);

      const data = getChartDataObject(counts);

      configureTimeChart(setChart, timeChartRef, data);
    } else {
      chart?.destroy();
      dialogRef.current?.close();
    }
  }, [openModals]);

  const closeModal = () => {
    console.log("close");
    setOpenModals((prevState) => ({
      ...prevState,
      finishedModal: false,
    }));
  };

  return (
    <dialog ref={dialogRef} id="finished-modal">
      <div className="modal-close-btn-wrapper">
        <button className="modal-close-btn" onClick={closeModal}>
          x
        </button>
      </div>
      <canvas ref={confettiRef} id="confetti-canvas"></canvas>
      <h1 id="finished-h1">Great Job! You solved the Sudoku puzzle! :)</h1>
      <canvas ref={timeChartRef} id="time-chart"></canvas>
    </dialog>
  );
}
import { useRef, useEffect, useState } from "react";
import { useSudokuContext } from "./../SudokuContext";
import "./CSS/informationModal.css";
import {
  getTimeResultCountDictionary,
  configureTimeChart,
  configureConfetti,
  getChartDataObject,
} from "../Utils/timerChartUtils";

export default function InformationModal({ timeResultArray }) {
  const {
    informationModal,
    setInformationModal,
    isSudokuSolved,
    setIsSudokuSolved,
    modalMode,
  } = useSudokuContext();
  const dialogRef = useRef();
  const confettiRef = useRef();
  const timeChartRef = useRef();
  const [chart, setChart] = useState();

  // Closes/opens the modal  depending on the isOpen property
  useEffect(() => {
    if (informationModal?.isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [informationModal]);

  const closeModal = () => {
    setInformationModal(() => ({
      isOpen: false,
    }));
  };

  const runModalMethod = () => {
    // Invoking the method that is stored in the informationModal object
    informationModal.method();

    closeModal();
  };

  useEffect(() => {
    if (informationModal.modalMode === modalMode.scoreboard) {
      const counts = getTimeResultCountDictionary(timeResultArray);

      const data = getChartDataObject(counts);

      configureTimeChart(setChart, timeChartRef, data);
      if (!isSudokuSolved) {
        setIsSudokuSolved(true);
        const confetti = configureConfetti(dialogRef, confettiRef);
        confetti.render();

        // Schedule the clearing of confetti after 4 seconds
        setTimeout(function () {
          confetti.clear();
        }, 4000); // 4000 milliseconds = 4 seconds
      }
    } else {
      chart?.destroy();
    }
  }, [informationModal?.modalMode]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-close-btn-wrapper">
        <button className="modal-close-btn" onClick={closeModal}>
          x
        </button>
      </div>
      {informationModal.modalMode === modalMode.information && (
        <>
          <p id="information-p">{informationModal?.text}</p>
          <div
            id="information-modal-btn-container"
            className="button-container"
          >
            <button onClick={runModalMethod}>Yes</button>
            <button onClick={closeModal}>No</button>
          </div>
        </>
      )}
      {informationModal.modalMode === modalMode.scoreboard && (
        <>
          <canvas ref={confettiRef} id="confetti-canvas"></canvas>
          <h1 id="finished-h1">
            Great Job! You solved the Sudoku puzzle! &#128512;
          </h1>
          <canvas ref={timeChartRef} id="time-chart"></canvas>
        </>
      )}
    </dialog>
  );
}

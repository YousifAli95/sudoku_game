import { useRef, useEffect } from "react";
import { useSudokuContext } from "./../SudokuContext";
import "./CSS/informationModal.css";

export default function InformationModal() {
  const dialogRef = useRef();
  const { openModals, setOpenModals } = useSudokuContext();

  // Closes/opens the modal  depending on the isOpen property
  useEffect(() => {
    if (openModals.informationModal?.isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [openModals.informationModal]);

  const closeModal = () => {
    console.log("close");
    setOpenModals((prevState) => ({
      ...prevState,
      informationModal: { isOpen: false },
    }));
  };

  const setRunMethod = () => {
    // Invoking the method that is stored in the informationModal object
    openModals.informationModal.method();

    // Close the modal
    setOpenModals((prevState) => ({
      ...prevState,
      informationModal: {
        isOpen: false,
      },
    }));
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-close-btn-wrapper">
        <button className="modal-close-btn" onClick={closeModal}>
          x
        </button>
      </div>
      <p id="information-p">{openModals.informationModal?.text}</p>
      <div id="information-modal-btn-container" className="button-container">
        <button onClick={setRunMethod}>Yes</button>
        <button onClick={closeModal}>No</button>
      </div>
    </dialog>
  );
}

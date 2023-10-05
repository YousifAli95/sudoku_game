// GameContext.js
import React, { createContext, useContext, useState, useRef } from "react";

const SudokuContext = createContext();

export function useSudokuContext() {
  return useContext(SudokuContext);
}
const TIMER_KEY = "sudokuTimer";
const HIDE_CLASS = "hide";
const modalMode = { scoreboard: "scoreboard", information: "information" };
export function SudokuContextProvider({ children }) {
  const [gridData, setGridData] = useState([]);
  const [rawGridData, setRawGridData] = useState([]);
  const [copyOfGridData, setCopyOfGridData] = useState([]);
  const [isSudokuSolved, setIsSudokuSolved] = useState(false);
  const [informationModal, setInformationModal] = useState({
    finishedModal: false,
  });
  const [newGameConfirmed, setNewGameConfirmed] = useState(false);
  const [restartGameConfirmed, setrestartGameConfirmed] = useState(false);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState({
    minutes: 0,
    seconds: 0,
    intervalId: null,
    isPaused: false,
  });

  const contextValues = {
    gridData,
    setGridData,
    rawGridData,
    setRawGridData,
    copyOfGridData,
    setCopyOfGridData,
    isSudokuSolved,
    setIsSudokuSolved,
    informationModal,
    setInformationModal,
    inputRefs,
    timer,
    setTimer,
    HIDE_CLASS,
    TIMER_KEY,
    newGameConfirmed,
    setNewGameConfirmed,
    restartGameConfirmed,
    setrestartGameConfirmed,
    modalMode,
  };

  return (
    <SudokuContext.Provider value={contextValues}>
      {children}
    </SudokuContext.Provider>
  );
}

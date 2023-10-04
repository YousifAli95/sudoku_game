// GameContext.js
import React, { createContext, useContext, useState, useRef } from "react";

const SudokuContext = createContext();

export function useSudokuContext() {
  return useContext(SudokuContext);
}
const TIMER_KEY = "sudokuTimer";
const HIDE_CLASS = "hide";

export function SudokuContextProvider({ children }) {
  const [gridData, setGridData] = useState([]);
  const [rawGridData, setRawGridData] = useState([]);
  const [copyOfGridData, setCopyOfGridData] = useState([]);
  const [isSudokuSolved, setIsSudokuSolved] = useState(false);
  const [openModals, setOpenModals] = useState({ finishedModal: false });
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
    openModals,
    setOpenModals,
    inputRefs,
    timer,
    setTimer,
    HIDE_CLASS,
    TIMER_KEY,
  };

  return (
    <SudokuContext.Provider value={contextValues}>
      {children}
    </SudokuContext.Provider>
  );
}
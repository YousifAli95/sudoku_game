// SudokuGrid.js
import React, { useEffect, useState } from "react";
import {
  generateSudokuMatrix,
  isValid,
  updateBackgroundClasses,
} from ".././Utils/sudokuUtils";

const EDITED_SUDOKU_MATRIX_KEY = "editedSudokuMatrix";
const ORIGINAL_SUDOKU_MATRIX_KEY = "originalSudokuMatrix";
const TIME_RESULT_KEY = "timeResult";

export default function SudokuGrid({
  gridData,
  setGridData,
  rawGridData,
  setRawGridData,
  inputRefs,
  SUBGRIDS_PER_AXIS,
  CELLS_PER_SUBGRID,
  setOpenModals,
  timer,
  setTimeResultArray,
  timeResultArray,
}) {
  const [isSudokuSolved, setIsSudokuSolved] = useState(false);
  // Set the gridData by getting it from either local storage or generating a new sudoku grid
  useEffect(() => {
    const rawGridDataJSON = localStorage.getItem(ORIGINAL_SUDOKU_MATRIX_KEY);
    if (rawGridDataJSON) {
      setRawGridData(JSON.parse(rawGridDataJSON));

      const gridDataJSON = localStorage.getItem(EDITED_SUDOKU_MATRIX_KEY);
      const gridData = gridDataJSON
        ? JSON.parse(gridDataJSON)
        : JSON.parse(rawGridDataJSON);

      setGridData(gridData);
    } else {
      const initialData = generateSudokuMatrix(CELLS_PER_SUBGRID);
      setGridData(initialData);
      setRawGridData(JSON.parse(JSON.stringify(initialData)));
    }

    const timeResultJSON = localStorage.getItem(TIME_RESULT_KEY);
    if (timeResultJSON) setTimeResultArray(JSON.parse(timeResultJSON));
  }, []);

  useEffect(() => {
    if (gridData && !timer.isPaused)
      localStorage.setItem(EDITED_SUDOKU_MATRIX_KEY, JSON.stringify(gridData));
    if (isSodukuSolved(gridData)) {
      localStorage.removeItem(EDITED_SUDOKU_MATRIX_KEY);
      localStorage.removeItem(ORIGINAL_SUDOKU_MATRIX_KEY);
      setIsSudokuSolved(true);
      setOpenModals((prevState) => ({ ...prevState, finishedModal: true }));
      localStorage.setItem(TIME_RESULT_KEY, JSON.stringify(timeResultArray));
      setTimeResultArray((prevState) => [...prevState, timer.minutes]);
      console.log("solved");
    }
  }, [gridData]);

  useEffect(() => {
    if (timeResultArray && timeResultArray.length > 0)
      localStorage.setItem(TIME_RESULT_KEY, JSON.stringify(timeResultArray));
  }, [timeResultArray]);

  useEffect(() => {
    if (rawGridData)
      localStorage.setItem(
        ORIGINAL_SUDOKU_MATRIX_KEY,
        JSON.stringify(rawGridData)
      );
  }, [rawGridData]);

  const handleInput = (rowIndex, colIndex, value) => {
    inputRefs.current[rowIndex][colIndex].value = "";

    // Take only the last character if length is greater than 1
    if (value.length > 1) {
      value = value.slice(-1); // Take the last character
    }

    // Disallow specific characters that input type number allows per default
    const disallowedCharacters = ["0", "e", ",", "."];

    // Check if the entered character is allowed
    if (!disallowedCharacters.includes(value)) {
      // Update the grid data based on input changes
      const newData = [...gridData];
      newData[rowIndex][colIndex] = value;
      const { errorCoordinates } = isValid(
        gridData,
        rowIndex,
        colIndex,
        value,
        CELLS_PER_SUBGRID
      );
      setGridData(newData);
      updateBackgroundClasses(
        value,
        rowIndex,
        colIndex,
        inputRefs,
        CELLS_PER_SUBGRID,
        SUBGRIDS_PER_AXIS,
        errorCoordinates
      );
    }
  };

  const handleArrowKey = (event, rowIndex, colIndex) => {
    const handledArrowKeys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ];

    if (handledArrowKeys.includes(event.key)) event.preventDefault();

    let newRow = rowIndex;
    let newCol = colIndex;

    if (event.key === "ArrowUp") {
      newRow = Math.max(0, newRow - 1);
    } else if (event.key === "ArrowDown") {
      newRow = Math.min(CELLS_PER_SUBGRID - 1, newRow + 1);
    } else if (event.key === "ArrowLeft") {
      newCol = Math.max(0, newCol - 1);
    } else if (event.key === "ArrowRight") {
      newCol = Math.min(CELLS_PER_SUBGRID - 1, newCol + 1);
    }
    const newInputBox = inputRefs.current[newRow][newCol];
    newInputBox.focus();

    updateBackgroundClasses(
      newInputBox.value,
      newRow,
      newCol,
      inputRefs,
      CELLS_PER_SUBGRID,
      SUBGRIDS_PER_AXIS
    );
  };

  function isSodukuSolved(gridData) {
    const gridDataCopy = JSON.parse(JSON.stringify(gridData));
    if (gridDataCopy && gridDataCopy.length >= 1) {
      for (let i = 0; i < CELLS_PER_SUBGRID; i++) {
        for (let j = 0; j < CELLS_PER_SUBGRID; j++) {
          // Save the current value
          const value = gridDataCopy[i][j];
          //If there is no value then sudoku is not solved
          if (!value) return false;
          // Temporarily sets this gridcell to null
          gridDataCopy[i][j] = null;
          // Check if it's allowed to put the current value where it is
          const result = isValid(gridDataCopy, i, j, value);
          // Put the value bakck
          gridDataCopy[i][j] = value;
          // if not valid then return false
          if (!result.isValid) return false;
        }
      }
      return true;
    } else return false;
  }

  return (
    <div id="sudoku-grid">
      {gridData.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          let rowClass = "";
          if (rowIndex % SUBGRIDS_PER_AXIS === 0)
            rowClass = "subgrid-first-row";
          else if (rowIndex % SUBGRIDS_PER_AXIS === 2)
            rowClass = "subgrid-last-row";
          return (
            <input
              key={`${rowIndex}, ${colIndex}`}
              type="number"
              readOnly={
                rawGridData[rowIndex][colIndex] || isSudokuSolved ? true : false
              }
              className={`input-box ${rowClass}`}
              onInput={(e) => handleInput(rowIndex, colIndex, e.target.value)}
              value={value !== null ? value : ""}
              onKeyDown={(e) => handleArrowKey(e, rowIndex, colIndex)}
              onFocus={(e) =>
                updateBackgroundClasses(
                  e.target.value,
                  rowIndex,
                  colIndex,
                  inputRefs,
                  CELLS_PER_SUBGRID,
                  SUBGRIDS_PER_AXIS
                )
              }
              ref={(input) => {
                if (!inputRefs.current[rowIndex]) {
                  inputRefs.current[rowIndex] = [];
                }
                inputRefs.current[rowIndex][colIndex] = input;
              }}
            />
          );
        })
      )}
    </div>
  );
}

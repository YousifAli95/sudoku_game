// SudokuGrid.js
import React, { useEffect, useRef, useState } from "react";
import {
  generateSudokuMatrix,
  isValid,
  updateBackgroundClasses,
} from ".././Utils/sudokuUtils";

const CELLS_PER_SUBGRID = 9;
const SUBGRIDS_PER_AXIS = Math.floor(Math.sqrt(CELLS_PER_SUBGRID));

export default function SudokuGrid() {
  const [gridData, setGridData] = useState([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    const initialData = generateSudokuMatrix(CELLS_PER_SUBGRID);
    setGridData(initialData);
  }, []);

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

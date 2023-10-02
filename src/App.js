import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import { generateSudokuMatrix } from "./Utils/sudokuUtils";

const CELLS_PER_SUBGRID = 9;
const SUBGRIDS_PER_AXIS = Math.floor(Math.sqrt(CELLS_PER_SUBGRID));

function App() {
  const [gridData, setGridData] = useState([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Initialize gridData with empty values when the component is mounted
    const initialData = generateSudokuMatrix(CELLS_PER_SUBGRID);
    setGridData(initialData);
  }, [CELLS_PER_SUBGRID]);

  const handleInput = (row, col, value) => {
    if (value.slice(-1) == "") return;

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
      newData[row][col] = value;
      setGridData(newData);
      console.log(gridData);
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

    inputRefs.current[newRow][newCol].focus();
  };

  return (
    <>
      <div id="sudoku-grid">
        {gridData.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            let rowClass = "";
            if (rowIndex % SUBGRIDS_PER_AXIS == 0)
              rowClass = "subgrid-first-row";
            else if (rowIndex % SUBGRIDS_PER_AXIS == 2)
              rowClass = "subgrid-last-row";
            return (
              <input
                key={`${rowIndex}, ${colIndex}`}
                type="number"
                className={`input-box ${rowClass}`}
                onInput={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                value={value !== null ? value : ""}
                onKeyDown={(e) => handleArrowKey(e, rowIndex, colIndex)}
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
    </>
  );
}

export default App;

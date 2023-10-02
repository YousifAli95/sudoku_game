// App.js
import React from "react";
import "./App.css";
import SudokuGrid from "./Components/SudokuGrid";
import { useState, useRef } from "react";
import ButtonContainer from "./Components/ButtonContainer";

const CELLS_PER_SUBGRID = 9;
const SUBGRIDS_PER_AXIS = Math.floor(Math.sqrt(CELLS_PER_SUBGRID));

function App() {
  const [gridData, setGridData] = useState([]);
  const [rawGridData, setRawGridData] = useState([]);
  const inputRefs = useRef([]);

  return (
    <>
      <header>
        <a href="/">Yousifs Sudoku Game</a>
      </header>
      <main>
        <SudokuGrid
          gridData={gridData}
          setGridData={setGridData}
          rawGridData={rawGridData}
          setRawGridData={setRawGridData}
          inputRefs={inputRefs}
          CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
          SUBGRIDS_PER_AXIS={SUBGRIDS_PER_AXIS}
        />
        <ButtonContainer
          setGridData={setGridData}
          rawGridData={rawGridData}
          setRawGridData={setRawGridData}
          CELLS_PER_SUBGRID={CELLS_PER_SUBGRID}
          inputRefs={inputRefs}
        />
      </main>
    </>
  );
}

export default App;

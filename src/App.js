// App.js
import React from "react";
import "./App.css";
import SudokuGrid from "./Components/SudokuGrid";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SudokuGrid />
      </header>
    </div>
  );
}

export default App;

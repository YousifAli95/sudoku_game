import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SudokuContextProvider } from "./SudokuContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SudokuContextProvider>
    <App />
  </SudokuContextProvider>
);

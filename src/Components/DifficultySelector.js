import { useSudokuContext } from "../SudokuContext";
import React, { useEffect } from "react";

export default function DifficultySelector({ newGameButtonRef }) {
  const {
    difficultyMode,
    setDifficultyMode,
    DIFFICULTY_KEY,
    difficultyModes,
    setNewDifficultyMode,
  } = useSudokuContext();

  useEffect(() => {
    // Gets the stored diffuclty mode from local storage
    const storedDifficultyString = localStorage.getItem(DIFFICULTY_KEY);
    const storedDifficulty = storedDifficultyString
      ? parseFloat(storedDifficultyString)
      : difficultyModes.EASY;

    setDifficultyMode(storedDifficulty);
    setNewDifficultyMode(storedDifficulty);
  }, []);

  useEffect(() => {
    localStorage.setItem(DIFFICULTY_KEY, difficultyMode);
  }, [difficultyMode]);

  const selectDifficulty = (event) => {
    setNewDifficultyMode(event.target.value);
    newGameButtonRef?.current.click();
  };

  return (
    <>
      <select
        className="difficulty-select"
        onChange={(e) => selectDifficulty(e)}
        value={difficultyMode}
      >
        <option value={difficultyModes.EASY}>Easy</option>
        <option value={difficultyModes.MEDIUM}>Medium</option>
        <option value={difficultyModes.HARD}>Hard</option>
      </select>
    </>
  );
}

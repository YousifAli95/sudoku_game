import {
  shuffleArray,
  countNonEmptyValuesinMatrix,
} from "./utilsHelperFunctions";

const LIGHT_BLUE_CLASS = "light-blue-background";
const SAME_NUMBER_CLASS = "same-number";
const INVALID_CLASS = "invalid";

// Checks if it is allowed to put a certain number in a certain spot in the sudoku matrix
export function isValid(matrix, row, column, number, CELLS_PER_SUBGRID) {
  const SUBGRIDS_PER_AXIS = Math.floor(Math.sqrt(CELLS_PER_SUBGRID));
  let isValid = true;
  const errorCoordinates = [];
  for (let i = 0; i < CELLS_PER_SUBGRID; i++) {
    // Check for the same value in the row
    if (number && matrix[row][i] == number) {
      isValid = false;
      errorCoordinates.push({ row: row, column: i });
    }

    // Check for the same value in the column
    if (number && matrix[i][column] == number) {
      isValid = false;
      errorCoordinates.push({ row: i, column: column });
    }

    // Calculate the coordinates of the cell within the subgrid
    const m =
      SUBGRIDS_PER_AXIS * Math.floor(row / SUBGRIDS_PER_AXIS) +
      Math.floor(i / SUBGRIDS_PER_AXIS);
    const n =
      SUBGRIDS_PER_AXIS * Math.floor(column / SUBGRIDS_PER_AXIS) +
      (i % SUBGRIDS_PER_AXIS);

    // Check for the same value in the subgrid
    if (number && matrix[m][n] == number) {
      isValid = false;
      errorCoordinates.push({ row: m, column: n });
    }
  }

  return { isValid: isValid, errorCoordinates };
}

export function generateSudokuMatrix(CELLS_PER_SUBGRID) {
  const currentDifficultyMode = 0.5;

  // Generate a CELLS_PER_SUBGRID x CELLS_PER_SUBGRID matrix with only null values.
  const matrix = Array.from({ length: CELLS_PER_SUBGRID }, () =>
    Array(CELLS_PER_SUBGRID).fill(null)
  );

  // generate array with possible values to the fill the matrix (1-9)
  const possibleValues = Array.from({ length: 9 }, (_, index) => index + 1);

  const PROBABILITY_TO_FILL_A_CELL = currentDifficultyMode;

  for (let i = 0; i < CELLS_PER_SUBGRID; i++) {
    for (let j = 0; j < CELLS_PER_SUBGRID; j++) {
      const emptyValues = countNonEmptyValuesinMatrix(matrix);
      const maxNonEmptyvalues =
        PROBABILITY_TO_FILL_A_CELL * CELLS_PER_SUBGRID * CELLS_PER_SUBGRID;

      if (emptyValues >= maxNonEmptyvalues) {
        return matrix;
      }

      if (Math.random() >= currentDifficultyMode) continue;

      shuffleArray(possibleValues);
      for (let index = 0; index < possibleValues.length; index++) {
        const candidate = possibleValues[index];
        const result = isValid(matrix, i, j, candidate, CELLS_PER_SUBGRID);
        if (result.isValid) {
          matrix[i][j] = candidate;
          // Work with a copy of the matrix instead of the matrix itself
          const copiedMatrix = JSON.parse(JSON.stringify(matrix));
          const [isSolved] = sudokuSolver(copiedMatrix, CELLS_PER_SUBGRID);
          if (isSolved) break;
        }

        matrix[i][j] = null;
      }
    }
  }

  return matrix;
}

// Function to solve a Sudoku puzzle using backtracking
export function sudokuSolver(matrix, CELLS_PER_SUBGRID) {
  // Iterate through rows
  for (let i = 0; i < CELLS_PER_SUBGRID; i++) {
    // Iterate through columns
    for (let j = 0; j < CELLS_PER_SUBGRID; j++) {
      // If the cell is empty
      if (!matrix[i][j]) {
        // Try numbers from 1 to CELLS_PER_SUBGRID
        for (let k = 1; k <= CELLS_PER_SUBGRID; k++) {
          // Check if placing k in the cell is valid
          const result = isValid(matrix, i, j, k, CELLS_PER_SUBGRID);
          if (result.isValid) {
            // Place k in the cell
            matrix[i][j] = k;

            // Recursively attempt to solve the puzzle
            const [isSolved, solvedMatrix] = sudokuSolver(
              matrix,
              CELLS_PER_SUBGRID
            );
            if (isSolved) {
              return [true, solvedMatrix]; // If successful, return true and the solved matrix
            } else {
              matrix[i][j] = null; // If not successful, backtrack
            }
          }
        }

        return [false, null]; // If no valid number can be placed, backtrack
      }
    }
  }

  return [true, matrix]; // If the entire puzzle is solved, return true and the solved matrix
}

// Updates the background color of the inputboxes
export function updateBackgroundClasses(
  inputValue,
  gridRow,
  gridColumn,
  inputRefs,
  CELLS_PER_SUBGRID,
  SUBGRIDS_PER_AXIS,
  errorCoordinates
) {
  const inputBoxes = inputRefs.current;
  inputBoxes.forEach((_, rowIndex) => {
    inputBoxes[rowIndex].forEach((_, colIndex) => {
      // Remove non-default classes for the input box
      const inputBox = inputBoxes[rowIndex][colIndex];
      inputBox.classList.remove(LIGHT_BLUE_CLASS);
      inputBox.classList.remove(INVALID_CLASS);

      // Adds the SAME_NUMBER class to the inputs that have the value as the inputvalue
      if (inputValue && inputBox.value == inputValue)
        inputBox.classList.add(SAME_NUMBER_CLASS);
      else inputBox.classList.remove(SAME_NUMBER_CLASS);
    });
  });

  for (let i = 0; i < CELLS_PER_SUBGRID; i++) {
    // Calculate the coordinates of the cell within the subgrid
    const m =
      SUBGRIDS_PER_AXIS * Math.floor(gridRow / SUBGRIDS_PER_AXIS) +
      Math.floor(i / SUBGRIDS_PER_AXIS);
    const n =
      SUBGRIDS_PER_AXIS * Math.floor(gridColumn / SUBGRIDS_PER_AXIS) +
      (i % SUBGRIDS_PER_AXIS);

    // Sets the background color of the cells that are on in the same grid as the inputValue
    inputBoxes[m][n].classList.add(LIGHT_BLUE_CLASS);
    // Sets the background color of the cells that are on the same row and column of the inputValue
    inputBoxes[i][gridColumn].classList.add(LIGHT_BLUE_CLASS);
    inputBoxes[gridRow][i].classList.add(LIGHT_BLUE_CLASS);
  }
  if (errorCoordinates) {
    errorCoordinates.forEach((element) => {
      inputBoxes[element.row][element.column].classList.add(INVALID_CLASS);
    });
  }
}

// Function to reset the background colors of the sudoku grid cells
export function resetBackgroundClasses(inputRefs) {
  Array.from(inputRefs.current).forEach((row) => {
    row.forEach((input) => {
      input.classList.remove(LIGHT_BLUE_CLASS);
      input.classList.remove(SAME_NUMBER_CLASS);
      input.classList.remove(INVALID_CLASS);
    });
  });
}

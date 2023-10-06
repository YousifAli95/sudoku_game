// The shuffleArray function takes an array as its argument and shuffles it using the Fisher-Yates shuffle algorithm.
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generate a random integer between min (inclusive) and max (inclusive)
export function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to count non-null values in the grid
export function countNonEmptyValuesinMatrix(matrix) {
  let count = 0;
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]) {
        count++;
      }
    }
  }

  return count;
}

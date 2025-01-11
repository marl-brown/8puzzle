type TCoord = [number, number];

export class Board {
  board: number[][];
  boardGoal: number[][];
  boardGoalLookup: Record<number, TCoord>;

  constructor(board: number[][], boardGoal: number[][]) {
    this.board = board;
    this.boardGoal = boardGoal;
    this.boardGoalLookup = {};
    for (let i = 0; i < boardGoal.length; i++) {
      for (let j = 0; j < boardGoal[0].length; j++) {
        this.boardGoalLookup[this.boardGoal[i][j]] = [i, j];
      }
    }
  }

  hamming() {
    let i = 0;
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[0].length; col++) {
        if (this.board[row][col] == 0) continue;
        if (this.board[row][col] !== this.boardGoal[row][col]) {
          i += 1;
        }
      }
    }
    return i;
  }

  manhattanDistance(coords1: TCoord, coords2: TCoord) {
    return (
      Math.abs(coords1[0] - coords2[0]) + Math.abs(coords1[1] - coords2[1])
    );
  }

  manhattan() {
    let i = 0;
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[0].length; col++) {
        if (this.board[row][col] !== this.boardGoal[row][col]) {
          if (this.board[row][col] == 0) continue;
          const manhattanDistance = this.manhattanDistance(
            [row, col],
            this.boardGoalLookup[this.board[row][col]]
          );
          i += manhattanDistance > 0 ? manhattanDistance : 0;
        }
      }
    }
    return i;
  }

  isInsideBoard([row, col]: TCoord) {
    return (
      row >= 0 &&
      this.board.length < row &&
      col >= 0 &&
      col < this.board[0].length
    );
  }

  getNeighbours(coords: TCoord) {
    const legalCoords: TCoord[] = [];
    for (let i = -1; i < 2; i += 2) {
      const nextRow: TCoord = [coords[0] + i, coords[1]];
      if (this.isInsideBoard(nextRow)) legalCoords.push(nextRow);

      const nextCol: TCoord = [coords[0], coords[1] + i];
      if (this.isInsideBoard(nextCol)) legalCoords.push(nextCol);
    }
    return legalCoords;
  }

  isGoal() {
    this.board.forEach((a, row) => {
      a.forEach((v, col) => {
        if (v !== this.boardGoal[row][col]) return false;
      });
    });
    return true;
  }

  toString() {
    this.board.forEach((v) => {
      console.log(v.map((c) => c.toString().padStart(2, "0")).join(", "));
    });
  }
}

const board = new Board(
  [
    [0, 1, 3],
    [4, 2, 5],
    [7, 8, 6],
  ],
  [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ]
);
console.info(board.hamming(), board.manhattan());
board.toString();

// class Solver {

// }

/**
 * public class Board {
   public Board(int[][] tiles)        // construct a board from an N-by-N array of tiles
   public int hamming()               // return number of blocks out of place
   public int manhattan()             // return sum of Manhattan distances between blocks and goal
   public boolean equals(Object y)    // does this board position equal y
   public Iterable<Board> neighbors() // return an Iterable of all neighboring board positions
   public String toString()           // return a string representation of the board
}


public class Solver {
   public Solver(Board initial)        // find a solution to the initial board
   public boolean isSolvable()         // is the initial board solvable?
   public int moves()                  // return min number of moves to solve initial board; -1 if no solution
   public Iterable<Board> solution()   // return an Iterable of board positions in solution
}
 */

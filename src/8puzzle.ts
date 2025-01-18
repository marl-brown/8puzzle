type TCoord = [number, number];

const DEFAULT_BOARD_GOAL = Array(3)
  .fill(0)
  .map((_, i) =>
    Array(3)
      .fill(0)
      .map((_, idx) => (i * 3 + idx + 1 == 9 ? 0 : i * 3 + idx + 1))
  );

export class Board {
  board: number[][];
  boardGoal: number[][];
  boardGoalLookup: Record<number, TCoord>;
  boardLookup: Record<number, TCoord>;
  moveNumber: number;
  parent?: Board;

  constructor(board: number[][], moveNumber: number = 0) {
    this.board = board.map((v) => v.map((i) => i));
    this.boardLookup = {};
    this.updateBoardLookup();
    this.boardGoal = DEFAULT_BOARD_GOAL;
    this.moveNumber = moveNumber;
    this.boardGoalLookup = {};
    for (let i = 0; i < this.boardGoal.length; i++) {
      for (let j = 0; j < this.boardGoal[0].length; j++) {
        this.boardGoalLookup[this.boardGoal[i][j]] = [i, j];
      }
    }
  }

  updateBoardLookup() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        this.boardLookup[this.board[i][j]] = [i, j];
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

  fScore() {
    // console.info(this.manhattan(), this.moveNumber);
    return this.manhattan() + this.moveNumber;
  }

  manhattan() {
    let i = 0;
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[0].length; col++) {
        if (this.board[row][col] == 0) continue;
        if (this.board[row][col] != this.boardGoal[row][col]) {
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
      row < this.board.length &&
      col >= 0 &&
      col < this.board[0].length
    );
  }

  getNeighbours(coords: TCoord): TCoord[] {
    const legalCoords: TCoord[] = [];
    for (let i = -1; i < 2; i += 2) {
      const nextRow: TCoord = [coords[0] + i, coords[1]];
      if (this.isInsideBoard(nextRow)) legalCoords.push(nextRow);

      const nextCol: TCoord = [coords[0], coords[1] + i];
      if (this.isInsideBoard(nextCol)) legalCoords.push(nextCol);
    }
    return legalCoords!;
  }

  isGoal() {
    this.board.forEach((a, row) => {
      a.forEach((v, col) => {
        if (v !== this.boardGoal[row][col]) return false;
      });
    });
    return true;
  }

  equal(board: number[][]) {
    return JSON.stringify(this.board) == JSON.stringify(board);
  }

  toString(b?: number[][]) {
    const board = b ?? this.board;
    board.forEach((v) => {
      console.log(v.map((c) => c.toString().padStart(2, "0")).join(", "));
    });
  }
}

// const board = new Board([
//   [0, 1, 3],
//   [4, 2, 5],
//   [8, 6, 7],
// ]);

// console.info(board.hamming(), board.manhattan());
// board.toString();
// const b2 = [
//   [0, 1, 3],
//   [4, 2, 5],
//   [7, 8, 6],
// ];

// console.info("boards are equal? ", board.equal(b2));

class Solver {
  board: Board;
  movesCount: number;
  solvedBoardTail?: Board;

  constructor(board: Board) {
    this.board = board;
    this.movesCount = 0;
  }

  solver() {
    const openBoards: Board[] = [this.board];
    const closedBoards = new Map();
    let moveNumber = 0;
    let j = 0;
    while (openBoards.length > 0) {
      openBoards.sort((a, b) => b.fScore() - a.fScore());

      const currentBoard = openBoards.pop()!;
      console.log(currentBoard.fScore());
      const closedItemValue =
        closedBoards.get(JSON.stringify(currentBoard.board)) || 0;
      closedBoards.set(JSON.stringify(currentBoard.board), closedItemValue + 1);
      moveNumber += 1;
      if (moveNumber > 1000) {
        console.error("j equals ", j);
        return;
      }
      if (currentBoard?.equal(currentBoard.boardGoal)) {
        this.solvedBoardTail = currentBoard;
        return this.solvedBoardTail;
      }

      const [zX, zY] = currentBoard.boardLookup[0];
      const nextMovesArray = currentBoard.getNeighbours([zX, zY]);

      for (const [x, y] of nextMovesArray) {
        // swap numbers from xy with currentBoard.boardGoalLookup[0]
        const newBoard = new Board(currentBoard.board, moveNumber);
        const numberToSwitchWith = newBoard.board[x][y];
        newBoard.board[zX][zY] = numberToSwitchWith;
        newBoard.board[x][y] = 0;
        // check its not in closed boards, check its not in openboards... if it is continue
        if (closedBoards.has(JSON.stringify(newBoard.board))) {
          continue;
        }
        j += 1;

        const inOpen = openBoards.findIndex((board) =>
          board.equal(newBoard.board)
        );
        if (inOpen > -1) {
          const theBoard = openBoards[inOpen];
          if (newBoard.moveNumber < theBoard.moveNumber) {
            theBoard.moveNumber = newBoard.moveNumber;
            theBoard.parent = currentBoard;
            continue;
          }
          continue;
        }

        //push new Board to the openBoards
        newBoard.updateBoardLookup();
        newBoard.parent = currentBoard;
        openBoards.push(newBoard);
      }
    }
  }

  isSolvable() {
    const flatBoard = this.board.board.flat();
    let inversions = 0;
    for (let i = 0; i < flatBoard.length - 1; i++) {
      if (flatBoard[i] == 0) continue;
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[j] == 0) continue;
        console.error(flatBoard[i], flatBoard[j]);
        if (flatBoard[i] > flatBoard[j]) inversions += 1;
      }
    }
    console.log("hhhhhhhhhhhhhhhhhhhhh", inversions, inversions % 2 == 0);
    return inversions % 2 == 0;
  }

  moves() {
    if (!this.solvedBoardTail) return -1;
    return this.solution().length;
  }

  solution() {
    if (!this.solvedBoardTail) return [];
    let current = this.solvedBoardTail;
    let result = [];
    while (current.parent != null) {
      result.push(current);
      current = current.parent;
    }
    result.push(current);
    return result;
  }
}

// const b = new Solver(
//   new Board([
//     [1, 2, 0],
//     [3, 4, 5],
//     [6, 7, 8],
//   ])
// );
// b.solver();
// console.info(b.solution());
console.log(
  [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ].flatMap((v) => v)
);
// const board = new Board([ // the 0 and 8 requires a max of 11 moves
//   [1, 2, 3],
//   [6, 0, 8],
//   [4, 7, 5],
// ]);
const board = new Board([
  // the 8 and 0 breaks
  [1, 2, 3],
  [6, 8, 0],
  [4, 7, 5],
]);
const a = new Solver(board);

console.log("hello");
if (a.isSolvable()) {
  console.log("hello");
  // console.log(board.manhattan());
  a.solver();
  console.info(a.moves(), a.solution());
}

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

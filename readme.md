[link to 8puzzle]("https://www.cs.princeton.edu/courses/archive/spr10/cos226/assignments/8puzzle.html")

public class Board {
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
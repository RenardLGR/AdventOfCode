// https://adventofcode.com/2022/day/9
// --- Day 9: Rope Bridge ---
// This rope bridge creaks as you walk along it. You aren't sure how old it is, or whether it can even support your weight.

// It seems to support the Elves just fine, though. The bridge spans a gorge which was carved out by the massive river far below you.

// You step carefully; as you do, the ropes stretch and twist. You decide to distract yourself by modeling rope physics; maybe you can even figure out where not to step.

// Consider a rope with a knot at each end; these knots mark the head and the tail of the rope. If the head moves far enough away from the tail, the tail is pulled toward the head.

// Due to nebulous reasoning involving Planck lengths, you should be able to model the positions of the knots on a two-dimensional grid. Then, by following a hypothetical series of motions (your puzzle input) for the head, you can determine how the tail will move.

// Due to the aforementioned Planck lengths, the rope must be quite short; in fact, the head (H) and tail (T) must always be touching (diagonally adjacent and even overlapping both count as touching):

// ....
// .TH.
// ....

// ....
// .H..
// ..T.
// ....

// ...
// .H. (H covers T)
// ...
// If the head is ever two steps directly up, down, left, or right from the tail, the tail must also move one step in that direction so it remains close enough:

// .....    .....    .....
// .TH.. -> .T.H. -> ..TH.
// .....    .....    .....

// ...    ...    ...
// .T.    .T.    ...
// .H. -> ... -> .T.
// ...    .H.    .H.
// ...    ...    ...
// Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:

// .....    .....    .....
// .....    ..H..    ..H..
// ..H.. -> ..... -> ..T..
// .T...    .T...    .....
// .....    .....    .....

// .....    .....    .....
// .....    .....    .....
// ..H.. -> ...H. -> ..TH.
// .T...    .T...    .....
// .....    .....    .....
// You just need to work out where the tail goes as the head follows a series of motions. Assume the head and the tail both start at the same position, overlapping.

// For example:

// R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2
// This series of motions moves the head right four steps, then up four steps, then left three steps, then down one step, and so on. After each step, you'll need to update the position of the tail if the step means the head is no longer adjacent to the tail. Visually, these motions occur as follows (s marks the starting position as a reference point):

// == Initial State ==

// ......
// ......
// ......
// ......
// H.....  (H covers T, s)

// == R 4 ==

// ......
// ......
// ......
// ......
// TH....  (T covers s)

// ......
// ......
// ......
// ......
// sTH...

// ......
// ......
// ......
// ......
// s.TH..

// ......
// ......
// ......
// ......
// s..TH.

// == U 4 ==

// ......
// ......
// ......
// ....H.
// s..T..

// ......
// ......
// ....H.
// ....T.
// s.....

// ......
// ....H.
// ....T.
// ......
// s.....

// ....H.
// ....T.
// ......
// ......
// s.....

// == L 3 ==

// ...H..
// ....T.
// ......
// ......
// s.....

// ..HT..
// ......
// ......
// ......
// s.....

// .HT...
// ......
// ......
// ......
// s.....

// == D 1 ==

// ..T...
// .H....
// ......
// ......
// s.....

// == R 4 ==

// ..T...
// ..H...
// ......
// ......
// s.....

// ..T...
// ...H..
// ......
// ......
// s.....

// ......
// ...TH.
// ......
// ......
// s.....

// ......
// ....TH
// ......
// ......
// s.....

// == D 1 ==

// ......
// ....T.
// .....H
// ......
// s.....

// == L 5 ==

// ......
// ....T.
// ....H.
// ......
// s.....

// ......
// ....T.
// ...H..
// ......
// s.....

// ......
// ......
// ..HT..
// ......
// s.....

// ......
// ......
// .HT...
// ......
// s.....

// ......
// ......
// HT....
// ......
// s.....

// == R 2 ==

// ......
// ......
// .H....  (H covers T)
// ......
// s.....

// ......
// ......
// .TH...
// ......
// s.....
// After simulating the rope, you can count up all of the positions the tail visited at least once. In this diagram, s again marks the starting position (which the tail also visited) and # marks other positions the tail visited:

// ..##..
// ...##.
// .####.
// ....#.
// s###..
// So, there are 13 positions the tail visited at least once.

// Simulate your complete hypothetical series of motions. How many positions does the tail of the rope visit at least once?

const fs = require('fs');
const assert = require('assert');

function solveOne(string){
    const moves = string.split('\n').map(m => m.split(' ')).map(move => {
        const [dir, steps] = move
        return [dir, Number(steps)]
    })

    //We do not know the size of the grid so we will work on that first
    let grid
    let HCoord //coord are represented as an array [y, x] such as grid[y][x] is H
    let TCoord //coord are represented as an array [y, x] such as grid[y][x] is T
    //grid is initialized with only false as we are only interested in if a cell is visited or not right now
    initializeGrid()

    //make the "dance" between H and T
    moves.forEach(([direction, steps]) => {
        for(let i=0 ; i<steps ; i++){
            move(direction)
        }
    })

    let visited = 0
    //count visited
    for(let row=0 ; row<grid.length ; row++){
        for(let col=0 ; col<grid[0].length ; col++){
            if(grid[row][col] === true){
                visited++
            }
        }
    }

    // console.log(grid);
    console.log(visited);
    return visited

    //To initialize the grid, we will run our head starting from [0,0] (it doesn't mean it will stay at [0,0]) the difference between the extremities will give us the size
    function initializeGrid(){
        let X = 0
        let Y = 0
        let minX = 0
        let maxX = 0
        let minY = 0
        let maxY = 0
        moves.forEach(([direction, steps]) => {
            switch (direction) {
                case "U":
                    Y -= steps
                    break;

                case "R":
                    X += steps
                    break;

                case "D":
                    Y += steps
                    break;

                case "L":
                    X -= steps
                    break;
            
                default:
                    break;
            }

            minX = Math.min(minX, X)
            maxX = Math.max(maxX, X)
            minY = Math.min(minY, Y)
            maxY = Math.max(maxY, Y)
        })

        console.log("minX:", minX)
        console.log("maxX:", maxX)
        console.log("minY:", minY)
        console.log("maxY:", maxY)
        const nLine = Math.abs(minY) + maxY + 1
        const nCol = Math.abs(minX) + maxX + 1
        grid = Array.from({length : nLine}, (line) => Array(nCol).fill(false))
        //initialize H and T where they will never hop out of the grid
        HCoord = [Math.abs(minY), Math.abs(minX)]
        TCoord = [Math.abs(minY), Math.abs(minX)]
        //initialize start as visited
        grid[Math.abs(minY)][Math.abs(minX)] = true
        // console.log(grid);
    }


    function move(direction){
        moveH(direction)
        moveT()
    }

    function moveH(direction){
        switch (direction) {
            case 'U':
                moveHUp()
                break;

            case 'R':
                moveHRight()
                break;

            case 'D':
                moveHDown()
                break;

            case 'L':
                moveHLeft()
                break;
        
            default:
                break;
        }
    }

    function moveT(){
        //if T is in the Moore neighborhood (or H=T) of H or T is on H, don't move
        if(isMooreNeighborhood(HCoord, TCoord)){
            return
        }else{
            //move on the same line or col
            if((HCoord[0] === TCoord[0]) || (HCoord[1] === TCoord[1])){
                TCoord = [Math.floor((HCoord[0]+TCoord[0])/2) , Math.floor((HCoord[1]+TCoord[1])/2)]
                grid[TCoord[0]][TCoord[1]] = true
            }else{
                //move diagonally
                let yT = (HCoord[0] > TCoord[0]) ? TCoord[0]+1 : TCoord[0]-1
                let xT = (HCoord[1] > TCoord[1]) ? TCoord[1]+1 : TCoord[1]-1
                TCoord = [yT ,xT]
                grid[yT][xT] = true
            }
        }
    }
    
    //moore is a the 8 cells surrounding a cell (or A=B)
    function isMooreNeighborhood(pointA, pointB){
        const numRows = grid.length;
        const numCols = grid[0].length;

        const [yA, xA] = pointA;
        const [yB, xB] = pointB;

        // Check if points A and B are within the bounds of the grid
        if (yA < 0 || yA >= numRows || xA < 0 || xA >= numCols ||
            yB < 0 || yB >= numRows || xB < 0 || xB >= numCols) {
            return false;
        }

        // Calculate the absolute difference in x and y coordinates
        const diffX = Math.abs(xA - xB);
        const diffY = Math.abs(yA - yB);

        // Check if A is within the Moore neighborhood of B or if A equals B
        return (diffX <= 1 && diffY <= 1) || (xA === xB && yA === yB);
    }

    function moveHUp(){
        HCoord[0] -= 1
    }

    function moveHRight(){
        HCoord[1] += 1
    }

    function moveHDown(){
        HCoord[0] += 1
    }

    function moveHLeft(){
        HCoord[1] -= 1
    }
}

(() => {
const data = fs.readFileSync(__dirname + '/input.txt').toString();
console.log(solveOne(data));

assert.deepStrictEqual(solveOne(`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`), 13);

})();
// CORRECT ANSWER : 6494
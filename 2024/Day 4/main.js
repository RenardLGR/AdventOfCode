const fs = require("fs");
const assert = require("assert");

(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 18)
        // assert.deepStrictEqual(solveOne(input), 2397) // 2397
        // assert.deepStrictEqual(solveOneBis(input), 2397) // 2397
        assert.deepStrictEqual(solveOneTer(input), 2397) // 2397
        // assert.deepStrictEqual(solveTwo(example), 9)
        // assert.deepStrictEqual(solveTwo(input), 1824) // 1824
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

// ============================ PART I ============================

function solveOne(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }
    let matrix = lines.map(l => l.split(""))
    // console.log(matrix);
    
    const maxRow = matrix.length // number of rows
    const maxCol = matrix[0].length // number of cols
    const target = "XMAS" // target is hard-corded below, but we could easily do a for(i=0 ; target.length) matrix[row-i][col] === target[i]

    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "X"){
                res += collectChecks(row, col).filter(bool => bool).length
            }
        }
    }

    console.log(res);
    
    return res

    // HELPER

    // (Number, Number) : Boolean
    // Check if I have "XMAS" reading North
    // We could use an optional chaining ?.
    // matrix[row]?.[col] will short circuits to undefined if matrix[row] is undefined instead of throwing an error.
    // See solveOneBis()
    function checkNorth(row, col){
        if(row < target.length-1){
            return false
        }
        return matrix[row][col] === "X" && matrix[row-1][col] === "M" && matrix[row-2][col] === "A" && matrix[row-3][col] === "S"
    }

    function checkNorthEast(row, col){
        if(row < target.length-1 || col > maxCol-target.length){
            return false
        }
        return matrix[row][col] === "X" && matrix[row-1][col+1] === "M" && matrix[row-2][col+2] === "A" && matrix[row-3][col+3] === "S"
    }

    function checkEast(row, col){
        if(col > maxCol-target.length){
            return false
        }
        return matrix[row][col] === "X" && matrix[row][col+1] === "M" && matrix[row][col+2] === "A" && matrix[row][col+3] === "S"
    }

    function checkSouthEast(row, col){
        if(row > maxRow-target.length || col > maxCol-target.length){
            return false
        }
        return matrix[row][col] === "X" && matrix[row+1][col+1] === "M" && matrix[row+2][col+2] === "A" && matrix[row+3][col+3] === "S"
    }

    function checkSouth(row, col){
        if(row > maxRow-target.length){
            return false
        }
        return matrix[row][col] === "X" && matrix[row+1][col] === "M" && matrix[row+2][col] === "A" && matrix[row+3][col] === "S"
    }

    function checkSouthWest(row, col){
        if(row > maxRow-target.length || col < target.length-1){
            return false
        }
        return matrix[row][col] === "X" && matrix[row+1][col-1] === "M" && matrix[row+2][col-2] === "A" && matrix[row+3][col-3] === "S"
    }

    function checkWest(row, col){
        if(col < target.length-1){
            return false
        }
        return matrix[row][col] === "X" && matrix[row][col-1] === "M" && matrix[row][col-2] === "A" && matrix[row][col-3] === "S"
    }

    function checkNorthWest(row, col){
        if(row < target.length-1 || col < target.length-1){
            return false
        }
        return matrix[row][col] === "X" && matrix[row-1][col-1] === "M" && matrix[row-2][col-2] === "A" && matrix[row-3][col-3] === "S"
    }

    // (Number, Number) : Array<Boolean>
    // Return an array where XMAS was read
    function collectChecks(row, col){
        return [checkNorth(row, col), checkNorthEast(row, col), checkEast(row, col), checkSouthEast(row, col), checkSouth(row, col), checkSouthWest(row, col), checkWest(row, col), checkNorthWest(row, col)]
    }
}

// Same idea, slightly updated syntax
// We could use an optional chaining ?.
// matrix[row]?.[col] will short circuits to undefined if matrix[row] is undefined instead of throwing an error.
function solveOneBis(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }
    let matrix = lines.map(l => l.split(""))
    // console.log(matrix);
    
    const maxRow = matrix.length // number of rows
    const maxCol = matrix[0].length // number of cols
    const target = "XMAS" // target is hard-corded below, but we could easily do a for(i=0 ; target.length) matrix[row-i][col] === target[i]

    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "X"){
                res += collectChecks(row, col).filter(bool => bool).length
            }
        }
    }

    console.log(res);
    
    return res

    // HELPER

    // (Number, Number) : Boolean
    // Check if I have "XMAS" reading North
    // Using an optional chaining ?.
    function checkNorth(row, col){
        return matrix[row]?.[col] === "X" && matrix[row-1]?.[col] === "M" && matrix[row-2]?.[col] === "A" && matrix[row-3]?.[col] === "S"
    }

    function checkNorthEast(row, col){
        return matrix[row]?.[col] === "X" && matrix[row-1]?.[col+1] === "M" && matrix[row-2]?.[col+2] === "A" && matrix[row-3]?.[col+3] === "S"
    }

    function checkEast(row, col){
        return matrix[row]?.[col] === "X" && matrix[row]?.[col+1] === "M" && matrix[row]?.[col+2] === "A" && matrix[row]?.[col+3] === "S"
    }

    function checkSouthEast(row, col){
        return matrix[row]?.[col] === "X" && matrix[row+1]?.[col+1] === "M" && matrix[row+2]?.[col+2] === "A" && matrix[row+3]?.[col+3] === "S"
    }

    function checkSouth(row, col){
        return matrix[row]?.[col] === "X" && matrix[row+1]?.[col] === "M" && matrix[row+2]?.[col] === "A" && matrix[row+3]?.[col] === "S"
    }

    function checkSouthWest(row, col){
        return matrix[row]?.[col] === "X" && matrix[row+1]?.[col-1] === "M" && matrix[row+2]?.[col-2] === "A" && matrix[row+3]?.[col-3] === "S"
    }

    function checkWest(row, col){
        return matrix[row]?.[col] === "X" && matrix[row]?.[col-1] === "M" && matrix[row]?.[col-2] === "A" && matrix[row]?.[col-3] === "S"
    }

    function checkNorthWest(row, col){
        return matrix[row]?.[col] === "X" && matrix[row-1]?.[col-1] === "M" && matrix[row-2]?.[col-2] === "A" && matrix[row-3]?.[col-3] === "S"
    }

    // (Number, Number) : Array<Boolean>
    // Return an array where XMAS was read
    function collectChecks(row, col){
        return [checkNorth(row, col), checkNorthEast(row, col), checkEast(row, col), checkSouthEast(row, col), checkSouth(row, col), checkSouthWest(row, col), checkWest(row, col), checkNorthWest(row, col)]
    }
}

function solveOneTer(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }
    let matrix = lines.map(l => [...l])
    // console.log(matrix);
    
    const maxRow = matrix.length // number of rows
    const maxCol = matrix[0].length // number of cols
    const target = "XMAS"

    const CARDINAL_DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    const DIAGONAL_DIRECTIONS = [[-1, -1], [-1, 1], [1, 1], [1, -1]]
    const ALL_DIRECTIONS = [...CARDINAL_DIRECTIONS, ...DIAGONAL_DIRECTIONS]

    let res = 0

    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "X"){
                for(let [roffset, coffset] of ALL_DIRECTIONS){
                    let isFound = true
                    for(let i=1 ; i<target.length ; i++){
                        let [rnew, cnew] = [row + roffset*i, col + coffset*i]
                        // if(rnew>=0 && rnew<maxRow && cnew>=0 && cnew<maxCol) // since I did optional chaining, all good
                        if(matrix[rnew]?.[cnew] !== target[i]){
                            isFound = false
                            break
                        }
                    }
                    if(isFound) res++
                }
            }
        }
    }

    // console.log(res);

    return res
}

// Let T the Transpose operation, H the Horizontal mirror operation and V the Vertical mirror operation. Let M be the Matrix. Let M > O be the O Operation on M.
// We have M > T > T = M
// We have M > H > V = M > V > H

// |a b c d|           |d c b a|            |d h l p|       V > T
// |e f g h|   =>      |h g f e|    =>      |c g k o|     we have an
// |i j k l|vertical   |l k j i|  transpose |b f j n|    anticlockwise
// |m n o p| mirror    |p o n m|            |a e i m|   rotation of 90°

//                     |m n o p|            |m i e a|       H > T
//             =>      |i j k l|    =>      |n j f b|     we have a
//         horizontal  |e f g h|  transpose |o k g c|     clockwise
//           mirror    |a b c d|            |p l h d|   rotation of 90°

//                     |a e i m|
//             =>      |b f j n|
//         transpose   |c g k o|
//                     |d h l p|
// This would easily take care of XMAS and SAMX in vertical and horizontal directions

function solveOneQuater(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }
    let matrix = lines.map(l => l.split(""))
    // console.log(matrix);
    
    const maxRow = matrix.length // number of rows
    const maxCol = matrix[0].length // number of cols



    //HELPER
    // Array<Array<Number>> : Array<Array<Number>>
    // From a matrix, return the vertical mirror matrix 
    function verticalMirror(matrix){
        const res = Array.from({length : maxRow}, () => Array(maxCol).fill(undefined))
        for(let row=0 ; row<maxRow ; row++){
            for(let col=0 ; col<maxCol ; col++){
                res[row][maxCol-col-1] = matrix[row][col]
            }
        }
        return res
    }
    

    // Array<Array<Number>> : Array<Array<Number>>
    // From a matrix, return the horizontal mirror matrix 
    function horizontalMirror(matrix){
        const res = Array.from({length : maxRow}, () => Array(maxCol).fill(undefined))
        for(let row=0 ; row<maxRow ; row++){
            for(let col=0 ; col<maxCol ; col++){
                res[maxRow-row-1][col] = matrix[row][col]
            }
        }
        return res
    }
    
    // Array<Array<Number>> : Array<Array<Number>>
    // From a matrix, return the transpose matrix 
    function transposeMirror(matrix){
        const res = Array.from({length : maxCol}, () => Array(maxRow).fill(undefined))
        for(let row=0 ; row<maxRow ; row++){
            for(let col=0 ; col<maxCol ; col++){
                res[col][row] = matrix[row][col]
            }
        }
        return res
    }
}

// ============================ PART II ============================
// X-MAS can be written in either way :
// M.S      S.M     M.M     S.S
// .A.      .A.     .A.     .A.
// M.S      S.M     S.S     M.M

function solveTwo(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }
    let matrix = lines.map(l => l.split(""))
    // console.log(matrix);
    
    const maxRow = matrix.length // number of rows
    const maxCol = matrix[0].length // number of cols

    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "A"){
                if(collectChecks(row, col).filter(bool => bool).length === 2){
                    res++
                }
            }
        }
    }
    console.log(res);
    
    return res

    //HELPER
    // (Number, Number) : Boolean
    // Check if I have "MAS" reading NorthWestSouthEastDiagonal either way
    function checkNorthWestSouthEastDiagonal(row, col){
        if(row<1 || row>maxRow-2 || col<1 || col>maxCol-2){
            return false
        }
        return (matrix[row-1][col-1]==="S" && matrix[row+1][col+1]==="M") || (matrix[row-1][col-1]==="M" && matrix[row+1][col+1]==="S")
    }

    function checkNorthEastSouthWestDiagonal(row, col){
        if(row<1 || row>maxRow-2 || col<1 || col>maxCol-2){
            return false
        }
        return (matrix[row-1][col+1]==="S" && matrix[row+1][col-1]==="M") || (matrix[row-1][col+1]==="M" && matrix[row+1][col-1]==="S")
    }

    // (Number, Number) : Array<Boolean>
    // Return an array where a MAS diagonal was read
    function collectChecks(row, col){
        return [checkNorthWestSouthEastDiagonal(row, col), checkNorthEastSouthWestDiagonal(row, col)]
    }
}

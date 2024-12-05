const fs = require("fs");
const assert = require("assert");

(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 18)
        // assert.deepStrictEqual(solveOne(input), 2397) // 2397
        // assert.deepStrictEqual(solveTwo(example), 9)
        assert.deepStrictEqual(solveTwo(input), 1824) // 1824
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
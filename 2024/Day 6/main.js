const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 41)
        // assert.deepStrictEqual(solveOne(input), 4988) // 4988
        // assert.deepStrictEqual(solveTwo(example), 6)
        assert.deepStrictEqual(solveTwo(input), 1697) // 1697
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
    
    let matrix = lines.map(l => [...l])
    let maxRow = matrix.length // number of rows
    let maxCol = matrix[0].length // number of cols
    
    let visited = Array.from({length : maxRow}, () => Array(maxCol).fill(false))
    
    const CARDINAL_DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]] // north, east, south, west
    let guard = {cardinalDirectionIndex: 0, row: undefined, col: undefined} //cardinalDirectionIndex of 0 means he is heading north, 1 means east, etc. It will be increase by 1 each time the guard encounters an obstacle (mod 4 when needed)

    // Finding guard's initial position
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "^"){
                guard.row = row
                guard.col = col
                visited[row][col] = true
            }
        }
    }

    //Simulating guard's path
    while(guard.row>=0 && guard.row<maxRow && guard.col>=0 && guard.col<maxCol){
        let [offsetRow, offsetCol] = CARDINAL_DIRECTIONS[guard.cardinalDirectionIndex]
        //Check if the guard is on an obstacle, if so, take a step back (so cancel the previous step) and rotate 90° to the right
        if(matrix[guard.row][guard.col] === "#"){
            guard.row = guard.row - offsetRow
            guard.col = guard.col - offsetCol
            guard.cardinalDirectionIndex = (guard.cardinalDirectionIndex + 1) % 4
        }else{
            visited[guard.row][guard.col] = true
            guard.row = guard.row + offsetRow
            guard.col = guard.col + offsetCol
        }
    }

    //Counting visited
    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(visited[row][col]){
                res++
            }
        }
    }

    // console.table(visited);
    
    console.log(res)

    return res
}
// ============================ PART II ============================
function solveTwo(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    let matrix = lines.map(l => [...l])
    let maxRow = matrix.length // number of rows
    let maxCol = matrix[0].length // number of cols
    
    let res = 0
    //Put an obstacle on every possible position, so not on the guard starting position and not on an already existing obstacle (although it wouldn't change anything)
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            //Check if it possible to put an obstacle here
            if(matrix[row][col] !== "#" && matrix[row][col] !== "^"){
                //Put an obstacle
                matrix[row][col] = "#"
                //Test
                if(isGuardStuck(matrix)) res++
                //Backtrack
                matrix[row][col] = "."
            }
        }
    }

    console.log(res)

    return res
}

// Array<Array<Number>> : Boolean
// Given a new map with a newly added obstacle, returns a Boolean if the guard is stuck
function isGuardStuck(matrix){
    //Similar algorithm than before, but we now track the direction he visited a cell with.
    //We will run the guard's path, he the guard walks on a visited place with the same direction as before, he is indeed in a loop
    let maxRow = matrix.length // number of rows
    let maxCol = matrix[0].length // number of cols
    
    let visited = Array.from({length : maxRow}, () => Array(maxCol).fill(undefined))
    //filling visited with the curated Object to ease all the tracking
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            visited[row][col] = {visited: false, direction: []}
        }
    }
    
    const CARDINAL_DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]] // north, east, south, west
    let guard = {cardinalDirectionIndex: 0, row: undefined, col: undefined} //cardinalDirectionIndex of 0 means he is heading north, 1 means east, etc. It will be increase by 1 each time the guard encounters an obstacle (mod 4 when needed)

    // Finding guard's initial position
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "^"){
                guard.row = row
                guard.col = col
            }
        }
    }

    //Simulating guard's path
    while(guard.row>=0 && guard.row<maxRow && guard.col>=0 && guard.col<maxCol){
        let [offsetRow, offsetCol] = CARDINAL_DIRECTIONS[guard.cardinalDirectionIndex]
        //Check if the guard is on an obstacle, if so, take a step back (so cancel the previous step) and rotate 90° to the right
        if(matrix[guard.row][guard.col] === "#"){
            guard.row = guard.row - offsetRow
            guard.col = guard.col - offsetCol
            guard.cardinalDirectionIndex = (guard.cardinalDirectionIndex + 1) % 4
        }else{
            //If the position was previously visited with the same direction, the guard is stuck
            if(visited[guard.row][guard.col].visited && visited[guard.row][guard.col].direction.includes(guard.cardinalDirectionIndex)){
                return true
            }
            //Update status of visited
            visited[guard.row][guard.col].visited = true
            visited[guard.row][guard.col].direction.push(guard.cardinalDirectionIndex)
            //Update guard position
            guard.row = guard.row + offsetRow
            guard.col = guard.col + offsetCol
        }
    }

    //The guard managed to escape the matrix, he is not stuck
    return false
}
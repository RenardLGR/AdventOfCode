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
// Just simulate the path and count.
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
// The guard is stuck if and only if it returns to a visited position with the same direction.

// Proof :

// If revisiting position and direction implies an infinite loop:
// Assume the guard revisits a state (p,d), where p is the position and d is the direction.
// By determinism, the guard will follow the same sequence of moves starting from (p,d).
// Since it reached (p,d) before and is now back at (p,d), the guard will keep repeating the cycle of movements indefinitely.
// Therefore, revisiting (p,d) guarantees an infinite loop.

// If the guard is in an infinite loop, it must revisit a position and direction:
// Assume the guard enters an infinite loop.
// Since the guard is deterministic and operates within a finite space (positions and directions), the Pigeonhole Principle guarantees that the guard must eventually repeat a state (p,d).
// Repeating (p,d) means the guard has revisited the same position and direction.

// Conclusion : Revisiting a position with the same direction is both a necessary and sufficient condition for an infinite loop for deterministic guard in a finite state space.
// ___________________________________________________________________
// Mathematically formalized :
// The guard is in an infinite loop ⟺ ∃s∈S such that s is visited more than once.

// Let P a finite set of positions.
// Let D a finite set of directions.
// Let a finite state space S = P x D, where P x D is the cartesian product of P and D. It is the set of all ordered pairs (p, d) with p ∈ P and d ∈ D.
// A state s ∈ S is defined as s = (p,d), where p ∈ P is the current position and d ∈ D is the current direction.
// The guard's movement is defined by a deterministic function:
// f : S → S (Both the domain and codomain are S)
// f(s)=f(p,d) gives the next state of the guard.

// Proof :

// If the guard revisits a state s, it is in a infinite loop:
// Assume the guard revisits a state s_k at a later step s_m with m>k such that :
// s_k = s_m
// Since the guard is deterministic, f will produce the same output for the same input. Therefore :
// f(s_k) = f(s_m) = s_k+1 = s_m+1 and
// s_k+2 = s_m+2 and so on...
// This implies the sequence of states from s_k to s_m will repeat indefinitely :
// s_k, s_k+1, ... s_m-1, s_k, s_k+1, ...
// Thus the guard is in an infinite loop.

// If the guard is in an infinite loop, it revisits a state s:
// Assume the automaton is in an infinite loop. This means the sequence of states (s_0, s_1, ...) repeats indefinitely.
// Since S is finite, the Pigeonhole Principle ensures that some state s_k ∈ S must be visited more than once.
// Therefore, the guard revisits a state s_k at least twice, and the sequence enters a cycle.

// Conclusion : The guard is in an infinite loop ⟺ ∃s∈S such that s is visited more than once.

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
    //We will run the guard's path, if the guard walks on a visited place with the same direction as before, he is indeed in a loop
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
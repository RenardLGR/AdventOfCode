const fs = require("fs");
const assert = require("assert");
const { dir } = require("console");


(() => {
    // try {
        const example1 = fs.readFileSync(__dirname + "/example1.txt").toString()
        const example2 = fs.readFileSync(__dirname + "/example2.txt").toString()
        const example3 = fs.readFileSync(__dirname + "/example3.txt").toString()
        const example4 = fs.readFileSync(__dirname + "/example4.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example1), 7036) // 7036
        // assert.deepStrictEqual(solveOne(example2), 11048) // 11048
        // assert.deepStrictEqual(solveOne(example3), 21148) // 21148
        // assert.deepStrictEqual(solveOne(example4), 4013) // 4013
        assert.deepStrictEqual(solveOne(input), 82460) // 82460

        // assert.deepStrictEqual(solveTwo(example1), 7036) // 7036
        // assert.deepStrictEqual(solveTwo(example2), 11048) // 11048
        // assert.deepStrictEqual(solveTwo(example3), 149) // 21148
        // assert.deepStrictEqual(solveTwo(example4), 14) // 4013
        // assert.deepStrictEqual(solveTwo(input), "bonjour") // found 82464 too high
    // } catch (error) {
        // console.error(`Got an error: ${error.message}`)
    // }
})()

// ============================ PART I ============================
// Let the state of a reindeer (or anything traversing the maze) the cartesian product between its position and its direction.
// Similarly, each state has a minimum score.
// Using a Dijkstra's algorithm, we are going to calculate the minimum score of each state the reindeer can have and traverse the maze as we do.
// We will finally reach the end of a maze and get its minimum score regardless of the direction we reached the position with.

function solveOne(input){
    // Parsing
    input = input.trim().split("\n")

    let maze = []
    input.forEach(line => {
        maze.push(line.trim().split(""))
    });
    // console.table(maze);

    // Setup
    const maxRow = maze.length
    const maxCol = maze[0].length

    const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]] // ["N", "E", "S", "W"]
    
    // Let a state be represented as a position and a direction
    const scores = {} // minimum score to get to a position and direction, following the rules. key is a state, value is the minimum score to reach the state
    const precedents = {} // key is a state, value is its previous state (not implemented, to do so modify the elements inside queue so they keep track of the precedent)

    const minScores = Array.from({length: maxRow}, () => Array(maxCol).fill(Infinity)) // An array with the minimum score for each position of the maze

    const valid = new Set() // every cell but walls

    let start
    let end

    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(maze[row][col] === "S") start = [row, col]
            if(maze[row][col] === "E") end = [row, col]
            if(maze[row][col] !== "#") valid.add(`${[row, col]}`)
        }
    }

    // Our queue will track the state (position and direction) and the score
    const initial = [start, 1, 0] // (position: [row, col], direction: index of DIRS, score)
    const queue = [initial]

    // Visit every states, and get the minimum score to achieve such state. Stop when reaching the end.
    let res
    while(queue.length > 0){
        //Visit the unvisited state with the minimum score. Sort the queue by score (heap simulation)
        queue.sort((a,b) => a[2] - b[2])

        const [position, direction, score] = queue.shift()
        const key = `${position[0]}, ${position[1]}, ${direction}` // a state

        if(key in scores) continue // Ignore if we already calculated the score of this state

        // Update otherwise
        scores[key] = score
        // precedents[key] = precedent
        minScores[position[0]][position[1]] = Math.min(minScores[position[0]][position[1]], score)

        // target reached
        if(position[0] === end[0] && position[1] === end[1]){
            res = score
            break
        }

        // Onto the next
        const forwardPos = [ position[0]+DIRS[direction][0] , position[1]+DIRS[direction][1] ]
        // Add forward if possible
        if(valid.has(`${forwardPos}`)){
            queue.push( [forwardPos, direction, score+1] )
        }
        // Turns
        queue.push( [position, (direction+1) % 4, score+1000] ) // Right turn
        queue.push( [position, (direction+3) % 4, score+1000] ) // Left turn (-1 would make things complicated)
    }

    console.table(minScores)

    console.log(res)

    return res
}

// ============================ PART II ============================
function solveTwo(input){
    
}
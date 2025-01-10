const fs = require("fs");
const assert = require("assert");
const { log } = require("util");


(() => {
    try {
        const example1 = fs.readFileSync(__dirname + "/example1.txt").toString()
        const example2 = fs.readFileSync(__dirname + "/example2.txt").toString()
        const example3 = fs.readFileSync(__dirname + "/example3.txt").toString()
        const example4 = fs.readFileSync(__dirname + "/example4.txt").toString()
        const example5 = fs.readFileSync(__dirname + "/example5.txt").toString()
        const example6 = fs.readFileSync(__dirname + "/example6.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example1), 7036) // 7036
        // assert.deepStrictEqual(solveOne(example2), 11048) // 11048
        // assert.deepStrictEqual(solveOne(example3), 21148) // 21148
        // assert.deepStrictEqual(solveOne(example4), 4013) // 4013
        // assert.deepStrictEqual(solveOne(input), 82460) // 82460

        assert.deepStrictEqual(solveTwo(example1), 45) // 45
        assert.deepStrictEqual(solveTwo(example2), 64) // 64
        assert.deepStrictEqual(solveTwo(example3), 149) // 149
        assert.deepStrictEqual(solveTwo(example4), 14) // 14
        assert.deepStrictEqual(solveTwo(example5), 21) // 21
        assert.deepStrictEqual(solveTwo(example6), 13) // 13
        assert.deepStrictEqual(solveTwo(input), 590) // 590
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
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
    const scores = {} // minimum score to get to a state (a position and direction), following the rules. key is a state, value is the minimum score to reach the state
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

    // Visit every state, and get the minimum score to achieve such state. Stop when reaching the end.
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

        // Target reached
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
// Every best path will eventually meet up at the same state (unless they meet at the end but with different direction, but have this covered too).
// Therefore, we will track every precedent state that led to a given state. If there are multiple, it is indicative of two paths joining.
// We will have a very similar Dijkstra's algorithm to do so. Additionally we will track the precedent state of a state to make the backtracking possible.
// Starting from the end, we will backtrack and unravel every precedent state, exploring multiple paths when needed all the way to the start and registering every position as we go.
// The total number of different positions is the answer.
function solveTwo(input){
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
    const scores = new Map() // minimum score to get to a state (a position and direction), following the rules. key is a state, value is the minimum score to reach the state
    const precedents = new Map() // key is a state, value is a set of precedent states that led to the key state with the same score

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
    const initial = [start, 1, 0, ""] // (position: [row, col], direction: index of DIRS, score, precedent: state String)
    const queue = [initial]

    // Dijkstra's to the end
    // Visit every state, and get the minimum score to achieve such state. Stop when reaching the end.
    let endScore = Infinity
    while(queue.length > 0){
        //Visit the unvisited state with the minimum score. Sort the queue by score (heap simulation)
        queue.sort((a,b) => a[2] - b[2])
        
        const [position, direction, score, precedent] = queue.shift()
        const key = `${position[0]}, ${position[1]}, ${direction}` // a state
        

        // If the state is in score, either we have a new precedent with the same score and we have an alternative path. Or most likely, we have a longer path and it is discarded.
        if(scores.has(key)){
            //Alternative same cost path, get its precedent
            if(score === scores.get(key)){
                precedents.get(key).add(precedent)
            }
            continue
        }

        // Update otherwise
        scores.set(key, score)
        // Create the precedent set of this state
        let set = new Set()
        set.add(precedent)
        precedents.set(key, set)


        // Target reached, minimum score found to reach the end
        if(position[0] === end[0] && position[1] === end[1]){
            endScore = Math.min(endScore, score)
            continue
        }

        // Stop when every paths are too big
        if(score > endScore) break

        // Onto the next
        const forwardPos = [ position[0]+DIRS[direction][0] , position[1]+DIRS[direction][1] ]
        // Add forward if possible
        if(valid.has(`${forwardPos}`)){
            queue.push( [forwardPos, direction, score+1, key] )
        }
        // Turns
        queue.push( [position, (direction+1) % 4, score+1000, key] ) // Right turn
        queue.push( [position, (direction+3) % 4, score+1000, key] ) // Left turn (-1 would make things complicated)
    }


    // Backtracking to register every paths
    const backtrackQueue = [] // queue of states
    // Get all minimum score states that got to the end
    for(let d=0 ; d<4 ; d++){
        const key = `${end[0]}, ${end[1]}, ${d}`
        if(scores.get(key) === endScore) backtrackQueue.push(key)
    }

    // console.log(precedents);

    const bestTilesPositions = new Set()
    while(backtrackQueue.length > 0){
        const state = backtrackQueue.pop()
        
        const [row, col, direction] = state.split(", ")

        // Get every precedents of a state, indicative of multiple maths
        const precs = precedents.get(state) // Set
        
        precs.forEach(prec => {
            if(prec === "") return
            
            backtrackQueue.push(prec)
        })

        bestTilesPositions.add(`${row}, ${col}`)
    }

    // console.log(bestTilesPositions)

    const res = bestTilesPositions.size
    console.log(res)
    return res
}
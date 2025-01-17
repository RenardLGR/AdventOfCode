const fs = require("fs");
const assert = require("assert");

let input = fs.readFileSync(__dirname + "/input.txt").toString()
let example = fs.readFileSync(__dirname + "/example.txt").toString()

// PARSING + SETUP
input = input.replaceAll("\r", "")
example = example.replaceAll("\r", "")
const bytesExample = example.split("\n").map(coord => coord.split(",").map(Number)) // Array< Array<x:Number, y:Number> >
const bytes = input.split("\n").map(coord => coord.split(",").map(Number)) // Array< Array<x:Number, y:Number> >

const exampleMaxRow = 7 // (0 to 6)
const exampleMaxCol = 7 // (0 to 6)

const maxRow = 71 // (0 to 70)
const maxCol = 71 // (0 to 70)

const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]] // ["N", "E", "S", "W"]

const gridExample = Array.from({length: exampleMaxRow}, () => Array(exampleMaxCol).fill("."))
const grid = Array.from({length: maxRow}, () => Array(maxCol).fill("."))

// ============================ PART I ============================

function solveOneExample(){
    bytesExample.forEach(([x, y], i) => {
        if(i > 11) return // we take only the first 12 bytes coordinates
        gridExample[y][x] = "#"
    })

    // console.table(gridExample)

    let isValid = new Set()
    for(let row=0 ; row<exampleMaxRow ; row++){
        for(let col=0 ; col<exampleMaxCol ; col++){
            if(gridExample[row][col] === ".") isValid.add(`${row}, ${col}`) // "y, x"
        }
    }
    let visited = new Set()
    // Dijkstra's
    const start = [0, 0]
    const end = [exampleMaxRow-1, exampleMaxCol-1]
    let init = [start[0], start[1], 0] // [row, col, dist]
    let heap = [init]
    let minSteps // minimum steps we need to get to the end
    while(heap.length > 0){
        heap.sort((a,b) => a[2] - b[2])
        const curr = heap.shift() // get the smallest distance position
        const positionString = `${curr[0]}, ${curr[1]}`

        if(curr[0] === end[0] && curr[1] === end[1]){
            minSteps = curr[2]
            break
        }

        if(visited.has(positionString)) continue

        visited.add(positionString)

        DIRS.forEach(offset => {
            const neighbor = [curr[0] + offset[0], curr[1] + offset[1]]
            const neighborString = `${neighbor[0]}, ${neighbor[1]}`
            if(isValid.has(neighborString)){
                heap.push([...neighbor, curr[2]+1])
            }
        })
    }

    console.log(minSteps)

    return minSteps
}

// assert.deepStrictEqual(solveOneExample(), 22) // 22

function solveOne(){
    bytes.forEach(([x, y], i) => {
        if(i > 1023) return // we take only the first 1024 bytes coordinates
        grid[y][x] = "#"
    })

    // console.table(grid)

    let isValid = new Set()
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(grid[row][col] === ".") isValid.add(`${row}, ${col}`) // "y, x"
        }
    }
    let visited = new Set()
    // Dijkstra's
    const start = [0, 0]
    const end = [maxRow-1, maxCol-1]
    let init = [start[0], start[1], 0] // [row, col, dist]
    let heap = [init]
    let minSteps // minimum steps we need to get to the end
    while(heap.length > 0){
        heap.sort((a,b) => a[2] - b[2])
        const curr = heap.shift() // get the smallest distance position
        const positionString = `${curr[0]}, ${curr[1]}`

        if(curr[0] === end[0] && curr[1] === end[1]){
            minSteps = curr[2]
            break
        }

        if(visited.has(positionString)) continue

        visited.add(positionString)

        DIRS.forEach(offset => {
            const neighbor = [curr[0] + offset[0], curr[1] + offset[1]]
            const neighborString = `${neighbor[0]}, ${neighbor[1]}`
            if(isValid.has(neighborString)){
                heap.push([...neighbor, curr[2]+1])
            }
        })
    }

    console.log(minSteps)

    return minSteps
}

// assert.deepStrictEqual(solveOne(), 338) // 338
// ============================ PART II ============================
// It seems brute-force-able, run Dijkstra's on every newly added byte/obstacle until it can no longer find the end.

function solveTwo(){
    const start = [0, 0]
    const end = [maxRow-1, maxCol-1]
    
    let bytesIndex = 0
    let isValid = new Set()
    // At the beginning every position is valid
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            isValid.add(`${row}, ${col}`) // "y, x"
        }
    }

    while(bytesIndex < bytes.length-1){
        // if(bytesIndex%100 === 0) console.log("testing byte:", bytesIndex, "over ", bytes.length-1)
        const [byteCol, byteRow] = bytes[bytesIndex]
        const byteString = `${byteRow}, ${byteCol}`
        isValid.delete(byteString)

        // We know from part I, the end is still reachable after 1024 bytes
        if(bytesIndex < 1023){
            bytesIndex++
            continue
        }

        // Dijkstra's for the attempted grid
        let visited = new Set()
        let init = [start[0], start[1], 0] // [row, col, dist]
        let heap = [init]
        let isEndReachable = false
        while(heap.length > 0){
            heap.sort((a,b) => a[2] - b[2])
            const curr = heap.shift() // get the smallest distance position
            const positionString = `${curr[0]}, ${curr[1]}`
    
            if(curr[0] === end[0] && curr[1] === end[1]){
                isEndReachable = true
                break
            }
    
            if(visited.has(positionString)) continue
    
            visited.add(positionString)
    
            DIRS.forEach(offset => {
                const neighbor = [curr[0] + offset[0], curr[1] + offset[1]]
                const neighborString = `${neighbor[0]}, ${neighbor[1]}`
                if(isValid.has(neighborString)){
                    heap.push([...neighbor, curr[2]+1])
                }
            })
        }

        if(isEndReachable){
            bytesIndex++
            continue
        }else{
            let res = bytes[bytesIndex].join(",")
            console.log(res)
            return res
        }
    }
}

// assert.deepStrictEqual(solveTwo(), "20,44") // "20,44" in 32.88 seconds
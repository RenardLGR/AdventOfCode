const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        assert.deepStrictEqual(solveExample(example), "bonjour")
        // assert.deepStrictEqual(solveOne(input), "bonjour")
        // assert.deepStrictEqual(solveTwoExample(example), "bonjour")
        // assert.deepStrictEqual(solveTwo(input), "bonjour")
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

// ============================ PART I ============================
function solveExample(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }
}


function solveOne(input){
    
}

// ============================ PART II ============================
function solveTwoExample(input){
    input = input.replaceAll("\r", "")
    
    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }
}

function solveTwo(input){
    
}

// ============================ OOP STYLE ============================
class Grid{
    constructor(input){
        this.matrix = input.trim().split("\n").map(l => l.trim().split(""))
        this.maxRow = this.matrix.length
        this.maxCol = this.matrix[0].length
    }

    solveOne(){

    }

    solveTwo(){
        
    }

    // void : Array<Array>
    // For various needs, get a matrix of the same dimension as the input but with only undefined in each position/cell
    getUndefinedMatrix(){
        return Array.from({length: this.maxRow}, () => Array(this.maxCol).fill(undefined))
    }

    // Array<row: Number, col: Number> : Array<Array<row: Number, col: Number>>
    // From a position [row, col], return an array containing the position of its von Neumann (shaped like a plus sign) neighbors
    vonNeumannNeighbors(position){
        let offsets = [[-1, 0], [0, 1], [1, 0], [0, -1]]
        let res = []

        for(let offset of offsets){
            let [row, col] = [position[0] + offset[0], position[1] + offset[1]]

            if(row>=0 && row<this.maxRow && col>=0 && col<this.maxCol) res.push([row, col])
        }

        return res
    }
}

// ============================ CALLS ============================
(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        const gridExample = new Grid(example)
        const gridInput = new Grid(input)
        // assert.deepStrictEqual(gridExample.solveOne(), "bonjour")
        // assert.deepStrictEqual(gridInput.solveOne(), "bonjour") // "bonjour"
        // assert.deepStrictEqual(gridExample.solveTwo(), "bonjour")
        assert.deepStrictEqual(gridInput.solveTwo(), "bonjour") // "bonjour"
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()
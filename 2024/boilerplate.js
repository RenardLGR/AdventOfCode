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

class Grid{
    constructor(input){
        this.matrix = input.trim().split("\n").map(l => l.trim().split(""))
        this.maxRow = this.matrix.length
        this.maxCol = this.matrix[0].length
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
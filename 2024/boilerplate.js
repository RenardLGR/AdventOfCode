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

function solveExample(input){

}

function solveOne(input){
    
}

function solveTwoExample(input){

}

function solveTwo(input){
    
}
const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
        const example2 = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveExample(example), 161)
        // assert.deepStrictEqual(solveOne(input), 180233229) //180233229
        // assert.deepStrictEqual(solveTwoExample(example2), 48)
        assert.deepStrictEqual(solveTwo(input), 95411583) // 95411583
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()


// ============================ PART 1 ============================
function solveExample(input){
    return solveLine(input)
}

// String : Number
// Able to extract the sum of products, as expected in part I
function solveLine(line){
    const regex = /mul\(\d{1,3},\d{1,3}\)/g
    const matches = [...line.matchAll(regex)].map(m => m[0])
    // console.log(matches);
    
    
    const numberRegex = /\d+/g
    let res = 0
    matches.forEach(match => {
        let numbers = [...match.matchAll(numberRegex)].map(m => Number(m[0]))
        res += numbers[0] * numbers[1]
    })

    return res
}

function solveOne(input){
    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    let res = 0
    lines.forEach(l => {
        res += solveLine(l)
    })

    return res
}

// ============================ PART 2 ============================
// String : Number
// From a string looking like : "mul(XXX,XXX)" ; return the expected product
function mul(str){
    const operands = [...str.matchAll(/\d+/g)].map(m => Number(m[0]))

    return operands[0] * operands[1]
}

// String : Number
// From a string with many instructions and obstructions like : xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5)) ; Able to extract the sum of products, as expected in part II
function solveTwoLine(line){
    const regex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g
    let matches = [...line.matchAll(regex)].map(m => m[0])
    console.log(matches);
    

    let res = 0
    let isDo = true
    matches.forEach(instruction => {
        if(instruction === "do()"){
            isDo = true
        }
        else if(instruction === "don't()"){
            isDo = false
        }else{
            if(isDo){
                res += mul(instruction)
            }
        }
    })

    return res
}

function solveTwoExample(input){
    return solveTwoLine(input)
}

function solveTwo(input){
    const regex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g
    let matches = [...input.matchAll(regex)].map(m => m[0])

    let res = 0
    let isDo = true
    matches.forEach(instruction => {
        if(instruction === "do()"){
            isDo = true
        }
        else if(instruction === "don't()"){
            isDo = false
        }else{
            if(isDo){
                res += mul(instruction)
            }
        }
    })
    console.log(res);

    return res
}
const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 3749)
        // assert.deepStrictEqual(solveOne(input), 4555081946288) // 4555081946288
        // assert.deepStrictEqual(solveTwo(example), 11387)
        assert.deepStrictEqual(solveTwo(input), 227921760109726) // 227921760109726
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

    //Array of Objects {result: Number, operands: Array<Number>}
    //Example 190: 10 19 becomes {result: 190, operands: [10, 19]}
    equations = lines.map(l => {
        let [result, operands] = l.split(": ")
        result = Number(result)
        operands = operands.split(" ").map(Number)
        // return {result: result, operands: operands}
        return {result, operands}
    })

    let res = 0

    equations.forEach(eq => {
        let target = eq.result
        let operands = eq.operands
        if(isEquationPossible(target, operands)) res += target
    })

    console.log(res)

    return res
}

// (target: Number, operands: Array<Number>) : Boolean
// Check if an equation is possible with the operators "+" or "*" and the given operands
function isEquationPossible(target, operands){
    operands = operands.slice() // cpy
    // We can't have current initialized to 0 as it will bug for multiplication.
    // We can't have current initialized to 1 as it will bug for addition.
    let start = operands.shift()

    return solve(start, [], operands)

    function solve(current, inProgress, remaining){
        // current can only increase
        if(current > target) return false
        if(remaining.length === 0 && current === target){
            return inProgress
        }
        if(remaining.length === 0) return false

        let newRemaining = remaining.slice()
        let trying = newRemaining.shift()
        return solve(current*trying, [...inProgress, "*"], newRemaining) || solve(current+trying, [...inProgress, "+"], newRemaining)
    }
}

// console.log(isEquationPossible(292, [11, 6, 16, 20])) // ["+", "*", "+"]


//! Feel free to delete that
//Given the two choices "+", "*" and a length of 3 ; there are 2^3 different combinations
function combinations(length){
    let res = []

    combinator([])

    console.log(res.length)

    return res
    
    function combinator(inP){
        if(inP.length === length){
            res.push([...inP])
            return
        }
        combinator([...inP, "+"])
        combinator([...inP, "*"])
    }
}

// console.log(combinations(3)); 



// ============================ PART II ============================
// isEquationPossible(target, operands) is slightly modified to take into account the new operator
function solveTwo(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    //Array of Objects {result: Number, operands: Array<Number>}
    //Example 190: 10 19 becomes {result: 190, operands: [10, 19]}
    equations = lines.map(l => {
        let [result, operands] = l.split(": ")
        result = Number(result)
        operands = operands.split(" ").map(Number)
        // return {result: result, operands: operands}
        return {result, operands}
    })

    let res = 0

    equations.forEach(eq => {
        let target = eq.result
        let operands = eq.operands
        // if(isEquationPossibleTwo(target, operands)) res += target
        if(isEquationPossibleTwoBis(target, operands)) res += target
    })

    console.log(res)

    return res
}

// (target: Number, operands: Array<Number>) : Boolean
// Check if an equation is possible with the operators "+" or "*" or "||" and the given operands
function isEquationPossibleTwo(target, operands){
    operands = operands.slice() // cpy
    // We can't have current initialized to 0 as it will bug for multiplication.
    // We can't have current initialized to 1 as it will bug for addition.
    let start = operands.shift()

    return solve(start, [], operands)

    function solve(current, inProgress, remaining){
        // current can only increase
        if(current > target) return false
        if(remaining.length === 0 && current === target){
            return inProgress
        }
        if(remaining.length === 0) return false

        let newRemaining = remaining.slice()
        let trying = newRemaining.shift()
        let pipeOperand = Number(""+current+trying)
        return solve(current*trying, [...inProgress, "*"], newRemaining) || solve(current+trying, [...inProgress, "+"], newRemaining) || solve(pipeOperand, [...inProgress, "||"], newRemaining)
    }
}

// console.log(isEquationPossibleTwo(292, [11, 6, 16, 20])) // ["+", "*", "+"]
// console.log(isEquationPossibleTwo(7290, [6, 8, 6, 15])) // ["*", "||", "*"]
// console.log(isEquationPossibleTwo(192, [17, 8, 14])) // ["||", "+"]

// (target: Number, operands: Array<Number>) : Boolean
// Check if an equation is possible with the operators "+" or "*" or "||" and the given operands
function isEquationPossibleTwoBis(target, operands){
    // We can't have current initialized to 0 as it will bug for multiplication.
    // We can't have current initialized to 1 as it will bug for addition.
    let start = operands[0]

    return solve(start, [], 1)

    function solve(current, inProgress, operandIdx){
        // current can only increase
        if(current > target) return false
        if(operandIdx === operands.length && current === target){
            return inProgress
        }
        if(operandIdx === operands.length) return false

        let trying = operands[operandIdx]
        let pipeOperand = Number(""+current+trying)
        return solve(current*trying, [...inProgress, "*"], operandIdx+1) || solve(current+trying, [...inProgress, "+"], operandIdx+1) || solve(pipeOperand, [...inProgress, "||"], operandIdx+1)
    }
}

// console.log(isEquationPossibleTwoBis(292, [11, 6, 16, 20])) // ["+", "*", "+"]
// console.log(isEquationPossibleTwoBis(7290, [6, 8, 6, 15])) // ["*", "||", "*"]
// console.log(isEquationPossibleTwoBis(192, [17, 8, 14])) // ["||", "+"]
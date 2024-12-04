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
        // assert.deepStrictEqual(solveTwo(input), 95411583) // 95411583
        // assert.deepStrictEqual(solveTwoBis(input), 95411583) // 95411583
        // assert.deepStrictEqual(solveTwoTer(input), 95411583) // 95411583
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
    //Separating by line is useless, we can call the match with mul(XXX,XXX) on the whole input
    
    return solveLine(input)
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
    const regex2 = /mul\(\d{1,3},\d{1,3}\)|do(|n't)\(\)/g // same as above refactored
    let matches = [...line.matchAll(regex)].map(m => m[0])
    // console.log(matches);
    

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

//Line separation doesn't modify the status of do(). Separating by line is hence useless
//Yes, this function is indeed in fact the same exact function than solveTwoLine(line)
function solveTwo(input){
    const regex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g
    const regex2 = /mul\(\d{1,3},\d{1,3}\)|do(|n't)\(\)/g // same as above refactored
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
    // console.log(res);
    
    // return solveTwoLine(input)
    return res
}


//Nested loop, at each mul(), the nested loop traverses back to find the do() or don't()
function solveTwoBis(input){
    const regex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g
    const matches = [...input.matchAll(regex)].map(subArray => subArray[0])

    let res = 0
    for(let i=0 ; i<matches.length ; i++){
        //If I have a mul() instruction, check whether the instruction before is do() or don't(), if its do(), consider mul(), otherwise don't
        let instruction = matches[i]
        //mul() instruction
        if(instruction[0] === "m"){
            //check behind me if I have do() or don't()
            let j = i-1
            for(; j>=0 ; j--){
                if(matches[j] === "do()"){
                    res += mul(instruction)
                    break
                }else if(matches[j] === "don't()"){
                    break
                }
            }
            //edge case where I have neither do() or don't() ; first elements
            if(j < 0){
                res += mul(instruction)
            }
        }
    }
    // console.log(res);
    
    return res
}

// Same than before, easy workaround for the edge case
function solveTwoTer(input){
    const regex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g
    const matches = [...input.matchAll(regex)].map(subArray => subArray[0])
    matches.unshift('do()')

    let res = 0
    for(let i=0 ; i<matches.length ; i++){
        //If I have a mul() instruction, check whether the instruction before is do() or don't(), if its do(), consider mul(), otherwise don't
        let instruction = matches[i]
        //mul() instruction
        if(instruction[0] === "m"){
            //check behind me if I have do() or don't()
            for(let j = i-1; j>=0 ; j--){
                if(matches[j] === "do()"){
                    res += mul(instruction)
                    break
                }else if(matches[j] === "don't()"){
                    break
                }
            }
        }
    }
    // console.log(res);
    
    return res
}
const fs = require("fs");
const assert = require("assert");

(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveExample(example), 2)
        // assert.deepStrictEqual(solveOne(input), 686) //686
        // assert.deepStrictEqual(solveTwoExample(example), 4)
        // assert.deepStrictEqual(solveTwo(input), 717) //717
        assert.deepStrictEqual(solveTwoBis(input), 717) //717
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

function solveExample(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    lines = lines.map(l => l.split(" ").map(Number))
    
    let res = 0 //number of reports that are safe
    lines.forEach((l => {
        let isIncreasing = l[1] - l[0] > 0
        for(let i=1 ; i<l.length ; i++){
            if(isIncreasing && (l[i] - l[i-1] <= 0 || l[i] - l[i-1] > 3)){
                //if increasing we can only accept a difference of 1, 2 or 3
                return
            }
            if(!isIncreasing && (l[i] - l[i-1] <= -4 || l[i] - l[i-1] > -1)){
                //if increasing we can only accept a difference of -3, -2 or -1
                return
            }
        }
        //if no early returns were found, report is safe
        res++
    }))

    // console.log(res);
    
    return res
}

function solveOne(input){
    return solveExample(input)
}

function solveTwoExample(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    lines = lines.map(l => l.split(" ").map(Number))
    
    let res = 0 //number of reports that are safe
    lines.forEach((l => {
        //Not saying it is the best way, but try to iterate through the line and remove a level, if at least one report is now safe, the line is safe
        if(tryLine(l)){
            res++
        }else{
            //try every array with a level missing
            for(let i=0 ; i<l.length ; i++){
                let newLine = l.slice()
                newLine.splice(i,1)
                if(tryLine(newLine)){
                    res++
                    return
                }
            }
        }
    }))

    console.log(res)

    return res


    // HELPER
    // Following the rules of Part I, check if a line is safe
    // Array<Number> : Boolean
    function tryLine(l){
        let isIncreasing = l[1] - l[0] > 0
        for(let i=1 ; i<l.length ; i++){
            if(isIncreasing && (l[i] - l[i-1] <= 0 || l[i] - l[i-1] > 3)){
                //if increasing we can only accept a difference of 1, 2 or 3
                return false
            }
            if(!isIncreasing && (l[i] - l[i-1] <= -4 || l[i] - l[i-1] > -1)){
                //if increasing we can only accept a difference of -3, -2 or -1
                return false
            }
        }
        return true
    }
}

function solveTwo(input){
    return solveTwoExample(input)
}


function solveTwoBis(input){
    // I thought about doing a loop over l, when an error is found, raise a flag errorFound = true, slice of the the error and creating a new array, newLine = l.slice(); newLine.splice(i, 1); i-- and keep on going with the loop until we find another error in which case the line is definitely dropped but if no other error is found its ok.
    // The issue that arises is we can't ever exclude the 0th element.
    // We could deal with that edge case but it seems complicated
    // Example : [84, 86, 85, 82, 81, 79, 76, 75]
    // I thought about doing two loops, starting at head and tail, each going in its direction and stopping when an error is found, if they stop at the same error we could pinpoint the error and remove it. But again we have issue if the error is at an extremity.

    // We could also count how many errors there is, reset isIncreasing accordingly starting from i, the index of the error

    // In conclusion, finding an error gives the culprit with a +1 or -2 index. We will try a line with each of the suspect out and maybe get a correct line.

    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    lines = lines.map(l => l.split(" ").map(Number))
    
    let res = 0 //number of reports that are safe
    lines.forEach((l => {
        let errorIdx = errorFoundAt(l)
        if(errorIdx === -1){
            res++
            return
        }else{
            let tryStart = Math.max(0, errorIdx-2)
            let tryEnd = Math.min(errorIdx+1, l.length-1)
            for(let tryWithout=tryStart ; tryWithout<=tryEnd ; tryWithout++){
                let newLine = l.slice()
                newLine.splice(tryWithout, 1)
                if(errorFoundAt(newLine) === -1){
                    res++
                    return
                }
            }
        }
    }))

    console.log(res)

    return res


    // HELPER
    // Following the rules of Part I, return where the error was found at, if no error was found, return -1 which means the line is safe
    // Array<Number> : Boolean
    function errorFoundAt(l){
        let error = -1
        let isIncreasing = l[1] - l[0] > 0
        for(let i=1 ; i<l.length ; i++){
            if(isIncreasing && (l[i] - l[i-1] <= 0 || l[i] - l[i-1] > 3)){
                //if increasing we can only accept a difference of 1, 2 or 3
                error = i
                break
            }
            if(!isIncreasing && (l[i] - l[i-1] <= -4 || l[i] - l[i-1] > -1)){
                //if increasing we can only accept a difference of -3, -2 or -1
                error = i
                break
            }
        }
        return error
    }
}
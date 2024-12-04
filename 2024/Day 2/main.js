const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveExample(example), 2)
        // assert.deepStrictEqual(solveOne(input), 686) //686
        console.log(solveOneER(input))
        // assert.deepStrictEqual(solveTwoExample(example), 4)
        // assert.deepStrictEqual(solveTwo(input), 717) //717
        // assert.deepStrictEqual(solveTwoBis(input), 717) //717
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


//doesnt work
function solveTwoBis(input){
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    lines = lines.map(l => l.split(" ").map(Number))
    
    let res = 0 //number of reports that are safe
    lines.forEach((l => {
        // I thought about doing a loop over l, when an error is found, raise a flag errorFound = true, slice of the the error and creating a new array, newLine = l.slice(); newLine.splice(i, 1); i-- and keep on going with the loop until we find another error in which case the line is definitely dropped but if no other error is found its ok.
        // The issue that arises is we can't ever exclude the 0th element.
        // We could deal with that edge case but it seems complicated

        // We could also count how many errors there is, reset isIncreasing accordingly starting from i, the index of the error


        let isHeadIncreasing = l[1] - l[0] > 0
        let isTailIncreasing = l[l.length-1] - l[l.length-2] > 0 // meaning, reading the tail's elements from left to right, the elements are increasing
        let head = 1
        let tail = l.length-2
        let headFlagIndx = undefined
        let tailFlagIndx = undefined
        for(let i=0 ; i<l.length-1 ; i++){
            if(isHeadIncreasing && (l[head] - l[head-1] <= 0 || l[head] - l[head-1] > 3)){
                //if increasing we can only accept a difference of 1, 2 or 3
                if(headFlagIndx === undefined){
                    headFlagIndx = head
                }
            }
            if(!isHeadIncreasing && (l[head] - l[head-1] <= -4 || l[head] - l[head-1] > -1)){
                //if increasing we can only accept a difference of -3, -2 or -1
                if(headFlagIndx === undefined){
                    headFlagIndx = head
                }
            }
            if(isTailIncreasing && (l[tail+1] - l[tail] <= 0 || l[tail+1] - l[tail] > 3)){
                //if increasing we can only accept a difference of 1, 2 or 3
                if(headFlagIndx === undefined){
                    headFlagIndx = head
                }
            }
            if(!isTailIncreasing && (l[tail+1] - l[tail] <= -4 || l[tail+1] - l[tail] > -1)){
                //if increasing we can only accept a difference of -3, -2 or -1
                if(tailFlagIndx === undefined){
                    tailFlagIndx = tail
                }
            }
        }
        // if the error was at the same place or they are both undefined, we have a safe report
        if(headFlagIndx === tailFlagIndx){
            console.log("Is it really safe, pls check");
            console.log(l);
            
            
            res++
        }
    }))

    // console.log(res);
    
    return res
}
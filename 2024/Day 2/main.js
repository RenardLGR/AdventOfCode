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
        assert.deepStrictEqual(solveTwo(input), 717) //717
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


    //HELPER
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
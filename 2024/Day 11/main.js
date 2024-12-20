const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = "125 17"
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 55312)
        // assert.deepStrictEqual(solveOne(input), 186203)
        // assert.deepStrictEqual(solveTwo(example), 65601038650482) // 65601038650482
        assert.deepStrictEqual(solveTwo(input), 221291560078593) // 221291560078593

    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

// ============================ PART I ============================
function solveOne(input){
    input = input.trim()

    let stones = input.split(" ").map(Number)

    for(let blinks=0 ; blinks<25 ; blinks++){
        let nextGen = []
        for(let i=0 ; i<stones.length ; i++){
            let stone = stones[i]
            if(stone === 0){
                nextGen.push(1)
            }
            else if((""+stone).length%2 === 0){
                let str = ""+stone
                let left = Number(str.slice(0, str.length/2))
                let right = Number(str.slice(str.length/2))
                nextGen.push(left)
                nextGen.push(right)
            }
            else{
                nextGen.push(stone * 2024)
            }
        }
        stones = nextGen
    }

    let res = stones.length

    console.log(res)

    return res
}

// ============================ PART II ============================
// Using a nested Objects memoization. First layer has generationLeft as keys, second has stone as keys.
// memo[generationLeft][stone] will give the final length created from this branch.
function solveTwo(input){
    input = input.trim()

    let stones = input.split(" ").map(Number)
    let res = 0
    let memo = {}

    stones.forEach(stone => {
        res += getLength(stone, 75)
    })

    console.log(res)

    return res


    function getLength(stone, generationLeft){
        //base case
        if(generationLeft === 0){
            return 1
        }

        //check if the generation is present in memo
        if(memo[generationLeft] !== undefined){
            //check if stone is present in this generation
            if(memo[generationLeft][stone] !== undefined){
                return memo[generationLeft][stone]
            }

            //otherwise recursively find the answer using the rules
            //rule 1
            if(stone === 0){
                memo[generationLeft][stone] = getLength(1, generationLeft-1)
            }
            //rule 2
            else if((""+stone).length%2 === 0){
                let str = ""+stone
                let left = Number(str.slice(0, str.length/2))
                let right = Number(str.slice(str.length/2))

                memo[generationLeft][stone] = getLength(left, generationLeft-1) + getLength(right, generationLeft-1)
            }
            //general case
            else{
                memo[generationLeft][stone] = getLength(stone*2024, generationLeft-1)
            }
            return memo[generationLeft][stone]
        }
        // if the generation is NOT present in memo, create it repeat this step
        else{
            memo[generationLeft] = {}
            return getLength(stone, generationLeft)
        }
    }
}

// Same but using the Map object
function solveTwoBis(input){
    
}
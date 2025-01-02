const fs = require("fs");
const assert = require("assert");


(() => {
    // try {
        const smallExample = fs.readFileSync(__dirname + "/small-example.txt").toString()
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(smallExample), 2028) // 2028
        // assert.deepStrictEqual(solveOne(example), 10092) // 10092
        assert.deepStrictEqual(solveOne(input), 1294459) // 1294459
        // assert.deepStrictEqual(solveTwoExample(example), "bonjour")
        // assert.deepStrictEqual(solveTwo(input), "bonjour")
    // } catch (error) {
        // console.error(`Got an error: ${error.message}`)
    // }
})()

// ============================ PART I ============================
function solveOne(input){
    input = input.trim().replaceAll("\r", "")

    let [map, movements] = input.split("\n\n")
    movements = movements.split("\n").join("")
    const matrix = map.split("\n").map(l => [...l])
    const maxRow = matrix.length 
    const maxCol = matrix[0].length 

    const directions = {"^": [-1, 0], ">": [0, 1], "v": [1, 0], "<": [0, -1]}
    
    // Simulate the movements
    for(let move of movements){
        // Find the robot
        let robot = [undefined, undefined]
        for(let row=0 ; row<maxRow ; row++){
            for(let col=0 ; col<maxCol ; col++){
                if(matrix[row][col] === "@") robot = [row, col]
            }
        }

        const [rOffs, cOffs] = directions[move]

        let [rCur, cCur] = robot // initialize at robot
        let curItem = undefined
        let replacingItem = "." // replace the robot with a "."

        // Move the robot and the subsequent boxes (if any)
        do{
            curItem = matrix[rCur][cCur] // grab the item
            matrix[rCur][cCur] = replacingItem // replace it
            // onto the next
            replacingItem = curItem;
            [rCur, cCur] = [rCur+rOffs, cCur+cOffs];
        }
        while(replacingItem === "O" || replacingItem === "@")

        // If the last item grabbed is a wall, cancel everything, repeat every steps backwards
        if(replacingItem === "#"){
            [rCur, cCur] = [rCur-rOffs, cCur-cOffs];
            while(replacingItem !== "."){
                curItem = matrix[rCur][cCur] // grab the item
                matrix[rCur][cCur] = replacingItem // replace it
                // onto the next
                replacingItem = curItem;
                [rCur, cCur] = [rCur-rOffs, cCur-cOffs];
            }
        }
    }

    // Calculate res
    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "O"){
                res += row*100 + col
            }
        }
    }

    console.log(res)

    return res
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
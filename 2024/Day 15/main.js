const fs = require("fs");
const assert = require("assert");


(() => {
    // try {
        const smallExample = fs.readFileSync(__dirname + "/small-example.txt").toString()
        const smallExampleP2 = fs.readFileSync(__dirname + "/small-example-p2.txt").toString()
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(smallExample), 2028) // 2028
        // assert.deepStrictEqual(solveOne(example), 10092) // 10092
        // assert.deepStrictEqual(solveOne(input), 1294459) // 1294459

        // assert.deepStrictEqual(solveTwoBFS(smallExampleP2), 618) // 618
        // assert.deepStrictEqual(solveTwoBFS(example), 9021) // 9021
        // assert.deepStrictEqual(solveTwoBFS(input), 1319212) // 1319212

        // assert.deepStrictEqual(solveTwoDFS(smallExampleP2), 618) // 618
        assert.deepStrictEqual(solveTwoDFS(example), 9021) // 9021
        // assert.deepStrictEqual(solveTwoDFS(input), 1319212) // 1319212
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
function solveTwoBFS(input){
    input = input.trim().replaceAll("\r", "")

    let [map, movements] = input.split("\n\n")
    movements = movements.split("\n").join("")
    const oldMatrix = map.split("\n").map(l => [...l])
    let matrix = oldMatrix.map(r => {
        let res = []
        r.forEach(e => {
            if(e === "#"){
                res.push("#")
                res.push("#")
            }else if(e === "O"){
                res.push("[")
                res.push("]")
            }else if(e === "."){
                res.push(".")
                res.push(".")
            }else if(e === "@"){
                res.push("@")
                res.push(".")
            }
        });
        return res
    })
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

        const copy = deepCopyMatrix(matrix)

        let seen = new Set()
        let replacers = {} // coords as key, value is the element that would be inserted in coords

        let [rCur, cCur] = robot // initialize at robot
        let queue = [[rCur, cCur]] // Queue of items that need to be replaced
        seen.add(`${[rCur, cCur]}`)

        let isCancel = false

        while(queue.length > 0){
            const [rCur, cCur] = queue.shift()

            const replacer = replacers[`${[rCur, cCur]}`] || "." // If an element needs to be replaced, but there is no info by what is will be replaced, the default one is "."
            const replacee = matrix[rCur][cCur]; // element that will be replaced by replacer
            matrix[rCur][cCur] = replacer // replacing

            // Check the replacee, i.e. what was replaced, different behaviors for different items
            // if the replacee is a wall, cancel everything
            if(replacee === "#"){
                isCancel = true
                break
            }
            else if(replacee === "."){
            }
            // there is propagation toward direction for any of these items :
            else if(replacee === "@"){
                replacers[`${[rCur+rOffs, cCur+cOffs]}`] = replacee
                queue.push([rCur+rOffs, cCur+cOffs])
                seen.add(`${[rCur+rOffs, cCur+cOffs]}`)
            }
            else if(replacee === "["){
                replacers[`${[rCur+rOffs, cCur+cOffs]}`] = replacee
                if(!seen.has(`${[rCur+rOffs, cCur+cOffs]}`)){
                    queue.push([rCur+rOffs, cCur+cOffs])
                    seen.add(`${[rCur+rOffs, cCur+cOffs]}`)
                }
                //move closing "]"
                if(!seen.has(`${[rCur, cCur+1]}`)){
                    queue.push([rCur, cCur+1])
                    seen.add(`${[rCur, cCur+1]}`)
                }
            }
            else if(replacee === "]"){
                replacers[`${[rCur+rOffs, cCur+cOffs]}`] = replacee
                if(!seen.has(`${[rCur+rOffs, cCur+cOffs]}`)){
                    queue.push([rCur+rOffs, cCur+cOffs])
                    seen.add(`${[rCur+rOffs, cCur+cOffs]}`)
                }
                //move opening "["
                if(!seen.has(`${[rCur, cCur-1]}`)){
                    queue.push([rCur, cCur-1])
                    seen.add(`${[rCur, cCur-1]}`)
                }
            }
        }

        // If I cancel, just get back to the copy
        if(isCancel) matrix = copy

        // console.log("After move:", move)
        // console.table(matrix)
    }

    // console.table(matrix);
    

    // Calculate res
    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "["){
                res += row*100 + col
            }
        }
    }

    console.log(res)

    return res
}

// Same algorithm, using DFS now, using backtrack instead of a deep copy matrix
function solveTwoDFS(input){
    input = input.trim().replaceAll("\r", "")

    let [map, movements] = input.split("\n\n")
    movements = movements.split("\n").join("")
    const oldMatrix = map.split("\n").map(l => [...l])
    let matrix = oldMatrix.map(r => {
        let res = []
        r.forEach(e => {
            if(e === "#"){
                res.push("#")
                res.push("#")
            }else if(e === "O"){
                res.push("[")
                res.push("]")
            }else if(e === "."){
                res.push(".")
                res.push(".")
            }else if(e === "@"){
                res.push("@")
                res.push(".")
            }
        });
        return res
    })
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

        let seen = new Set()
        let replacers = {} // coords as key, value is the element that would be inserted in coords

        let [rCur, cCur] = robot // initialize at robot
        let stack = [[rCur, cCur]] // Stack of items that need to be replaced
        seen.add(`${[rCur, cCur]}`)

        let isWallAffected = false

        // Using a DFS, find all elements that are going to be replaced and by what. If no walls were affected, at the end replace everything
        while(stack.length > 0){
            const [rCur, cCur] = stack.pop()

            const replacee = matrix[rCur][cCur]; // element that will be replaced

            // Check the replacee, i.e. what was replaced, different behaviors for different items
            // The replacee will go toward the direction 
            // If the replacee is a wall, cancel everything
            if(replacee === "#"){
                isWallAffected = true
                break
            }
            else if(replacee === "."){
            }
            // there is propagation toward direction for any of these items :
            else if(replacee === "@"){
                replacers[`${[rCur+rOffs, cCur+cOffs]}`] = replacee
                if(!seen.has(`${rCur+rOffs, cCur+cOffs}`)){
                    stack.push([rCur+rOffs, cCur+cOffs])
                    seen.add(`${[rCur+rOffs, cCur+cOffs]}`)
                }
            }
            else if(replacee === "["){
                replacers[`${[rCur+rOffs, cCur+cOffs]}`] = replacee
                //propagate toward direction
                if(!seen.has(`${[rCur+rOffs, cCur+cOffs]}`)){
                    stack.push([rCur+rOffs, cCur+cOffs])
                    seen.add(`${[rCur+rOffs, cCur+cOffs]}`)
                }
                //closing "]", no info on the replacer
                if(!seen.has(`${[rCur, cCur+1]}`)){
                    stack.push([rCur, cCur+1])
                    seen.add(`${[rCur, cCur+1]}`)
                }
            }
            else if(replacee === "]"){
                replacers[`${[rCur+rOffs, cCur+cOffs]}`] = replacee
                //propagate toward direction
                if(!seen.has(`${[rCur+rOffs, cCur+cOffs]}`)){
                    stack.push([rCur+rOffs, cCur+cOffs])
                    seen.add(`${[rCur+rOffs, cCur+cOffs]}`)
                }
                //opening "[", no info on the replacer
                if(!seen.has(`${[rCur, cCur-1]}`)){
                    stack.push([rCur, cCur-1])
                    seen.add(`${[rCur, cCur-1]}`)
                }
            }
        }

        // console.log(seen);
        // console.log(replacers);
        

        // If no wall were affected, then the move was legal, apply every changes
        if(!isWallAffected){
            seen.forEach(s => {                
                const [r, c] = s.split(",").map(Number)
                matrix[r][c] = (replacers[s] || ".") // if there is no info on the replacer, it's "."
            })
        }
        // console.table(matrix)
    }

    // console.table(matrix);
    

    // Calculate res
    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] === "["){
                res += row*100 + col
            }
        }
    }

    console.log(res)

    return res
}

function deepCopyMatrix(matrix){
    const maxRow = matrix.length
    const maxCol = matrix[0].length
    let res = []
    for(let row=0 ; row<maxRow ; row++){
        res[row] = []
        for(let col=0 ; col<maxCol ; col++){
            res[row][col] = matrix[row][col]
        }
    }

    return res
}
const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 14)
        // assert.deepStrictEqual(solveOne(input), 344) // 344
        // assert.deepStrictEqual(solveTwo(example), 34)
        assert.deepStrictEqual(solveTwo(input), 1182) // 1182
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

// ============================ PART I ============================
// Let A of coordinates (x_A, y_A) and B of coordinates (x_B, y_B) two points of a cartesian plane.
// The vector from A to B is v_AB = (x_B - x_A, y_B - y_A). It represents the change in x and y needed to go from A to B.
// Let |v_AB| the magnitude of the vector v_AB. It represents the distance between A and B.
// Adding v_AB to A will naturally lead to B. And adding v_AB to B will lead us to a point N_B, where the distance between B and N_B is |v_AB| and the distance between A and N_B is 2|v_AB|
// A, B and N_B are all aligned.
// N_B is an antinode of the pair (A, B)
// Similarly, subtracting v_AB to A will lead us to the antinode N_A

// We have an easy way of finding both antinodes of a pair. But some of these antinodes will overlap and some will be out of bounds of the given matrix (map). We will take that into consideration.

// We will parse the input so we can have a data structure that allow us to easily have every pair of antennas of the same frequency.
// From there extract the vector between this pair. Find their respective antinodes and check if they meet the requirements. Count them.

// As a side note, given a set of size s of distinct elements, there are s choose 2 different pairs, C(n, k) = C(s, 2). Which compute to (! is the factorial sign) :
// C(n, k) = n! / k!(n-k)!   i.e    C(s, 2) = s! / 2!(s-2)! = s(s-1)(s-2)! / 2(s-2)! = s(s-1) / 2

function solveOne(input){
    // Step 1 : antennasFreqs will be the data structure used to extract every pair of antenna of the same frequency
    // Step 2 : double loop to find pairs and antinodes
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    let matrix = lines.map(l => [...l])

    let maxRow = matrix.length //12
    let maxCol = matrix[0].length //12
    

    // antennasFreqs will be an Object containing as keys the frequency and as values, an Array of positions of said antennas with said keys. Example :
    // {"0" : [[1,8], [2,5], [3,7], [4,4]],
    //  "A": [ [ 5, 6 ], [ 8, 8 ], [ 9, 9 ] ]}
    let antennasFreqs = {}
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] !== "."){
                antennasFreqs[matrix[row][col]] = (antennasFreqs[matrix[row][col]] || [])
                antennasFreqs[matrix[row][col]].push([row, col])
            }
        }
    }

    // reproduction of matrix where antinodes will be registered
    let antinodesMatrix = Array.from({length: maxRow}, () => Array(maxCol).fill(false))

    //For every pairs of antenna, two antinodes can be found, check and keep those that are in bounds
    for(let freq in antennasFreqs){
        let antennas = antennasFreqs[freq]
        //loop on the antennas of a single freq
        for(let i=0 ; i<antennas.length ; i++){
            //double loop to get pairs
            for(let j=i+1 ; j<antennas.length ; j++){
                let [rowi, coli] = antennas[i]
                let [rowj, colj] = antennas[j]
                let vector_ij = [rowj-rowi, colj-coli]

                //check if this antinode is in bound
                let antinodei = [rowi-vector_ij[0], coli-vector_ij[1]]
                if(antinodei[0]>=0 && antinodei[0]<maxRow && antinodei[1]>=0 && antinodei[1]<maxCol){
                    antinodesMatrix[antinodei[0]][antinodei[1]] = true
                }
                //check the other antinode
                let antinodej = [rowj+vector_ij[0], colj+vector_ij[1]]
                if(antinodej[0]>=0 && antinodej[0]<maxRow && antinodej[1]>=0 && antinodej[1]<maxCol){
                    antinodesMatrix[antinodej[0]][antinodej[1]] = true
                }
            }
        }
    }

    //Count antinodes
    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(antinodesMatrix[row][col]) res++
        }
    }

    console.log(res)

    return res
}


// ============================ PART II ============================
// The only difference with part I is that a pair (A, B) can have as many antinodes as possible in the matrix.
// For a pair (A, B), from A, ∀k∈ℕ A + k*v_AB is an antinode. Similarly, for B, B + k*v_AB is an antinode but they will overlap.

function solveTwo(input){
    // Step 1 : similar to part I
    // Step 2 : keep adding and subtracting v_AB from A of pair (A, B) until we are our of bounds.
    input = input.replaceAll("\r", "")

    let lines = input.split("\n")
    if(lines[lines.length-1] === ""){
        lines.pop()
    }

    let matrix = lines.map(l => [...l])

    let maxRow = matrix.length //50
    let maxCol = matrix[0].length //50
    

    // antennasFreqs will be an Object containing as keys the frequency and as values, an Array of positions of said antennas with said keys. Example :
    // {"0" : [[1,8], [2,5], [3,7], [4,4]],
    //  "A": [ [ 5, 6 ], [ 8, 8 ], [ 9, 9 ] ]}
    let antennasFreqs = {}
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(matrix[row][col] !== "."){
                antennasFreqs[matrix[row][col]] = (antennasFreqs[matrix[row][col]] || [])
                antennasFreqs[matrix[row][col]].push([row, col])
            }
        }
    }

    // reproduction of matrix where antinodes will be registered
    let antinodesMatrix = Array.from({length: maxRow}, () => Array(maxCol).fill(false))

    //For every pairs of antenna, two antinodes can be found, check and keep those that are in bounds
    for(let freq in antennasFreqs){
        let antennas = antennasFreqs[freq]
        //loop on the antennas of a single freq
        for(let i=0 ; i<antennas.length ; i++){
            //double loop to get pairs
            for(let j=i+1 ; j<antennas.length ; j++){
                let [rowi, coli] = antennas[i]
                let [rowj, colj] = antennas[j]
                antinodesMatrix[rowi][coli] = true // the current antenna i is the antinode of the current antenna j. Keep it.
                let vector_ij = [rowj-rowi, colj-coli]

                //Adding vector from antenna i
                let antinodek = [rowi-vector_ij[0], coli-vector_ij[1]]
                while(antinodek[0]>=0 && antinodek[0]<maxRow && antinodek[1]>=0 && antinodek[1]<maxCol){
                    antinodesMatrix[antinodek[0]][antinodek[1]] = true
                    antinodek[0] -= vector_ij[0]
                    antinodek[1] -= vector_ij[1]
                }
                //Subtracting vector from antenna i
                antinodek = [rowi+vector_ij[0], coli+vector_ij[1]]
                while(antinodek[0]>=0 && antinodek[0]<maxRow && antinodek[1]>=0 && antinodek[1]<maxCol){
                    antinodesMatrix[antinodek[0]][antinodek[1]] = true
                    antinodek[0] += vector_ij[0]
                    antinodek[1] += vector_ij[1]
                }
            }
        }
    }

    //Count antinodes
    let res = 0
    for(let row=0 ; row<maxRow ; row++){
        for(let col=0 ; col<maxCol ; col++){
            if(antinodesMatrix[row][col]) res++
        }
    }

    // let res = antinodesMatrix.reduce((acc, line) => acc + line.reduce((acc, curr) => curr ? acc + 1 : acc , 0) , 0)

    // function reducer(acc, cur){
    //     if(Array.isArray(cur)){
    //         return acc + cur.reduce(reducer, 0)
    //     }else{
    //         return acc + cur
    //     }
    // }
    // let res = antinodesMatrix.reduce(reducer, 0)

    // let res = antinodesMatrix.reduce(function reducer(acc, cur){return Array.isArray(cur) ? acc + cur.reduce(reducer, 0) : acc + cur}, 0)
    // let res = antinodesMatrix.reduce(reducer = (acc, cur) => Array.isArray(cur) ? acc + cur.reduce(reducer, 0) : acc + cur , 0)

    console.log(res)

    return res
    
}


function flatter(input){
    return input.reduce(reducer, [])
    
    function reducer(acc, cur){
        // base case
        if(!Array.isArray(cur)){
            return acc.concat(cur)
        }
        //recursive case
        return acc.concat(cur.reduce(reducer, []))
    }
}

let arr = [1, [[2, 3], 4], [5]]
let arr2 = [1, 2, [3, 4, [5, 6]]]

// console.log(flatter(arr)) // [ 1, 2, 3, 4, 5 ]
// console.log(flatter(arr2)) // [ 1, 2, 3, 4, 5, 6 ]
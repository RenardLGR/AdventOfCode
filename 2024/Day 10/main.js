const fs = require("fs");
const assert = require("assert");

// ============================ PART I ============================
// A 0 signals the start of a trail, do a dfs to know the score of the trail
// The score of a trail is how many 9 can be reached from this 0
class Grid{
    constructor(input){
        this.matrix = input.trim().split("\n").map(l => l.trim().split("").map(Number))
        this.maxRow = this.matrix.length
        this.maxCol = this.matrix[0].length
        this.scoreMap = Array.from({length: this.maxRow}, () => Array(this.maxCol).fill(undefined))
        this.ratingMap = Array.from({length: this.maxRow}, () => Array(this.maxCol).fill(undefined))
    }

    solveOne(){
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                if(this.matrix[row][col] === 0){
                    this.scoreMap[row][col] = this.getTrailScore([row, col])
                }
            }
        }

        // console.table(this.scoreMap);

        let res = 0

        // add the scores
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                if(this.scoreMap[row][col] !== undefined){
                    res += this.scoreMap[row][col]
                }
            }
        }

        console.log(res)

        return res
    }

    solveTwo(){
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                if(this.matrix[row][col] === 0){
                    this.ratingMap[row][col] = this.getTrailRating([row, col])
                }
            }
        }

        // console.table(this.ratingMap);

        let res = 0

        // add the scores
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                if(this.ratingMap[row][col] !== undefined){
                    res += this.ratingMap[row][col]
                }
            }
        }

        console.log(res)

        return res
    }

    
    // Array<row: Number, col: Number> : Number
    // From a starting position [row, col] i.e a 0, return the score of this trail, i.e the number of reachable 9
    getTrailScore(position){
        //grid reproduction keeping track of the 9-height positions reached
        let visited9 = Array.from({length: this.maxRow}, () => Array(this.maxCol).fill(false))

        //dfs
        //arrow function so this points to the Grid instance, arrow functions are also not hoisted like traditional functions
        const solve = (currPosition, currHeight) => {
            // base case
            if(currHeight === 9){ 
                visited9[currPosition[0]][currPosition[1]] = true
                return
            }

            let VNNeighbors = this.vonNeumannNeighbors(currPosition)
            for(let neighb of VNNeighbors){
                let [rown, coln] = neighb
                //keep on going if the height of the neighbor is one above the current height (as per the even, gradual, uphill slope rule)
                if(this.matrix[rown][coln] === currHeight + 1){
                    solve(neighb, currHeight + 1)
                }
            }
        }

        solve(position, 0)

        let score = 0   
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                if(visited9[row][col]) score++
            }
        }

        return score
    }

    // Array<row: Number, col: Number> : Number
    // From a starting position [row, col] i.e a 0, return the rating of this trail, i.e the number of paths leading to a 9
    getTrailRating(position){
        let rating = 0

        //dfs
        //arrow function so this points to the Grid instance, arrow functions are also not hoisted like traditional functions
        const solve = (currPosition, currHeight) => {
            // base case
            if(currHeight === 9){ 
                rating++
            }

            let VNNeighbors = this.vonNeumannNeighbors(currPosition)
            for(let neighb of VNNeighbors){
                let [rown, coln] = neighb
                //keep on going if the height of the neighbor is one above the current height (as per the even, gradual, uphill slope rule)
                if(this.matrix[rown][coln] === currHeight + 1){
                    solve(neighb, currHeight + 1)
                }
            }
        }

        solve(position, 0)

        return rating
    }


    // Array<row: Number, col: Number> : Array<Array<row: Number, col: Number>>
    // From a position [row, col], return an array containing the position of its von Neumann (shaped like a plus sign) neighbors
    vonNeumannNeighbors(position){
        let offsets = [[-1, 0], [0, 1], [1, 0], [0, -1]]
        let res = []

        for(let offset of offsets){
            let [row, col] = [position[0] + offset[0], position[1] + offset[1]]

            if(row>=0 && row<this.maxRow && col>=0 && col<this.maxCol) res.push([row, col])
        }

        return res
    }
}


// ============================ CALLS ============================
(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        const gridExample = new Grid(example)
        const gridInput = new Grid(input)
        // assert.deepStrictEqual(gridExample.solveOne(), 36)
        // assert.deepStrictEqual(gridInput.solveOne(), 778) // 778
        // assert.deepStrictEqual(gridExample.solveTwo(), 81)
        assert.deepStrictEqual(gridInput.solveTwo(), 1925) // 1925
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()
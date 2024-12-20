const fs = require("fs");
const assert = require("assert");

class Grid{
    constructor(input){
        this.matrix = input.trim().split("\n").map(l => l.trim().split(""))
        this.maxRow = this.matrix.length
        this.maxCol = this.matrix[0].length

        this.region = this.getRegions()
    }

    //We will start by creating a matrix of the regions, for each unvisited cell, a classic dfs called on its von Neumann neighbors (4 max) sharing the same type

    solveOne(){
        // A region is a group of connected cells (using 4-connectivity or Von Neumann connectivity) sharing the same type. We want to calculate the price for fencing a region.
        // For a region :
        // Each cell always has an area of 1
        // Each cell has a perimeter between 0 and 4 depending on how many of his von Neummann neighbors are in the same region.
        // For example, if 3 neighbors are in the same region, the perimeter of this cell will be 1. In other words, the perimeter increases by one for each alien region.
        // In addition, a cell on the matrix side will always increase its perimeter on said side

        // Loop on each cell, add the respective values to the respective regions

        // Region as keys
        let areas = {}
        let perimeters = {}

        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                const currRegion = this.region[row][col]
                // update areas
                areas[currRegion] = (areas[currRegion] || 0) + 1

                //update perimeters
                const neighbors = this.vonNeumannNeighbors([row, col])
                //a position on a side automatically gets perimeters
                let p = 4 - neighbors.length
                for(let neighbor of neighbors){
                    let [nrow, ncol] = neighbor
                    //if neighbor's region is different, increase perimeter
                    if(this.region[nrow][ncol] !== currRegion) p++
                }
                perimeters[currRegion] = (perimeters[currRegion] || 0) + p
            }
        }

        // console.log("areas", areas);
        // console.log("perimeters", perimeters);
        

        let res = 0

        for(let type in areas){
            let a = areas[type]
            let p = perimeters[type]

            res += a * p
        }

        console.log(res)

        return res
    }

    // void : Array<Array<>>
    // Give a region to every cells. The ID of their region doesn't really matter. Reminder : Each cell with the same region will be connected and have the same type.
    getRegions(){
        let region = this.getUndefinedMatrix()
        let regionID = 1

        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                //check if the cell has not being attributed a region yet
                if(!region[row][col]){
                    // get all positions of the region
                    let positions = this.getRegion([row, col])
                    for(let position of positions){
                        let [r, c] = position
                        region[r][c] = regionID
                    }
                    regionID++
                }
            }
        }

        return region
    }

    // Array<row: Number, col: Number> : Array<Array<row: Number, col: Number>>
    // From a position [row, col], return an array containing the position of each cells of the region the input is part of (input included)
    getRegion(position){
        let [row, col] = position
        let type = this.matrix[row][col]

        let visited = this.getUndefinedMatrix()
        let region = []

        // The call() method of Function instances calls this function with a given this value and arguments provided individually.
        // Its to avoid using an arrow function since they are not hoisted.
        dfs.call(this, position)

        return region

        function dfs(position){
            let [row, col] = position
            visited[row][col] = true
            region.push([row, col])

            let neighbors = this.vonNeumannNeighbors(position)
            for(let neighbor of neighbors){
                let [rown, coln] = neighbor
                if(this.matrix[rown][coln] === type && !visited[rown][coln]){
                    dfs.call(this, neighbor)
                }
            }
        }
    }

    // void : Array<Array>
    // For various needs, get a matrix of the same dimension as the input but with only undefined in each position/cell
    getUndefinedMatrix(){
        return Array.from({length: this.maxRow}, () => Array(this.maxCol).fill(undefined))
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
        const miniExample2 = fs.readFileSync(__dirname + "/mini-example-2.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        const gridExample = new Grid(example)
        const gridMiniExample2 = new Grid(miniExample2)
        const gridInput = new Grid(input)
        // assert.deepStrictEqual(gridExample.solveOne(), 1930)
        // assert.deepStrictEqual(gridMiniExample2.solveOne(), 772)
        assert.deepStrictEqual(gridInput.solveOne(), 1437300) // 1437300

        // assert.deepStrictEqual(gridInput.solveOne(), 778) // 778
        // assert.deepStrictEqual(gridExample.solveTwo(), 81)
        // assert.deepStrictEqual(gridInput.solveTwo(), 1925) // 1925
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()
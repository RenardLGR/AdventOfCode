const fs = require("fs");
const assert = require("assert");

class Grid{
    constructor(input){
        this.robots = this.getRobots(input) // an array of Objects robot with their position and speed
        this.widthExample = 11
        this.heightExample = 7
        this.width = 101
        this.height = 103
    }

    // Edit width and height if you want to run for example
    solveOne(){
        const iterations = 100

        let topLeftQuad = 0
        let topRightQuad = 0
        let bottomLeftQuad = 0
        let bottomRightQuad = 0

        const horizontalMiddle = Math.floor(this.height / 2) // skip this y
        const verticalMiddle = Math.floor(this.width / 2) // skip this x

        this.robots.forEach(robot => {
            //When dealing with negative sign :
            //To obtain a modulo in JavaScript, in place of n % d, use ((n % d) + d) % d
            const {x, y, vx, vy} = robot
            let newX = x + (vx * iterations)
            newX = ((newX%this.width) + this.width) % this.width
            let newY = y + (vy * iterations)
            newY = ((newY%this.height) + this.height) % this.height
            

            //not in a quadrant
            if(newX === verticalMiddle || newY === horizontalMiddle) return

            //left quadrant
            if(newX < verticalMiddle){
                //top left quadrant
                if(newY < horizontalMiddle) topLeftQuad++
                //bottom left quadrant
                else bottomLeftQuad++
            }
            //right quadrant
            else{
                //top right quadrant
                if(newY < horizontalMiddle) topRightQuad++
                //bottom right quadrant
                else bottomRightQuad++
            }
        })

        console.log("topLeftQuad:", topLeftQuad)
        console.log("topRightQuad:", topRightQuad)
        console.log("bottomLeftQuad:", bottomLeftQuad)
        console.log("bottomRightQuad:", bottomRightQuad)
        return topLeftQuad * topRightQuad * bottomLeftQuad * bottomRightQuad
    }

    solveTwo(){
        // The Christmas tree will have a rather long line of robots, check for this to happen.
        for(let i=0 ; i<10000 ; i++){
            const iterations = i
    
            //display:
            const grid = this.getDotMatrix(this.height, this.width)
    
            this.robots.forEach(robot => {
                //When dealing with negative sign :
                //To obtain a modulo in JavaScript, in place of n % d, use ((n % d) + d) % d
                const {x, y, vx, vy} = robot
                let newX = x + (vx * iterations)
                newX = ((newX%this.width) + this.width) % this.width
                let newY = y + (vy * iterations)
                newY = ((newY%this.height) + this.height) % this.height
    
                grid[newY][newX] = "•"
            })
    
            let flagKeep = false
            let generation = "This is generation :" + i + "\n"
            for(let y=0 ; y<this.height ; y++){
                let line = ""
                let consecutiveDots = 0
                let maxConsecutiveDots = 0 // max consecutive robots
                for(let x=0 ; x<this.width ; x++){
                    line += grid[y][x] === "•" ? "•" : " "
                    if(grid[y][x] === "•"){
                        consecutiveDots++
                    }else{
                        maxConsecutiveDots = Math.max(maxConsecutiveDots, consecutiveDots)
                        consecutiveDots = 0
                    }
                }
                
                if(maxConsecutiveDots > 10) flagKeep = true // that is a suspiciously long line of robots :D
                generation += line + "\n"
            }

            
            if(flagKeep){
                console.log(generation)
                return iterations
            }
        }
    }

    // parse the input, get an array of Objects robot with their position and speed : {x,y,vx,vy}
    getRobots(input){
        const lines = input.trim().split("\n")
        return lines.map(l => {
            const regex = /\-?\d+/g // numbers with an option sign in front
            const [x, y, vx, vy] = l.match(regex).map(Number)

            return {x, y, vx, vy}
        })
    }

    // void : Array<Array>
    // For various needs, get a matrix of the those dimensions with "." in every cells
    getDotMatrix(height, width){
        return Array.from({length: height}, () => Array(width).fill("."))
    }
}

// ============================ CALLS ============================
(() => {
    // try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        const gridExample = new Grid(example)
        const gridInput = new Grid(input)
        // assert.deepStrictEqual(gridExample.solveOne(), 12) // 12
        // assert.deepStrictEqual(gridInput.solveOne(), 222062148) // 222062148
        gridInput.solveTwo() // 7520
        // assert.deepStrictEqual(gridInput.solveTwo(), "bonjour") // "bonjour"
    // } catch (error) {
        // console.error(`Got an error: ${error.message}`)
    // }
})()
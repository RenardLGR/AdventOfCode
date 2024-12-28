const fs = require("fs");
const assert = require("assert");

// solveTwoTer(), solveTwoQuater() and solveTwoQuinqies() are quality code. The first two attempts were a bit messy.
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

        for(let region in areas){
            let a = areas[region]
            let p = perimeters[region]

            res += a * p
        }

        console.log(res)

        return res
    }

    solveTwo(){
        // Key takes : Corners give a general idea on sides.
        // An edge is two vertices connected. In our case, all edges are vertical or horizontal. The number of edges (sides) of a simple polygon always equals the number of vertices (corners). But we don't always deal with simple polygon here.
        // Each cell can have a maximum of 4 corners. Lets consider for this demonstration the North-East corner of a cell, and let's consider the adjacent cells of this corner. Namely the cells North, North-East and East of this cell.

        // The first part will focus on extracting corners, the second part will draw sides out of them.

        // PART I : is the current cell a corner?
        // bottom left ■ is the current cell we are checking if it's a corner or not, otherwise it is a cell belonging to the same region
        // □ is a cell of another region or the side of the matrix

        // Case 0 neighbor :
        //      □ □
        //      ■ □ => cell IS a corner

        // Case 1 neighbor :
        //      ■ □
        //      ■ □ => cell is NOT a corner

        //      □ ■
        //      ■ □ => cell IS a corner
        
        //      □ □
        //      ■ ■ => cell is NOT a corner
        
        // Case 2 neighbors :
        //      ■ ■
        //      ■ □ => cell IS a corner

        //      □ ■
        //      ■ ■ => cell IS a corner

        //      ■ □
        //      ■ ■ => cell IS a corner

        // Case 3 neighbors :
        //      ■ ■
        //      ■ ■ => cell is NOT a corner

        // So, for a given cell and a given corner (between N-E, S-E, S-W and N-W) and considering the 3 neighbors surrounding this corner, we can conclude that :
        // 0 neighbor of the same region means we have a corner, 1 neighbor we have a corner only if the neighbor is on the opposite of the corner, 2 neighbors we always have a corner, and 3 neighbors we don't have a corner.
        // What is the influence of being on a side ?

        // Case side 0 neighbor :
        //      ___
        //      ■ □ => cell IS a corner

        // Case side 1 neighbor :
        //      ___
        //      ■ ■ => cell is NOT a corner

        // And obviously, if the current cell is on a corner of the matrix :
        //      ___
        //        ■| => cell IS a corner

        // Once again, 0 neighbor of the same region means we have a corner, 1 neighbor we have a corner only if the neighbor is on the opposite of the corner, 2 neighbors we always have a corner, and 3 neighbors we don't have a corner.


        // Now consider this situation : 

        //      ■ □
        //      ■ ■ 
        // The bottom right cell has a corner in N-E, the bottom left cell has the same corner in N-W, and the top left cell has the same corner in S-E. We will take that into consideration.
        // To do so, we will create a matrix N+1 x N+1 (one extra row and one extra column) of corners. Considering the cell [0, 0], its corners will be in the corner matrix :

        // [0, 0]   [0, 1]
        //        ■
        // [1, 0]   [1, 1]

        // In other words, for a given cell [row, col] :
        //      the N-E corner will be in the position [row, col+1] in the corner matrix
        //      the S-E corner will be in the position [row+1, col+1] in the corner matrix
        //      the S-W corner will be in the position [row+1, col] in the corner matrix
        //      the N-W corner will be in the position [row, col] in the corner matrix

        // In this example, only col indices of the corner matrix are displayed :
        //    0 1 2 3
        //       ■
        //     ■ ■ ■
        //       ■

        // PART II: do we have a side?
        // A side is two corners connected but it not as simple as counting corners. Consider these examples :
        //      ■ ■|□ □                ■ ■|□ □
        //      ■ ■|□ □                ■ ■|□ □
        //      □ □|■ ■        and     □ □|□ □
        //      □ □|■ ■                ■ ■|□ □
        // Following the line, the first example has 3 corners : at the beginning row 0, between row 1 and row 2 and at the end row 3
        //                     the second example has 4 corners : at the beginning row 0, between row 1 and row 2, between row 2 and 3 and at the end row 3
        // But in both examples, we have 2 sides, from row 0 to row 1 and from row 2 to 3 in example 1. In example 2, from 0 to 1 and from 3 to 3.
        // In fact, the middle corner in example 1 acts both as the end of the first side and the beginning of the another one.
        // Considering these cases :
        //      ■ ■|□ □                ■ ■|□ □              ■ ■|□ □
        //      ■ ■|□ □                ■ ■|□ □              ■ ■|□ □
        //      □ □|■ ■        and     □ □|□ □      and     ■ ■|■ □
        //      □ □|■ ■                ■ ■|□ □              ■ ■|■ □
        // We need to monitor cells on both sides of a side. We can conclude that a closing corner can act also as an opening corner if one and only one cell following the corner is belonging to the region.

        // PART III : coding
        // For a region matrix NxN, we will have a corner matrix N+1xN+1.
        // We will store a cornerMatrix for each region, as we traverse this.region, we will update their respective corner matrix.
        // At the end we will run through every corner horizontally then vertically. Check for each corner if it opening a side or closing a side (or both) and conclude how many sides we have.

        // Region as keys
        let areas = {}
        let cornersMatrices = {}

        //PART I : PLACE CORNERS AND AREAS
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                const currRegion = this.region[row][col]
                // update areas
                areas[currRegion] = (areas[currRegion] || 0) + 1

                //update corners
                //create the corner amtrix for this region if needed, its dimensions are N+1 x N+1
                if(!(currRegion in cornersMatrices)){
                    let cornerMatrix = this.getUndefinedMatrix().map(row => row.concat(undefined))
                    cornerMatrix.push(Array(this.maxCol + 1).fill(undefined))
                    cornersMatrices[currRegion] = cornerMatrix
                }

                //place corners
                const DIAGS = [[-1, 1], [1, 1], [1, -1], [-1, -1]] // N-E, S-E, S-W, N-W
                const CORNERS_OFFSETS = [[0, 1], [1, 1], [1, 0], [0, 0]] // N-E, S-E, S-W, N-W // It means the corner S-W of the cell [row, col] in the matrix will correspond to [row+1, col] in the corner matrix
                for(let i=0 ; i<4 ; i++){
                    let diag = DIAGS[i]
                    let offsets = [[diag[0], 0] , diag, [0, diag[1]]] // same row, opposite, same col
                    let neighbors = offsets.map(ofs => [row+ofs[0] , col+ofs[1]])

                    let neighborsCount = 0
                    let isOppositeNeighbor = false
                    neighbors.forEach((n, idx) => {
                        let [rown, coln] = n
                        if(rown>=0 && rown<this.maxRow && coln>=0 && coln<this.maxCol){
                            //check if neighbor is of the same region
                            if(this.region[rown][coln] === currRegion){
                                if(idx === 1) isOppositeNeighbor = true
                                neighborsCount++
                            }
                        }
                    })
                    // Every cases where there is a corner
                    if(neighborsCount === 0 || neighborsCount === 2 || (neighborsCount === 1 && isOppositeNeighbor)){
                        let cornerOffset = CORNERS_OFFSETS[i]
                        let [rowc, colc] = [row+cornerOffset[0] , col+cornerOffset[1]]
                        cornersMatrices[currRegion][rowc][colc] = true
                    }
                }
            }
        }

        // console.table(this.region)
        // console.log(areas);
        
        // console.table(cornersMatrices["1"])
        
        //PART II : FROM CORNER TO CORNER, COUNT SIDES & RESULT
        let res = 0

        for(let region in areas){
            let sides = 0

            //horizontal sides
            for(let row=0 ; row<cornersMatrices[region].length ; row++){
                let rowSides = 0
                let isStartSide = false
                for(let col=0 ; col<cornersMatrices[region][0].length ; col++){
                    //Starting side corner
                    if(cornersMatrices[region][row][col] && !isStartSide){
                        isStartSide = true
                    }
                    //Ending side corner but can also be the start of a new side
                    else if(cornersMatrices[region][row][col]){
                        isStartSide = false
                        rowSides++
                        let topRightCell = [row-1, col] // this will be positions in the matrix
                        let bottomRightCell = [row, col] // this will be positions in the matrix
                        if(topRightCell[0]>=0 && bottomRightCell[0]>=0 && topRightCell[0]<this.maxRow && bottomRightCell[0]<this.maxRow && topRightCell[1]>=0 && bottomRightCell[1]>=0 && topRightCell[1]<this.maxCol && bottomRightCell[1]<this.maxCol){
                            //if one and only one side belongs to the region, the corner acts also as a starting corner (see AB2 example)
                            if((this.region[topRightCell[0]][topRightCell[1]]==region && this.region[bottomRightCell[0]][bottomRightCell[1]]!=region) || (this.region[topRightCell[0]][topRightCell[1]]!=region && this.region[bottomRightCell[0]][bottomRightCell[1]]==region)){
                                isStartSide = true
                            }
                        }
                    }
                }                
                sides += rowSides
            }

            //vertical sides
            for(let col=0 ; col<cornersMatrices[region][0].length ; col++){
                let colSides = 0
                let isStartSide = false
                for(let row=0 ; row<cornersMatrices[region].length ; row++){
                    //Starting side corner
                    if(cornersMatrices[region][row][col] && !isStartSide){
                        isStartSide = true
                    }
                    //Ending side corner but can also be the start of a new side
                    else if(cornersMatrices[region][row][col]){
                        isStartSide = false
                        colSides++
                        let bottomLeftCell = [row, col-1] // this will be positions in the matrix
                        let bottomRightCell = [row, col] // this will be positions in the matrix
                        if(bottomLeftCell[0]>=0 && bottomRightCell[0]>=0 && bottomLeftCell[0]<this.maxRow && bottomRightCell[0]<this.maxRow && bottomLeftCell[1]>=0 && bottomRightCell[1]>=0 && bottomLeftCell[1]<this.maxCol && bottomRightCell[1]<this.maxCol){
                            //if one and only one side belongs to the region, the corner acts also as a starting corner (see AB2 example)
                            if((this.region[bottomLeftCell[0]][bottomLeftCell[1]]==region && this.region[bottomRightCell[0]][bottomRightCell[1]]!=region) || (this.region[bottomLeftCell[0]][bottomLeftCell[1]]!=region && this.region[bottomRightCell[0]][bottomRightCell[1]]==region)){
                                isStartSide = true
                            }
                        }
                    }
                }
                sides += colSides
            }
            // console.log("for region :", region, "I found ", sides, "sides");
            let a = areas[region]
            res += a * sides
        }

        console.log(res)

        return res
    }

    solveTwoBis(){
        // PART I : conception
        // A cell can only have two statuses : belonging to the region or not. Let ■ be a cell belonging to the current region we are parsing. Let □ be a cell of a different region.
        // Let's parse the matrix two rows (and two cols at a time), we have a side if one and only one cell of a pair is belonging to thr region. See these examples with two rows at a time :
        // ■ ■ ■ ■          □ □ □ □             □ □ □ □             ■ ■ ■ ■             ■ ■ □ □
        // □ □ □ □ (1)      ■ ■ ■ ■ (2)         □ □ □ □ (3)         ■ ■ ■ ■ (4)         □ □ ■ ■ (5)
        // We have 1 side in example 1 and 2, 0 side in example 3 and 4 and 2 sides on example 5.

        // Now that we are able to differentiate what is a side from what is not. Let's find how a side starts :
        // ■ ■ ■ ■          □ □ □ □             ■ ■ □ □
        // ■ ■ □ □ (1)      □ □ ■ ■ (2)         □ □ ■ ■ (3)

        // And because it is very similar, how a side ends :
        // ■ ■ ■ ■          □ □ □ □             ■ ■ □ □
        // □ □ ■ ■ (1)      ■ ■ □ □ (2)         □ □ ■ ■ (3)

        // We can conclude that considering two pairs, compared to the previous pair, if at least one element of the current pair changes, we have an event, either the start or the end (por both) of a side.

        // PART II : execution
        // We first need to be able to register an event between two pairs.
        // ■ ■ □ □
        // ■ ■ ■ □
        //   p i
        // Let i the current index and p the previous index, if (top[p]===top[i] && bottom[p]===bottom[i]) we have no event.
        // In a case of an event, if we were on a side, it is the end of it. If top[i] !== bottom[i], we have the start of a side.
        // For borders, it is slightly different we just have to check if the current cell belongs to the region.

        let areas = {}
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                const currRegion = this.region[row][col]
                // update areas
                areas[currRegion] = (areas[currRegion] || 0) + 1
            }
        }

        let res = 0
        for(let region in areas){
            let regionSides = 0
            // HORIZONTAL SIDES
            // edge case for matrix borders
            let isPrevTopRegion = this.region[0][0] == region
            let isPrevBottomRegion = this.region[this.maxRow-1][0] == region
            let isTopBorderSide = isPrevTopRegion //if the 0th element of the top row is in region it was the start of a side
            let isBottomBorderSide = isPrevBottomRegion //if the 0th element of the bottom row is in region it was the start of a side
            for(let col=1 ; col<this.maxCol ; col++){
                let isCurTopRegion = this.region[0][col] == region
                let isCurBottomRegion = this.region[this.maxRow-1][col] == region
                if(isPrevTopRegion !== isCurTopRegion){
                    if(isTopBorderSide){
                        regionSides++
                        isTopBorderSide = false
                    }else{
                        isTopBorderSide = true
                    }
                }
                if(isPrevBottomRegion !== isCurBottomRegion){
                    if(isBottomBorderSide){
                        regionSides++
                        isBottomBorderSide = false
                    }else{
                        isBottomBorderSide = true
                    }
                }
                //update
                isPrevTopRegion = isCurTopRegion
                isPrevBottomRegion = isCurBottomRegion
            }
            //close our sides
            if(isTopBorderSide) regionSides++
            if(isBottomBorderSide) regionSides++

            //general case for matrix inside
            for(let row=1 ; row<this.maxRow ; row++){
                let isPrevAboveRegion = this.region[row-1][0] == region
                let isPrevBelowRegion = this.region[row][0] == region
                // We have the start of a side, if one and only one of the framing cell is of the region
                let isSide = isPrevAboveRegion ^ isPrevBelowRegion
                let rowSides = 0
                for(let col=1 ; col<this.maxCol ; col++){
                    let isCurAboveRegion = this.region[row-1][col] == region
                    let isCurBelowRegion = this.region[row][col] == region
                    // if(xnor(isPrevAboveRegion, isCurAboveRegion) && xnor(isPrevBelowRegion, isCurBelowRegion)) continue //no change
                    if((isPrevAboveRegion === isCurAboveRegion) && (isPrevBelowRegion === isCurBelowRegion)) continue //no change
                    else{
                        // we have a change in the status, if we were in a side, end of side
                        if(isSide){
                            isSide = false
                            rowSides++
                        }
                        // we can now have :
                        // above and below are region => it is not a start of a side
                        // none are region => it is not a start of a side
                        // one and only one is region => start of side
                        if(isCurAboveRegion ^ isCurBelowRegion){ // if above and below are different
                            isSide = true
                        }
                    }

                    isPrevAboveRegion = isCurAboveRegion
                    isPrevBelowRegion = isCurBelowRegion
                }
                //close our side
                if(isSide) rowSides++
                regionSides += rowSides
                // console.log("for region", region, "for between rows", row-1, "and", row, "I found", rowSides, "horizontal sides")
            }

            // VERTICAL SIDES
            // edge case for matrix borders
            let isPrevLeftRegion = this.region[0][0] == region
            let isPrevRightRegion = this.region[0][this.maxCol-1] == region
            let isLeftBorderSide = isPrevLeftRegion //if the 0th element of the left col is in region it was the start of a side
            let isRightBorderSide = isPrevRightRegion //if the 0th element of the right col is in region it was the start of a side
            for(let row=1 ; row<this.maxRow ; row++){
                let isCurLeftRegion = this.region[row][0] == region
                let isCurRightRegion = this.region[row][this.maxCol-1] == region
                if(isPrevLeftRegion !== isCurLeftRegion){
                    if(isLeftBorderSide){
                        regionSides++
                        isLeftBorderSide = false
                    }else{
                        isLeftBorderSide = true
                    }
                }
                if(isPrevRightRegion !== isCurRightRegion){
                    if(isRightBorderSide){
                        regionSides++
                        isRightBorderSide = false
                    }else{
                        isRightBorderSide = true
                    }
                }
                //update
                isPrevLeftRegion = isCurLeftRegion
                isPrevRightRegion = isCurRightRegion
            }
            //close our sides
            if(isLeftBorderSide) regionSides++
            if(isRightBorderSide) regionSides++

            //general case for matrix inside
            for(let col=1 ; col<this.maxCol ; col++){
                let isPrevLeftRegion = this.region[0][col-1] == region
                let isPrevRightRegion = this.region[0][col] == region
                // We have the start of a side, if one and only one of the framing cell is of the region
                let isSide = isPrevLeftRegion ^ isPrevRightRegion
                let colSides = 0
                for(let row=1 ; row<this.maxRow ; row++){
                    let isCurLeftRegion = this.region[row][col-1] == region
                    let isCurRightRegion = this.region[row][col] == region
                    // if(xnor(isPrevLeftRegion, isCurLeftRegion) && xnor(isPrevRightRegion, isCurRightRegion)) continue //no change
                    if((isPrevLeftRegion === isCurLeftRegion) && (isPrevRightRegion === isCurRightRegion)) continue //no change
                    else{
                        // we have a change in the status, if we were in a side, end of side
                        if(isSide){
                            isSide = false
                            colSides++
                        }
                        // we can now have :
                        // left and right are region => it is not a start of a side
                        // none are region => it is not a start of a side
                        // one and only one is region => start of side
                        if(isCurLeftRegion ^ isCurRightRegion){ // if left and right are different
                            isSide = true
                        }
                    }

                    isPrevLeftRegion = isCurLeftRegion
                    isPrevRightRegion = isCurRightRegion
                }
                //close our side
                if(isSide) colSides++
                regionSides += colSides
                // console.log("for region", region, "for between col", col-1, "and", col, "I found", colSides, "vertical sides")
            }

            // console.log("for region :", region, "I found ", regionSides, "sides");
            // console.table(this.region)
            let a = areas[region]
            res += a * regionSides
        }

        console.log(res);
        
        return res


        function xnor(operand1, operand2){
            // return 1 if both operands are the same
            // true xnor true = 1
            // false xnor false = 1
            // 0 otherwise
            return ~(operand1 ^ operand2) & 1
        }
    }

    solveTwoTer(){
        // Same than bis with better syntax.
        let areas = {}
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                const currRegion = this.region[row][col]
                // update areas
                areas[currRegion] = (areas[currRegion] || 0) + 1
            }
        }

        let res = 0
        for(let region in areas){
            let regionSides = 0

            // HORIZONTAL SIDES
            // edge case borders
            let isTopSide = this.region[0][0] == region
            let isBottomSide = this.region[this.maxRow-1][0] == region
            for(let col=1 ; col<this.maxCol ; col++){
                let prevTop = this.region[0][col-1] == region
                let prevBottom = this.region[this.maxRow-1][col-1] == region
                let curTop = this.region[0][col] == region
                let curBottom = this.region[this.maxRow-1][col] == region
                if(prevTop !== curTop){
                    if(isTopSide) regionSides++
                    isTopSide = !isTopSide
                }
                if(prevBottom !== curBottom){
                    if(isBottomSide) regionSides++
                    isBottomSide = !isBottomSide
                }
            }
            //close our side
            if(isTopSide) regionSides++
            if(isBottomSide) regionSides++

            //general case inside matrix
            for(let row=1 ; row<this.maxRow; row++){
                let isSide = (this.region[row-1][0] == region ^ this.region[row][0] == region) //check if the two elements of the 0th pair are different, if so we have the start of a side
                for(let col=1 ; col<this.maxCol ; col++){
                    let [prevTop, prevBottom] = [this.region[row-1][col-1] == region, this.region[row][col-1] == region]
                    let [curTop, curBottom] = [this.region[row-1][col] == region, this.region[row][col] == region]
                    if(prevTop === curTop && prevBottom === curBottom) continue // no change detected
                    else{
                        if(isSide) regionSides++
                        isSide = curTop ^ curBottom //check if the two elements of the cur pair are different, if so we have the start of a side
                    }
                }
                //close our side
                if(isSide) regionSides++
            }

            // VERTICAL SIDES
            // edge case borders
            let isLeftSide = this.region[0][0] == region
            let isRightSide = this.region[0][this.maxCol-1] == region
            for(let row=1 ; row<this.maxRow ; row++){
                let prevLeft = this.region[row-1][0] == region
                let prevRight = this.region[row-1][this.maxCol-1] == region
                let curLeft = this.region[row][0] == region
                let curRight = this.region[row][this.maxCol-1] == region
                if(prevLeft !== curLeft){
                    if(isLeftSide) regionSides++
                    isLeftSide = !isLeftSide
                }
                if(prevRight !== curRight){
                    if(isRightSide) regionSides++
                    isRightSide = !isRightSide
                }
            }
            //close our side
            if(isLeftSide) regionSides++
            if(isRightSide) regionSides++

            //general case inside matrix
            for(let col=1 ; col<this.maxCol; col++){
                let isSide = (this.region[0][col-1] == region ^ this.region[0][col] == region) //check if the two elements of the 0th pair are different, if so we have the start of a side
                for(let row=1 ; row<this.maxRow ; row++){
                    let [prevLeft, prevRight] = [this.region[row-1][col-1] == region, this.region[row-1][col] == region]
                    let [curLeft, curRight] = [this.region[row][col-1] == region, this.region[row][col] == region]
                    if(prevLeft === curLeft && prevRight === curRight) continue // no change detected
                    else{
                        if(isSide) regionSides++
                        isSide = curLeft ^ curRight //check if the two elements of the cur pair are different, if so we have the start of a side
                    }
                }
                //close our side
                if(isSide) regionSides++
            }

            // console.log("for region :", region, "I found ", regionSides, "sides");
            // console.table(this.region)
            let a = areas[region]
            res += a * regionSides
        }

        console.log(res)

        return res
    }

    solveTwoQuater(){
        // Although, this code looks a lot like solveTwo(), corners are not the same.
        // A cell can only have two statuses : belonging to the region or not. Let ■ be a cell belonging to the current region we are parsing. Let □ be a cell of a different region.
        // Let be o a corner. There are two types of corners, a concave corner like (1) and a convex corner like (2).
        // ■ ■ □ □              ■ □ □ □
        // ■ ■ o □              ■ □ o □
        // ■ ■ ■ □ (1)          ■ ■ □ □
        // Imagine walking on the perimeter, there are as many turns as there are sides. The consequence is there as many corners as there are sides. Count how many corners are in a given region.
        // In conclusion for a cell, look on its sides. If both sides are different region, we have a convex corner. But if both sides are of the region, then look at the diagonal, if the diagonal is a different region, we have a concave corner.
        // Some corners can overlap, we need to count them multiple times. Example :
        // o □ □ □ o
        // □ ■ ■ ■ □
        // □ ■ o ■ □
        // o o ■ ■ □
        // □ o □ □ o
        // There are 3 outer horizontal sides and 3 outer vertical sides ; but the 2 inner horizontal sides and 2 inner vertical sides create 4 corners with all 4 overlapping !
        // For a total of 10 sides and 10 corners.
        // While I am at it and to fancy a change, let's find region with a bfs instead of a dfs.
    
        let price = 0
        let visited = this.getUndefinedMatrix()
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                if(visited[row][col]) continue
                const region = this.getRegionBFS([row, col])
                let regionSet = new Set()
                region.forEach(coord => regionSet.add(`${coord}`))
                
                let area = region.length
                let corners = 0
                for(let [crow, ccol] of region){
                    visited[crow][ccol] = true
                    const DIAGS = [[-1, 1], [1, 1], [1, -1], [-1, -1]] // N-E, S-E, S-W, N-W
                    // loop on the four corners
                    for(let diag of DIAGS){
                        const offsets = [[diag[0], 0] , diag, [0, diag[1]]] // same row, diagonal/opposite, same col
                        let neighbors = offsets.map(ofs => [crow+ofs[0] , ccol+ofs[1]])

                        //convex corner check : both sides are different region
                        if(!(regionSet.has(`${neighbors[0]}`)) && !(regionSet.has(`${neighbors[2]}`))){
                            corners++
                        }

                        //concave corner check : both sides are region, but diagonal/opposite is not
                        if(regionSet.has(`${neighbors[0]}`) && regionSet.has(`${neighbors[2]}`) && (!regionSet.has(`${neighbors[1]}`))){
                            corners++
                        }
                    }
                }
                price += area * corners
            }
        }

        console.log(price)

        return price
    }

    solveTwoQuinqies(){
        // We can see a side as a straight, uninterrupted line between two extremities. For every elements on this side, and given a direction parallel to the side, we would get to the same extremity.
        // We can define a side as an extremity and a direction.

        let price = 0
        let visited = this.getUndefinedMatrix()
        for(let row=0 ; row<this.maxRow ; row++){
            for(let col=0 ; col<this.maxCol ; col++){
                if(visited[row][col]) continue
                const region = this.getRegionBFS([row, col])
                let regionSet = new Set()
                region.forEach(([r,c]) => {
                    regionSet.add(`${[r,c]}`)
                    visited[r][c] = true
                })
                
                let area = region.length
                let sideSet = new Set() // every unique pair of extremity and direction corresponding to each side
                const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]] // North, East, South, West
                for(let [crow, ccol] of region){
                    //search for a cell on a side, and get the direction of said side, or literally the direction of the alien
                    for(let [offsr, offsc] of directions){
                        if(regionSet.has(`${[crow+offsr, ccol+offsc]}`)) continue

                        //we now have a cell on a side, the direction is towards the alien cell, we want to move perpendicular to that direction so the movement is parallel to/on the side. To do so, we are gonna move the row with the offset col and the col with the offset row

                        let [rr, cc] = [crow, ccol]

                        //Trace the side : move toward the extremity
                        //while moving on the side, i.e the parallel element is in the region AND the facing element is not in the region (an alien)
                        while(regionSet.has(`${[rr+offsc, cc+offsr]}`) && !(regionSet.has(`${[rr+offsr, cc+offsc]}`))){
                            rr += offsc
                            cc += offsr
                        }

                        //Once the extremity is reached, add it to the set. Every cell from this side will reach the same point. Insert the extremity and the direction into our set
                        sideSet.add(`${[rr, cc, offsr, offsc]}`)
                    }
                }
                const sides = sideSet.size
                price += area * sides
            }
        }
        console.log(price)

        return price
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

    // Array<row: Number, col: Number> : Array<Array<row: Number, col: Number>>
    // From a position [row, col], return an array containing the position of each cells of the region the input is part of (input included)
    // Same result than above, different methodology.
    getRegionBFS(position){
        const [row, col] = position
        const type = this.matrix[row][col]

        const visited = this.getUndefinedMatrix()
        visited[row][col] = true
        const region = []
        const toVisit = [position] //queue FIFO

        //bfs
        while(toVisit.length > 0){
            const curr = toVisit.shift()
            region.push(curr)
            const neighbors = this.vonNeumannNeighbors(curr)
            for(let [nrow, ncol] of neighbors){
                // const [nrow, ncol] = neighbor
                if(this.matrix[nrow][ncol]===type && !visited[nrow][ncol]){
                    toVisit.push([nrow, ncol])
                    visited[nrow][ncol] = true
                }
            }
        }

        return region
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
        const exampleE = fs.readFileSync(__dirname + "/exampleE.txt").toString()
        const exampleAB = fs.readFileSync(__dirname + "/exampleAB.txt").toString()
        const exampleAB2 = fs.readFileSync(__dirname + "/exampleAB2.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        const gridExample = new Grid(example)
        const gridMiniExample2 = new Grid(miniExample2)
        const gridExampleE = new Grid(exampleE)
        const gridExampleAB = new Grid(exampleAB)
        const gridExampleAB2 = new Grid(exampleAB2)
        const gridInput = new Grid(input)
        // assert.deepStrictEqual(gridExample.solveOne(), 1930)
        // assert.deepStrictEqual(gridMiniExample2.solveOne(), 772)
        // assert.deepStrictEqual(gridInput.solveOne(), 1437300) // 1437300

        // assert.deepStrictEqual(gridExample.solveTwo(), 1206) // 1206
        // assert.deepStrictEqual(gridExampleE.solveTwo(), 236) // 236
        // assert.deepStrictEqual(gridExampleAB.solveTwo(), 368) // 368
        // assert.deepStrictEqual(gridExampleAB2.solveTwo(), 624) // 624 // 16 sides of area 36 for A, 4 sides of area 4 (3 times) for B
        // assert.deepStrictEqual(gridInput.solveTwo(), 849332) // 849332

        // assert.deepStrictEqual(gridExample.solveTwoBis(), 1206) // 1206
        // assert.deepStrictEqual(gridExampleE.solveTwoBis(), 236) // 236
        // assert.deepStrictEqual(gridExampleAB.solveTwoBis(), 368) // 368
        // assert.deepStrictEqual(gridExampleAB2.solveTwoBis(), 624) // 624 // 16 sides of area 36 for A, 4 sides of area 4 (3 times) for B
        // assert.deepStrictEqual(gridInput.solveTwoBis(), 849332) // 849332

        // assert.deepStrictEqual(gridExample.solveTwoTer(), 1206) // 1206
        // assert.deepStrictEqual(gridExampleE.solveTwoTer(), 236) // 236
        // assert.deepStrictEqual(gridExampleAB.solveTwoTer(), 368) // 368
        // assert.deepStrictEqual(gridExampleAB2.solveTwoTer(), 624) // 624 // 16 sides of area 36 for A, 4 sides of area 4 (3 times) for B
        // assert.deepStrictEqual(gridInput.solveTwoTer(), 849332) // 849332


        // assert.deepStrictEqual(gridExample.solveTwoQuater(), 1206) // 1206
        // assert.deepStrictEqual(gridExampleE.solveTwoQuater(), 236) // 236
        // assert.deepStrictEqual(gridExampleAB.solveTwoQuater(), 368) // 368
        // assert.deepStrictEqual(gridExampleAB2.solveTwoQuater(), 624) // 624 // 16 sides of area 36 for A, 4 sides of area 4 (3 times) for B
        // assert.deepStrictEqual(gridInput.solveTwoQuater(), 849332) // 849332

        // assert.deepStrictEqual(gridExample.solveTwoQuinqies(), 1206) // 1206
        // assert.deepStrictEqual(gridExampleE.solveTwoQuinqies(), 236) // 236
        // assert.deepStrictEqual(gridExampleAB.solveTwoQuinqies(), 368) // 368
        // assert.deepStrictEqual(gridExampleAB2.solveTwoQuinqies(), 624) // 624 // 16 sides of area 36 for A, 4 sides of area 4 (3 times) for B
        assert.deepStrictEqual(gridInput.solveTwoQuinqies(), 849332) // 849332
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()
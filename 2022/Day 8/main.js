// https://adventofcode.com/2022/day/8
// --- Day 8: Treetop Tree House ---
// The expedition comes across a peculiar patch of tall trees all planted carefully in a grid. The Elves explain that a previous expedition planted these trees as a reforestation effort. Now, they're curious if this would be a good location for a tree house.

// First, determine whether there is enough tree cover here to keep a tree house hidden. To do this, you need to count the number of trees that are visible from outside the grid when looking directly along a row or column.

// The Elves have already launched a quadcopter to generate a map with the height of each tree (your puzzle input). For example:

// 30373
// 25512
// 65332
// 33549
// 35390
// Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.

// A tree is visible if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.

// All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees to block the view. In this example, that only leaves the interior nine trees to consider:

// The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)
// The top-middle 5 is visible from the top and right.
// The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.
// The left-middle 5 is visible, but only from the right.
// The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.
// The right-middle 3 is visible from the right.
// In the bottom row, the middle 5 is visible, but the 3 and 4 are not.
// With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.

// Consider your map; how many trees are visible from outside the grid?

const fs = require('fs');
const assert = require('assert');

function solveOne(string){
    let grid = string.split('\n').map(row => row.split('').map(h => Number(h)))
    const MAX_ROW = grid.length - 1
    const MAX_COL = grid[0].length - 1

    // console.log(grid);
    let nVisibleTrees = 0

    //keep the edges
    for(let row=0 ; row<=MAX_ROW ; row++){
        for(let col=0 ; col<=MAX_COL ; col++){
            let treeHeight = grid[row][col]
            if(isVisible(row, col, treeHeight)) nVisibleTrees++
        }
    }

    console.log(nVisibleTrees);
    return nVisibleTrees

    //helpers
    function isVisible(row, col, height){
        //if it is visible from one direction, it is visible
        return (isVisibleFromNorth(row, col, height) || isVisibleFromEast(row, col, height) || isVisibleFromSouth(row, col, height) || isVisibleFromWest(row, col, height))
    }

    function isVisibleFromNorth(row, col, height){
        if(row===0 || row===MAX_ROW || col===0 || col===MAX_COL) return true // a tree on the edge is always visible
        if(height === 0) return false //a height of 0 is always invisible if it is not on an edge

        for(let r=row-1 ; r>=0 ; r--){
            //if one tree going north is higher than the input tree, the input tree is not visible
            //a tree of equal height still hides it
            if(grid[r][col] >= height) return false
        }

        return true
    }

    function isVisibleFromEast(row, col, height){
        if(row===0 || row===MAX_ROW || col===0 || col===MAX_COL) return true // a tree on the edge is always visible
        if(height === 0) return false //a height of 0 is always invisible if it is not on an edge

        for(let c=col+1 ; c<=MAX_COL ; c++){
            //if one tree going east is higher than the input tree, the input tree is not visible
            //a tree of equal height still hides it
            if(grid[row][c] >= height) return false
        }

        return true
    }

    function isVisibleFromSouth(row, col, height){
        if(row===0 || row===MAX_ROW || col===0 || col===MAX_COL) return true // a tree on the edge is always visible
        if(height === 0) return false //a height of 0 is always invisible if it is not on an edge

        for(let r=row+1 ; r<=MAX_ROW ; r++){
            //if one tree going south is higher than the input tree, the input tree is not visible
            //a tree of equal height still hides it
            if(grid[r][col] >= height) return false
        }

        return true
    }

    function isVisibleFromWest(row, col, height){
        if(row===0 || row===MAX_ROW || col===0 || col===MAX_COL) return true // a tree on the edge is always visible
        if(height === 0) return false //a height of 0 is always invisible if it is not on an edge

        for(let c=col-1 ; c>=0 ; c--){
            //if one tree going west is higher than the input tree, the input tree is not visible
            //a tree of equal height still hides it
            if(grid[row][c] >= height) return false
        }

        return true
    }
}

// (() => {
// const data = fs.readFileSync(__dirname + '/input.txt').toString();
// console.log(solveOne(data));

// assert.deepStrictEqual(solveOne(`30373
// 25512
// 65332
// 33549
// 35390`), 21);

// })();
// CORRECT ANSWER : 1717

// --- Part Two ---
// Content with the amount of tree cover available, the Elves just need to know the best spot to build their tree house: they would like to be able to see a lot of trees.

// To measure the viewing distance from a given tree, look up, down, left, and right from that tree; stop if you reach an edge or at the first tree that is the same height or taller than the tree under consideration. (If a tree is right on the edge, at least one of its viewing distances will be zero.)

// The Elves don't care about distant trees taller than those found by the rules above; the proposed tree house has large eaves to keep it dry, so they wouldn't be able to see higher than the tree house anyway.

// In the example above, consider the middle 5 in the second row:

// 30373
// 25512
// 65332
// 33549
// 35390
// Looking up, its view is not blocked; it can see 1 tree (of height 3).
// Looking left, its view is blocked immediately; it can see only 1 tree (of height 5, right next to it).
// Looking right, its view is not blocked; it can see 2 trees.
// Looking down, its view is blocked eventually; it can see 2 trees (one of height 3, then the tree of height 5 that blocks its view).
// A tree's scenic score is found by multiplying together its viewing distance in each of the four directions. For this tree, this is 4 (found by multiplying 1 * 1 * 2 * 2).

// However, you can do even better: consider the tree of height 5 in the middle of the fourth row:

// 30373
// 25512
// 65332
// 33549
// 35390
// Looking up, its view is blocked at 2 trees (by another tree with a height of 5).
// Looking left, its view is not blocked; it can see 2 trees.
// Looking down, its view is also not blocked; it can see 1 tree.
// Looking right, its view is blocked at 2 trees (by a massive tree of height 9).
// This tree's scenic score is 8 (2 * 2 * 1 * 2); this is the ideal spot for the tree house.

// Consider each tree on your map. What is the highest scenic score possible for any tree?

function solveTwo(string){
    let grid = string.split('\n').map(row => row.split('').map(h => Number(h)))
    const MAX_ROW = grid.length - 1
    const MAX_COL = grid[0].length - 1

    let maxScenicScore = 0
    for(let row=0 ; row<=MAX_ROW ; row++){
        for(let col=0 ; col<=MAX_COL ; col++){
            let treeHeight = grid[row][col]
            maxScenicScore = Math.max(maxScenicScore , scenicScore(row, col, treeHeight))
        }
    }

    console.log(maxScenicScore);
    return maxScenicScore

    //helpers
    function scenicScore(row, col, height){
        return viewingDistanceNorth(row, col, height) * viewingDistanceEast(row, col, height) * viewingDistanceSouth(row, col, height) * viewingDistanceWest(row, col, height)
    }

    function viewingDistanceNorth(row, col, height){
        if(row === 0) return 0

        let res = 0
        for(let r=row-1 ; r>=0 ; r--){
            //if one tree going north is higher or equal than the input tree, i won't be able to see past it (even if a higher tree occurs)
            if(grid[r][col] >= height){
                //I can at least see the tree in front that is blocking the view, unless I am on the edge
                res++
                break
            }else{
                res++
            }
        }
        return res
    }

    function viewingDistanceEast(row, col, height){
        if(col === MAX_COL) return 0

        let res = 0
        for(let c=col+1 ; c<=MAX_COL ; c++){
            //if one tree going east is higher or equal than the input tree, i won't be able to see past it (even if a higher tree occurs)
            if(grid[row][c] >= height){
                //I can at least see the tree in front that is blocking the view, unless I am on the edge
                res++
                break
            }else{
                res++
            }
        }
        return res
    }

    function viewingDistanceSouth(row, col, height){
        if(row === MAX_ROW) return 0

        let res = 0
        for(let r=row+1 ; r<=MAX_ROW ; r++){
            //if one tree going south is higher or equal than the input tree, i won't be able to see past it (even if a higher tree occurs)
            if(grid[r][col] >= height){
                //I can at least see the tree in front that is blocking the view, unless I am on the edge
                res++
                break
            }else{
                res++
            }
        }
        return res
    }

    function viewingDistanceWest(row, col, height){
        if(col === 0) return 0

        let res = 0
        for(let c=col-1 ; c>=0 ; c--){
            //if one tree going west is higher or equal than the input tree, i won't be able to see past it (even if a higher tree occurs)
            if(grid[row][c] >= height){
                //I can at least see the tree in front that is blocking the view, unless I am on the edge
                res++
                break
            }else{
                res++
            }
        }
        return res
    }
}

// (() => {
// const data = fs.readFileSync(__dirname + '/input.txt').toString();
// console.log(solveTwo(data));

// assert.deepStrictEqual(solveTwo(`30373
// 25512
// 65332
// 33549
// 35390`), 8);

// })();
// CORRECT ANSWER : 321975
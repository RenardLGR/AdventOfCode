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
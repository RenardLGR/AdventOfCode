// https://adventofcode.com/2022/day/5
// --- Day 5: Supply Stacks ---
// The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

// The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

// The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

// They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

//     [D]    
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2
// In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

// Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

// [D]        
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 
// In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

//         [Z]
//         [N]
//     [C] [D]
//     [M] [P]
//  1   2   3
// Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

//         [Z]
//         [N]
// [M]     [D]
// [C]     [P]
//  1   2   3
// Finally, one crate is moved from stack 1 to stack 2:

//         [Z]
//         [N]
//         [D]
// [C] [M] [P]
//  1   2   3
// The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

// After the rearrangement procedure completes, what crate ends up on top of each stack?

// To begin, get your puzzle input.
// https://adventofcode.com/2022/day/5/input

// ANSWER : GFTNRBZPF

const fs = require('fs');
const assert = require('assert');

function solveOne(string){
    const [inputStacks, moves] = string.split('\n\n')
    let nStacks = inputStacks.split('\n').slice(-1)[0].slice(-2, -1) //take the last number of the last line giving me the number of stacks (number of stacks is assumed to be lesser or equal than 9)
    
    let stacks = []
    for(let i=0 ; i<= nStacks ; i++){ //the stack at index 0 will never be used for ease in regard of the moves indexed from 1
        stacks.push([])
    }

    //initialize stacks ; stacks is an array of crates, with the lowest index being the topest crate
    inputStacks.split('\n').forEach((line, idx, arr) => {
        if(idx !== arr.length-1){ //don't take the line with the indeces (last line)
            for(let i=1 ; i<nStacks*4 ; i=i+4){ //there is a letter every 4 char, starting from 1
                if(line[i] !== ' '){
                    stacks[Math.floor(i/4) + 1].push(line[i]) // + 1 bcs ou stacks[0] remains empty
                }
            }
        }
    })

    //make the moves
    moves.split('\n').forEach(move => {
        //let regexp = new RegExp(/[^0-9]/g) //anything but numbers
        //const [nToMove, origin, target] = move.split(regexp).filter(el => el !== '').map(e => Number(e))
        //This approach could work but why split when you can just match :

        const [nToMove, origin, target] = move.match(/[0-9]+/g).map(e => Number(e))
        for(let i=0 ; i<nToMove ; i++){
            if(stacks[origin].length > 0){
                stacks[target].unshift(stacks[origin].shift())
            }
        }
    })

    let res = ''
    stacks.forEach((stack, idx) => {
        if(idx !== 0){
            res += stack[0]
        }
    })

    return res
}

(() => {
    const data = fs.readFileSync(__dirname + '/input.txt').toString();
    //console.log(solveOne(data));

    assert.deepStrictEqual(solveOne(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`), 'CMZ');
})();


// --- Part Two ---
// As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

// Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

// The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.

// Again considering the example above, the crates begin in the same configuration:

//     [D]    
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 
// Moving a single crate from stack 2 to stack 1 behaves the same as before:

// [D]        
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 
// However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:

//         [D]
//         [N]
//     [C] [Z]
//     [M] [P]
//  1   2   3
// Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

//         [D]
//         [N]
// [C]     [Z]
// [M]     [P]
//  1   2   3
// Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

//         [D]
//         [N]
//         [Z]
// [M] [C] [P]
//  1   2   3
// In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

// Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?

// ANSWER : VRQWPDSGP


function solveTwo(string){
    const [inputStacks, moves] = string.split('\n\n')
    let nStacks = inputStacks.split('\n').slice(-1)[0].slice(-2, -1) //take the last number of the last line giving me the number of stacks (number of stacks is assumed to be lesser or equal than 9)
    
    let stacks = []
    for(let i=0 ; i<= nStacks ; i++){ //the stack at index 0 will never be used for ease in regard of the moves indexed from 1
        stacks.push([])
    }

    //initialize stacks ; stacks is an array of crates, with the lowest index being the topest crate
    inputStacks.split('\n').forEach((line, idx, arr) => {
        if(idx !== arr.length-1){ //don't take the line with the indeces (last line)
            for(let i=1 ; i<nStacks*4 ; i=i+4){ //there is a letter every 4 char, starting from 1
                if(line[i] !== ' '){
                    stacks[Math.floor(i/4) + 1].push(line[i]) // + 1 bcs ou stacks[0] remains empty
                }
            }
        }
    })

    //make the moves
    moves.split('\n').forEach(move => {
        //let regexp = new RegExp(/[^0-9]/g) //anything but numbers
        //const [nToMove, origin, target] = move.split(regexp).filter(el => el !== '').map(e => Number(e))
        //This approach could work but why split when you can just match :

        const [nToMove, origin, target] = move.match(/[0-9]+/g).map(e => Number(e))
        stacks[target].unshift(...stacks[origin].splice(0, nToMove))
    })

    let res = ''
    stacks.forEach((stack, idx) => {
        if(idx !== 0){
            res += stack[0]
        }
    })

    return res
}


(() => {
    const data = fs.readFileSync(__dirname + '/input.txt').toString();
    console.log(solveTwo(data));

    assert.deepStrictEqual(solveTwo(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`), 'MCD');
})();
// https://adventofcode.com/2022/day/4
// --- Day 4: Camp Cleanup ---
// Space needs to be cleared before the last supplies can be unloaded from the ships, and so several Elves have been assigned the job of cleaning up sections of the camp. Every section has a unique ID number, and each Elf is assigned a range of section IDs.

// However, as some of the Elves compare their section assignments with each other, they've noticed that many of the assignments overlap. To try to quickly find overlaps and reduce duplicated effort, the Elves pair up and make a big list of the section assignments for each pair (your puzzle input).

// For example, consider the following list of section assignment pairs:

// 2-4,6-8
// 2-3,4-5
// 5-7,7-9
// 2-8,3-7
// 6-6,4-6
// 2-6,4-8
// For the first few pairs, this list means:

// Within the first pair of Elves, the first Elf was assigned sections 2-4 (sections 2, 3, and 4), while the second Elf was assigned sections 6-8 (sections 6, 7, 8).
// The Elves in the second pair were each assigned two sections.
// The Elves in the third pair were each assigned three sections: one got sections 5, 6, and 7, while the other also got 7, plus 8 and 9.
// This example list uses single-digit section IDs to make it easier to draw; your actual list might contain larger numbers. Visually, these pairs of section assignments look like this:

// .234.....  2-4
// .....678.  6-8

// .23......  2-3
// ...45....  4-5

// ....567..  5-7
// ......789  7-9

// .2345678.  2-8
// ..34567..  3-7

// .....6...  6-6
// ...456...  4-6

// .23456...  2-6
// ...45678.  4-8
// Some of the pairs have noticed that one of their assignments fully contains the other. For example, 2-8 fully contains 3-7, and 6-6 is fully contained by 4-6. In pairs where one assignment fully contains the other, one Elf in the pair would be exclusively cleaning sections their partner will already be cleaning, so these seem like the most in need of reconsideration. In this example, there are 2 such pairs.

// In how many assignment pairs does one range fully contain the other?

// To begin, get your puzzle input.
// https://adventofcode.com/2022/day/4/input

// ANSWER : 599

const fs = require('fs');
const assert = require('assert');

function solveOne(string){
    let pairs = string.split('\n')
    let sections = pairs.map(p => p.split(',').map(interval => {
        let start = Number(interval.split('-')[0])
        let end = Number(interval.split('-')[1])
        let res = []
        for(let i=start ; i<=end ; i++){
            res.push(i)
        }
        return res
    }))

    let res = 0
    sections.forEach(s => {
        if(s[0].every(e => s[1].includes(e)) || s[1].every(e => s[0].includes(e))){
            res++
        }
    })

    return res
}

function solveOneBis(string){
    let res = 0
    let pairs = string.split('\n')
    pairs.forEach(p => {
        let left = p.split(',')[0]
        let right = p.split(',')[1]
        let startLeft = Number(left.split('-')[0])
        let endLeft = Number(left.split('-')[1])
        let startRight = Number(right.split('-')[0])
        let endRight = Number(right.split('-')[1])
        if(startLeft<=startRight && endLeft>=endRight){ //right included in left
            res++
        }else if(startLeft>=startRight && endLeft<=endRight){ //left included in right
            res++
        }
    })

    return res
}

(() => {
    const data = fs.readFileSync(__dirname + '/input.txt').toString();
    // console.log(solveOne(data));

    assert.deepStrictEqual(solveOne(`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`), 2);
})();


(() => {
    const data = fs.readFileSync(__dirname + '/input.txt').toString();
    //console.log(solveOneBis(data));

    assert.deepStrictEqual(solveOne(`14-98,14-14
2-20,3-3
64-67,43-63
13-91,14-90
19-47,12-19
26-74,26-84
23-41,22-41
46-67,41-66
8-42,11-42
4-23,24-26`), 6);
})();


// --- Part Two ---
// It seems like there is still quite a bit of duplicate work planned. Instead, the Elves would like to know the number of pairs that overlap at all.

// In the above example, the first two pairs (2-4,6-8 and 2-3,4-5) don't overlap, while the remaining four pairs (5-7,7-9, 2-8,3-7, 6-6,4-6, and 2-6,4-8) do overlap:

// 5-7,7-9 overlaps in a single section, 7.
// 2-8,3-7 overlaps all of the sections 3 through 7.
// 6-6,4-6 overlaps in a single section, 6.
// 2-6,4-8 overlaps in sections 4, 5, and 6.
// So, in this example, the number of overlapping assignment pairs is 4.

// In how many assignment pairs do the ranges overlap?

//ANSWER : 928

function solveTwo(string){
    let res = 0
    let pairs = string.split('\n')
    pairs.forEach(p => {
        let left = p.split(',')[0]
        let right = p.split(',')[1]
        let startLeft = Number(left.split('-')[0])
        let endLeft = Number(left.split('-')[1])
        let startRight = Number(right.split('-')[0])
        let endRight = Number(right.split('-')[1])
        if(startLeft<=startRight && endLeft>=endRight){ //right included in left
            res++
        }else if(startLeft>=startRight && endLeft<=endRight){ //left included in right
            res++
        }else if(startLeft<=startRight && endLeft>=startRight){ //left tail included in right
            res++
        }else if(startLeft>=startRight && startLeft<=endRight){ //left head included in right
            res++
        }
    })

    return res
}

(() => {
    const data = fs.readFileSync(__dirname + '/input.txt').toString();
    console.log(solveTwo(data));

    assert.deepStrictEqual(solveTwo(`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`), 4);
})();
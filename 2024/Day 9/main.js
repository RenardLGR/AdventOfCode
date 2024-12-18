const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = "2333133121414131402"
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 1928)
        // assert.deepStrictEqual(solveOne(input), 6332189866718) // 6332189866718
        // assert.deepStrictEqual(solveTwo(example), 2858)
        assert.deepStrictEqual(solveTwo(input), 6353648390778) // 6353648390778
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

// ============================ PART I ============================
// Each digit of the input should be taken individually. Their value represents their size. They alternate between representing files and free space. As the 0th element is a file, we can conclude that an even index i will represent a file of size input[i] and odd index j will represent a free space of size input[j].
// Each file of any size has an ID based on the order as they appear in the input. It starts with an ID of 0. Free space doesn't have ID.
// We can finally conclude that an even index i will represent a file of size input[i] and of ID i/2.

// Here is an easy visualization of the example :
// input |2 3 3 3 1 3 3 1 2 1 4   (represents a size)
// idx   |0 1 2 3 4 5 6 7 8 9 10
// type  |f s f s f s f s f s f   with f=file and s=space
// ID    |0   1   2   3   4   5

// Let one character represents a unit block of size 1, and let that character be the ID for a file or "." for a free space, we can represent the input as follows :
// "00...111...2...333.44.5555.6666.777.888899"
// We start by a file of size (or here length) 2 and an ID 0, so "00"
// Followed by a space of size 3, so "..."
// Followed by a file of size 3 and an ID 1, so "111"
// Followed by a space of size 3, so "..."
// Followed by a file of size 1 and an ID 2, so "2"
// Followed by a space of size 3, so "..."
// Followed by a file of size 3 and an ID 3, so "333"
// And so on...

// Step 1 : We will start by recreating this representation with the array blocks
// Step 2 : Re-arrange the blocks from the end of the disk to the leftmost free space block (until there are no gaps remaining between file blocks)
// We will have a loop with two pointers, one at the head pointing at free spaces, one at the tail pointing at blocks to be switched between.
// Keep on doing that until the two pointers meet.
function solveOne(input){
    input = input.trim()
    
    // Step 1
    // blocks is the block representation of the input, IDs are Numbers, free spaces are '.' Strings
    let blocks = []
    input.split("").forEach((size, idx) => {
        //file
        if(idx%2 === 0){
            let id = idx/2
            for(let i=0 ; i<Number(size) ; i++){
                blocks.push(id)
            }
        }
        // free space
        else{
            for(let i=0 ; i<Number(size) ; i++){
                blocks.push(".")
            }
        }
    })

    // Step 2
    let head = 0
    let tail = blocks.length-1
    while(head < tail){
        //move head to the first free space possible
        while(blocks[head] !== ".") head++
        //move tail to the first file possible
        while(blocks[tail] === ".") tail--

        //switch between the two
        if(head < tail){
            blocks[head] = blocks[tail]
            blocks[tail] = "."
        }
    }
    
    // console.log(blocks);

    //The result is the sum of blocks[i]*i for all blocks[i] not a free space
    let res = blocks.reduce((acc, curr, idx) => curr !== "." ? acc + curr*idx : acc , 0)

    console.log(res);

    return res
}

// ============================ PART II ============================
// Step 1 is the same
// Step 2 asks us to move, starting from the right, blocks with the same ID in one go to the leftest free space blocks big enough to receive it.
// Using only indices and for and while loops, we will do these transfers.
function solveTwo(input){
    input = input.trim()
    
    // Step 1
    // blocks is the block representation of the input
    let blocks = []
    input.split("").forEach((size, idx) => {
        //file
        if(idx%2 === 0){
            let id = idx/2
            for(let i=0 ; i<Number(size) ; i++){
                blocks.push(id)
            }
        }
        // free space
        else{
            for(let i=0 ; i<Number(size) ; i++){
                blocks.push(".")
            }
        }
    })

    // Step 2
    // This is pretty much separated into two steps. First, gather the files blocks, then look for free space blocks.

    let minID = Infinity //we don't want to move IDs we already moved 
    let tail = blocks.length-1 //pointer on the files we want to move
    while(minID > 0){
        //Step 2.1 Gather the files blocks
        //move tail to the first file possible
        while(blocks[tail] === ".") tail--
        //once we get to a file, get his ID, get its length (size in blocks) ; if the ID is an already seen ID, skip it
        let id = blocks[tail]
        if(id > minID){
            tail--
            continue
        }
        let startFile = tail //represents the starting index of these files blocks
        while(blocks[startFile] === id){
            startFile--
        }
        startFile++ //cancel the step that got us out of the loop
        let fileLength = tail - startFile + 1

        //Step 2.2 Gather the free space blocks
        // Now we search from the beginning of the earliest (or leftest) free space blocks big enough for the length found above.
        // If such gap exists, operate the change, otherwise move to the next ID.
        for(let i=0 ; i<startFile ; i++){
            // When free space blocks are found, get its length
            if(blocks[i] === '.'){
                let endSpace = i
                while(blocks[endSpace] === '.'){
                    endSpace++
                }
                endSpace-- //cancel the step that got us out of the loop
                let spaceLength = endSpace - i + 1

                // If the space found is big enough, operate the change and move on
                if(spaceLength >= fileLength){
                    for(let j=0 ; j<fileLength ; j++){
                        blocks[i + j] = id
                        blocks[startFile + j] = '.'
                    }
                    break
                }
            }
            // keep on searching free space blocks...
        }
        
        //no matter what happened previously, update stuff
        minID = id
        tail = startFile - 1
    }

    // console.log(blocks);

    //The result is the sum of blocks[i]*i for all blocks[i] not a free space
    let res = blocks.reduce((acc, curr, idx) => curr !== "." ? acc + curr*idx : acc , 0)

    console.log(res);

    return res
}
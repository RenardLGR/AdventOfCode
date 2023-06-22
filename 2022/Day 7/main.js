// https://adventofcode.com/2022/day/7
// --- Day 7: No Space Left On Device ---
// You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

// The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

// $ system-update --please --pretty-please-with-sugar-on-top
// Error: No space left on device
// Perhaps you can delete some files to make space for the update?

// You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k
// The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

// Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

// cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
// cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
// cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
// cd / switches the current directory to the outermost directory, /.
// ls means list. It prints out all of the files and directories immediately contained by the current directory:
// 123 abc means that the current directory contains a file named abc with size 123.
// dir xyz means that the current directory contains a directory named xyz.
// Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

// - / (dir)
//   - a (dir)
//     - e (dir)
//       - i (file, size=584)
//     - f (file, size=29116)
//     - g (file, size=2557)
//     - h.lst (file, size=62596)
//   - b.txt (file, size=14848514)
//   - c.dat (file, size=8504156)
//   - d (dir)
//     - j (file, size=4060174)
//     - d.log (file, size=8033020)
//     - d.ext (file, size=5626152)
//     - k (file, size=7214296)
// Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

// Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

// The total sizes of the directories above can be found as follows:

// The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
// The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
// Directory d has total size 24933642.
// As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
// To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

// Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?

// To begin, get your puzzle input.
// https://adventofcode.com/2022/day/7/input

// ANSWER : 1611443


//======================================================
/*Notes :
$ cd .. means there is no more directory to dive into, it should triggers a size calculation
the sum of the directory is the sum of sizes between the block $ cd blockname and $ cd ..
add the sum to our res array, remove the block, replace dir blockname with the size
repeat the process
*/

/* VISUALIZATION :
$ cd /                      $ cd /                          $ cd /
$ ls                        $ ls                            $ ls
dir a                       dir a               39669 a     39669 a
14848514 b.txt              14848514 b.txt                  14848514 b.txt
8504156 c.dat               8504156 c.dat                   504156 c.dat
dir d                       dir d                       =>  dir d              =>
$ cd a                      $ cd a              X           $ cd d
$ ls                        $ ls                X           $ ls
dir e           2525 e      2525 e              X           4060174 j
29116 f                     29116 f             X           8033020 d.log
2557 g                      2557 g              X           5626152 d.ext
62596 h.lst             =>  62596 h.lst         X           7214296 k
$ cd e          X           $ cd ..             X
$ ls            X           $ cd d
584 i           X           $ ls
$ cd ..         X           4060174 j
$ cd ..                     8033020 d.log
$ cd d                      5626152 d.ext
$ ls                        7214296 k
4060174 j
8033020 d.log
5626152 d.ext
7214296 k

As we can see, we are missing a few $ cd .. for the algo to work, we are missing exactly ( total(cd dirname) - total(cd ..) ) $ cd ..'s
Here, two are missing
We are also missing a dir / for our last iteration
__________________________________________________________
$ cd /                          $ cd /              35874852 /
$ ls                            $ ls
39669 a                     =>  39669 a         =>
14848514 b.txt                  14848514 b.txt
8504156 c.dat                   8504156 c.dat
dir d               335475 d    335475 d
$ cd d              X           $ cd ..
$ ls                X
4060174 j           X
8033020 d.log       X
5626152 d.ext       X
7214296 k           X
$ cd ..             X
$ cd ..

*/

const fs = require('fs');
const assert = require('assert');


function solveOne(string){
    string = 'dir /' + "\n" + string
    let lines = string.split("\n")

    //sanitization : adding the $ cd ..
    let totalCDDir = 0
    let totalCDDotDot = 0
    lines.forEach(l => {
        if(l.slice(0, 4) === '$ cd'){
            if(l === '$ cd ..') totalCDDotDot++
            else totalCDDir++
        }
    })

    for(let i=0 ; i<totalCDDir-totalCDDotDot ; i++){
        lines.push('$ cd ..')
    }


    //working
    let dirSizes = [] //an array of sizes of each dir
    let isDone = false

    while(!isDone){
        isDone = true
        console.log(lines);
        for(let i=0 ; i<lines.length ; i++){
            let endIdx
            let startIdx
            let dirname
            if(lines[i] === '$ cd ..'){ //search a cd ...
                isDone = false
                endIdx = i
                for(let j=endIdx-1 ; j>=0 ; j--){ //go upstream and search start of block
                    if(lines[j].slice(0, 4) === '$ cd'){ // search $ cd dirname
                        startIdx = j
                        dirname = lines[j].slice(5)
                        let sizeSum = 0
                        for(let k=startIdx+2 ; k<endIdx ; k++){ //first two lines are $ cd dirname and $ ls, last lines is $ cd ..
                            let filesize = parseInt(lines[k].split(' ')[0])
                            sizeSum += filesize
                        }
                        dirSizes.push(sizeSum)
                        lines.splice(startIdx, endIdx-startIdx +1) //remove block

                        for(let k=startIdx ; k>=0 ; k--){ //go upstream and search dirname
                            if(lines[k] === 'dir ' + dirname){ //replace dir name with the size of the dir
                                lines[k] = '' + sizeSum + ' ' + dirname
                            }
                        }
                        break
                    }
                }
                break
            }
        }
    }

    //console.log(dirSizes);
    console.log(lines);
    return dirSizes.filter(size => size<=100000).reduce((acc, cur) => acc+cur, 0)
}


// (() => {
//     const data = fs.readFileSync(__dirname + '/input.txt').toString();
//     console.log(solveOne(data));

//     assert.deepStrictEqual(solveOne(`$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`), 95437);
    
// })();

// --- Part Two ---
// Now, you're ready to choose a directory to delete.

// The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

// In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

// To achieve this, you have the following options:

// Delete directory e, which would increase unused space by 584.
// Delete directory a, which would increase unused space by 94853.
// Delete directory d, which would increase unused space by 24933642.
// Delete directory /, which would increase unused space by 48381165.
// Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.

// Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?

// ANSWER :

function solveTwo(string, neededSpace = 30000000, totalSpace = 70000000){
    let lines = string.split("\n")

    //sanitization : adding the $ cd ..
    let totalCDDir = 0
    let totalCDDotDot = 0
    lines.forEach(l => {
        if(l.slice(0, 4) === '$ cd'){
            if(l === '$ cd ..') totalCDDotDot++
            else totalCDDir++
        }
    })

    for(let i=0 ; i<totalCDDir-totalCDDotDot ; i++){
        lines.push('$ cd ..')
    }


    //working
    let dirSizes = [] //an array of sizes of each dir
    let isDone = false

    while(!isDone){
        isDone = true
        for(let i=0 ; i<lines.length ; i++){
            let endIdx
            let startIdx
            let dirname
            if(lines[i] === '$ cd ..'){ //search a cd ...
                isDone = false
                endIdx = i
                for(let j=endIdx-1 ; j>=0 ; j--){ //go upstream and search start of block
                    if(lines[j].slice(0, 4) === '$ cd'){ // search $ cd dirname
                        startIdx = j
                        dirname = lines[j].slice(5)
                        let sizeSum = 0
                        for(let k=startIdx+2 ; k<endIdx ; k++){ //two first lines are $ cd dirname and $ ls, last lines is $ cd ..
                            let filesize = parseInt(lines[k].split(' ')[0])
                            sizeSum += filesize
                        }
                        dirSizes.push(sizeSum)
                        lines.splice(startIdx, endIdx-startIdx +1) //remove block

                        for(let k=startIdx ; k>=0 ; k--){ //go upstream and search dirname
                            if(lines[k] === 'dir ' + dirname){ //replace dir name with th size of the dir
                                lines[k] = '' + sizeSum + ' ' + dirname
                            }
                        }
                        break
                    }
                }
                break
            }
        }
    }


    let sortedDirSizes = dirSizes.sort((a, b) => a-b)
    let occupiedSize = sortedDirSizes[sortedDirSizes.length - 1] //the occupied space is the biggest directory (root /)
    console.log(sortedDirSizes.reverse());
    console.log(sortedDirSizes, occupiedSize);
    return sortedDirSizes.find(size => (totalSpace - occupiedSize + size) >= neededSpace)
}


// (() => {
//     const data = fs.readFileSync(__dirname + '/input.txt').toString();
//     console.log(solveTwo(data));

//     assert.deepStrictEqual(solveTwo(`$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`), 24933642);
    
// })();

//It is somehow not working :(

//=========================================================
//Second attempt as the first one didn't work : recursive approach
function solveOneBis(string){
    //get an array of lines, remove $, we'll attach a read/unread value to keep track of read lines so we don't count files multiple times
    let lines = string.split("\n").map(line => {
        return [line.replace('$ ', ''), "unread"]
    })
    // console.log(lines);

    let dirSizes = []

    getDirSize(lines)

    // console.log("lines:", lines);
    // console.log("dirSizes:", dirSizes);

    let result = dirSizes.filter(([dirName, dirSize]) => dirSize<=100000).reduce((acc, [dirName, dirSize]) => acc+dirSize, 0)
    return result

    function getDirSize(lines){
        let size = 0
        let dirName = ''
        for(let i=0 ; i<lines.length ; i++){
            let line = lines[i][0]
            if(lines[i][1] === "read"){
                //if line is read skip
                continue
            }

            //if I have a cd + ls combo, initialize my dirName
            if(line.slice(0,2) === 'cd' && lines[i+1][0] === 'ls'){
                dirName = line.slice(3)
                lines[i][1] = "read"
            }else if(line === "ls"){
                lines[i][1] = "read"
            }else if(line.slice(0,3) === 'dir'){
                //if I find a dir, go to the cd dir line and recall recursively the function from there
                let newDirName = line.slice(4)
                lines[i][1] = "read"
                for(let j=i ; j<lines.length ; j++){
                    if(lines[j][0] === `cd ${newDirName}`){
                        let newDirSize = getDirSize(lines.slice(j)) //once a cd .. is found, this will return the size of the sub directory
                        lines[j][1] = "read"
                        // add the size of the sub directory to the size of the current directory
                        size += newDirSize
                        break
                    }
                }
            }else if(line === "cd .."){
                //if cd .. we are done with this directory, push it to the final result, return the size of the sub directory
                dirSizes.push([dirName, size])
                lines[i][1] = "read"
                return size
            }else{
                // add size of files
                size += Number(line.split(' ')[0])
                lines[i][1] = "read"
            }
        }
        // push it to the final result, return the size of the sub directory, end the recursive calls, this happens at the end of the drilling, when we don't cd .. back up
        dirSizes.push([dirName, size])
        return size
    }
}

//Example
// assert.deepStrictEqual(solveOneBis(`$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`), 95437);

//Puzzle input
// (() => {
//     const data = fs.readFileSync(__dirname + '/input.txt').toString();
//     console.log(solveOneBis(data))
// })() // 1611443
//CORRECT ANSWER

function solveTwoBis(string, neededSpace = 30000000, totalSpace = 70000000){
        //get an array of lines, remove $, we'll attach a read/unread value to keep track of read lines so we don't count files multiple times
        let lines = string.split("\n").map(line => {
            return [line.replace('$ ', ''), "unread"]
        })
        // console.log(lines);
    
        let dirSizes = []
    
        getDirSize(lines)
    
        // console.log("lines:", lines);
        // console.log("dirSizes:", dirSizes);
    
        //sort decreasingly
        dirSizes.sort( (a,b) => {
            const [dirA, sizeA] = a
            const [dirB, sizeB] = b
            return sizeB - sizeA
        } )
        // console.log("dirSizes:", dirSizes);

        const spaceUsed = dirSizes[0][1] // that would be the root '/'
        const spaceAvailable = totalSpace - spaceUsed
        const spaceToFree = neededSpace - spaceAvailable

        for(let i=dirSizes.length-1 ; i>=0 ; i--){
            if(dirSizes[i][1] >= spaceToFree) return dirSizes[i][1]
        }
    
        function getDirSize(lines){
            let size = 0
            let dirName = ''
            for(let i=0 ; i<lines.length ; i++){
                let line = lines[i][0]
                if(lines[i][1] === "read"){
                    //if line is read skip
                    continue
                }
    
                //if I have a cd + ls combo, initialize my dirName
                if(line.slice(0,2) === 'cd' && lines[i+1][0] === 'ls'){
                    dirName = line.slice(3)
                    lines[i][1] = "read"
                }else if(line === "ls"){
                    lines[i][1] = "read"
                }else if(line.slice(0,3) === 'dir'){
                    //if I find a dir, go to the cd dir line and recall recursively the function from there
                    let newDirName = line.slice(4)
                    lines[i][1] = "read"
                    for(let j=i ; j<lines.length ; j++){
                        if(lines[j][0] === `cd ${newDirName}`){
                            let newDirSize = getDirSize(lines.slice(j)) //once a cd .. is found, this will return the size of the sub directory
                            lines[j][1] = "read"
                            // add the size of the sub directory to the size of the current directory
                            size += newDirSize
                            break
                        }
                    }
                }else if(line === "cd .."){
                    //if cd .. we are done with this directory, push it to the final result, return the size of the sub directory
                    dirSizes.push([dirName, size])
                    lines[i][1] = "read"
                    return size
                }else{
                    // add size of files
                    size += Number(line.split(' ')[0])
                    lines[i][1] = "read"
                }
            }
            // push it to the final result, return the size of the sub directory, end the recursive calls, this happens at the end of the drilling, when we don't cd .. back up
            dirSizes.push([dirName, size])
            return size
        }
}

// (() => {
//     const data = fs.readFileSync(__dirname + '/input.txt').toString();
//     console.log(solveTwoBis(data))
// })() // 2086088
//CORRECT ANSWER
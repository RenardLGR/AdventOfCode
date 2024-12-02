const fs = require("fs").promises;
const assert = require('assert');

// async function readFile(){
//     try {
//         const input = await fs.readFile(__dirname + "/input.txt");
//         console.log(input.toString())
//       } catch (error) {
//         console.error(`Got an error trying to read the file: ${error.message}`)
//       }
// }

// readFile()

(async () => {
    try {
        const example = (await fs.readFile(__dirname + "/example.txt")).toString();
        // assert.deepStrictEqual(solveExample(example), 11)
        // assert.deepStrictEqual(solveTwoExample(example), 31)
		const input = (await fs.readFile(__dirname + "/input.txt")).toString();
        // console.log(input)
		// assert.deepStrictEqual(solveOne(input), 1590491) //1590491
		assert.deepStrictEqual(solveTwo(input), 22588371) //22588371
      } catch (error) {
        console.error(`Got an error: ${error.message}`)
      }
})()

function solveExample(str){
	//step 1 get col 1 and 2
	//step 2 sort col 1 and 2
	//step 3 compare and compute

	//step 1
	let lines = str.split("\r\n")
	let list1 = []
	let list2 = []

	lines.forEach(l => {
		let nums = l.split("   ")
		list1.push(Number(nums[0]))
		list2.push(Number(nums[1]))
	})

	// console.log(lines);
	
	//step 2
	list1.sort((a,b) => a-b)
	list2.sort((a,b) => a-b)

	//step 3
	let res = 0
	for(let i=0 ; i<list1.length ; i++){
		res += Math.abs(list1[i] - list2[i])
	}

	console.log(res);
	
	return res
}

function solveOne(str){
	//step 1 get col 1 and 2
	//step 2 sort col 1 and 2
	//step 3 compare and compute

	//step 1
	let lines = str.split("\n")
	lines.pop()

	let list1 = []
	let list2 = []

	lines.forEach(l => {
		let nums = l.split("   ")
		list1.push(Number(nums[0]))
		list2.push(Number(nums[1]))
	})

	
	//step 2
	list1.sort((a,b) => a-b)
	list2.sort((a,b) => a-b)

	//step 3
	let res = 0
	for(let i=0 ; i<list1.length ; i++){
		res += Math.abs(list1[i] - list2[i])
	}

	console.log(res);
	
	return res
}

function solveTwoExample(str){
	//step 1 get col 1 and 2
	//step 2 for each element of col 1, count its frequency in col 2 and compute res

	//step 1
	let lines = str.split("\r\n")
	let list1 = []
	let list2 = []

	lines.forEach(l => {
		let nums = l.split("   ")
		list1.push(Number(nums[0]))
		list2.push(Number(nums[1]))
	})

	let res = 0
	list1.forEach(el => {
		let freq = list2.filter(e => e === el).length

		res += el * freq
	})
	
	return res
}

function solveTwo(str){
	//step 1 get col 1 and 2
	//step 2 for each element of col 1, count its frequency in col 2 and compute res

	//step 1
	let lines = str.split("\n")

	lines.pop()

	let list1 = []
	let list2 = []

	lines.forEach(l => {
		let nums = l.split("   ")
		list1.push(Number(nums[0]))
		list2.push(Number(nums[1]))
	})

	let res = 0
	list1.forEach(el => {
		let freq = list2.filter(e => e === el).length

		res += el * freq
	})
	
	// console.log(res);
	
	return res
}

//another way to extract both cols
function solveTwoBis(input){
	const numbers = "0123456789"
	let list1 = []
	let list2 = []

	let curr = ""
	let bool = true // if true, curr goes to list1, else it goes to list2
	for(let char of input){
		if(numbers.includes(char)){
			curr += char
		}else if(curr.length !== 0){
			bool ? list1.push(Number(curr)) : list2.push(Number(curr))

			bool = !bool
			curr = ""
		}
	}

	let res = 0
	list1.forEach(el => {
		let freq = list2.filter(e => e === el).length

		res += el * freq
	})
	
	// console.log(res);
	
	return res
}

// ============================ CALLS ============================
const fs = require("fs");
const assert = require("assert");

let input = fs.readFileSync(__dirname + "/input.txt").toString()

// PARSING
input = input.replaceAll("\r", "")
let [registers, program] = input.split("\n\n")

let regA, regB, regC
let instructIndex = 0
let isSkipping = false // Do I skip the natural +2 instructIndex
let output = []

registers.split("\n").forEach((r, i) => {
    if(i === 0){
        regA = Number(r.split(": ")[1])
    }
    if(i === 1){
        regB = Number(r.split(": ")[1])
    }
    if(i === 2){
        regC = Number(r.split(": ")[1])
    }
})

program = program.split(": ")[1].split(",").map(Number)

function solveOne(){
    while(instructIndex < program.length){
        const opcode = program[instructIndex];
        const operand = program[instructIndex+1];

        isSkipping = false
        const returned = callInctruction(opcode, operand)
        
        if(isSkipping) continue

        instructIndex += 2
    }

    let res = output.join(",")
    // console.log(res)
    return output.join(",")
}
// assert.deepStrictEqual(solveOne(), "1,7,2,1,4,1,5,4,0") // "1,7,2,1,4,1,5,4,0"

function solveTwo(){
    let tryRegA = 1
    let outputIndex = program.length - 1

    while(true){
        regA = tryRegA
        instructIndex = 0
        output = []
        const resOne = solveOne()

        if(resOne === program.join(",")){
            console.log(tryRegA)
            return tryRegA
        }

        if(resOne === program.slice(outputIndex).join(",")){
            tryRegA *= 8
            outputIndex--
            continue
        }

        tryRegA++
    }
}

// assert.deepStrictEqual(solveTwo(), 37221261688308) // 37221261688308

function getComboValue(oper){
    return {
        "0": () => 0,
        "1": () => 1,
        "2": () => 2,
        "3": () => 3,
        "4": () => regA,
        "5": () => regB,
        "6": () => regC,
        "7": () => new Error("Unvalid combo operand"),

    }[oper]();
}

function callInctruction(opcode, oper){
    return {
        '0' : (oper) => { // adv
            regA = Math.trunc(regA / (Math.pow(2, getComboValue(oper))));
            return regA;
          },
          '1': (oper) => { // bxl
            regB ^= oper;
            return regB;
          },
          '2': (oper) => { // bst
            regB = ((getComboValue(oper) % 8) + 8) % 8;
            return regB;
          },
          '3': (oper) => { // jnz
            if (regA === 0) {
                return false;
            }
            isSkipping = true;
            instructIndex = oper;
            return true;
          },
          '4': (oper) => { // bxc
            regB ^= regC;
            return regB;
          },
          '5': (oper) => { // out
            let val = ((getComboValue(oper) % 8) + 8) % 8;
            output.push(val);
            return val;
          },
          '6': (oper) => {  // bdv
            regB = Math.trunc(regA / (Math.pow(2, getComboValue(oper))));
            return regB;
          },
          '7': (oper) => { // cdv
            regC = Math.trunc(regA / (Math.pow(2, getComboValue(oper))));
            return regC;
          }
    }[opcode](oper)
}
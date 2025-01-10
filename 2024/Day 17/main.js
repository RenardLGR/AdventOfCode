class Solution{
    constructor(input){
        this.parse(input)
        this.regA
        this.regB
        this.regC
        this.program
        this.instructions = [this.adv, this.bxl, this.bst, this.jnz, this.bxc, this.out, this.bdv, this.cdv]
        this.instructIndex = 0        
    }

    parse(input){
        input = input.replaceAll("\r", "")
        const [registers, program] = input.split("\n\n")

        registers.split("\n").forEach((r, i) => {
            if(i === 0){
                this.regA = Number(r.split(": ")[1])
            }
            if(i === 1){
                this.regB = Number(r.split(": ")[1])
            }
            if(i === 2){
                this.regC = Number(r.split(": ")[1])
            }
        })

        this.program = program.split(": ")[1].split(",").map(Number)
    }

    runOne(){
        let res = []
        while(this.instructIndex < this.program.length){
            const opcode = this.program[this.instructIndex];
            const operand = this.program[this.instructIndex+1];
            const returned = this.instructions[opcode].call(this, operand); // Somehow the binding of this to the class instance is lost???

            // Expect a value from opcode 3 and opcode 5
            // opcode 3 changes the index of the instruction pointer if the returned value is true
            if(opcode === 3 && returned) continue
            // opcode 5 adds to the result
            if(opcode === 5) res.push(returned)

            this.instructIndex += 2
        }

        console.log(res);
        
        return res.join(",")
    }

    runTwo(){
        const expectedRes = this.program
        const originalRegB = this.regB
        const originalRegC = this.regC

        let tryRegA = 0
        while(true){
            this.regA = tryRegA
            this.regB = originalRegB
            this.regC = originalRegC
            this.instructIndex = 0
            

            let res = []
            while(this.instructIndex < this.program.length){
                const opcode = this.program[this.instructIndex];
                const operand = this.program[this.instructIndex+1];
                const returned = this.instructions[opcode].call(this, operand); // Somehow the binding of this to the class instance is lost???
    
                // Expect a value from opcode 3 and opcode 5
                // opcode 3 changes the index of the instruction pointer if the returned value is true
                if(opcode === 3 && returned) continue
                // opcode 5 adds to the result
                if(opcode === 5){
                    res.push(returned)
                    // If the suffix doesn't even look like the expected res, stop it
                    if(res[res.length-1] !== expectedRes[res.length-1]) break
                }
    
                this.instructIndex += 2
            }

            if(tryRegA === 117440){
                console.log(res.join(","))
            }
            res = res.join(",")
            if(res === expectedRes.join(",")){
                console.log(tryRegA)
                return tryRegA
            }

            tryRegA++
        }
    }

    getComboValue(oper){
        switch (oper) {
            case 0:
            case 1:
            case 2:
            case 3:
                return oper
            case 4:
                return this.regA
            case 5:
                return this.regB
            case 6:
                return this.regC
            case 7:
                throw new Error("Unvalid combo operand")
            default:
                throw new Error("Unvalid combo operand")
        }
    }

    // opcode 0
    adv(oper){        
        let denominator = Math.pow(2, this.getComboValue(oper))
        let div =  Math.trunc(this.regA / denominator)
        this.regA = div
    }

    // opcode 1
    bxl(oper){
        this.regB = this.regB ^ oper
    }

    // opcode 2
    bst(oper){
        let combo = this.getComboValue(oper)
        this.regB = combo % 8
    }

    // opcode 3
    jnz(oper){
        if(this.regA === 0) return false
        this.instructIndex = oper
        return true
    }

    // opcode 4
    bxc(oper){
        this.regB = this.regB ^ this.regC
    }

    // opcode 5
    out(oper){
        return this.getComboValue(oper) % 8
    }

    // opcode 6
    bdv(oper){
        let denominator = Math.pow(2, this.getComboValue(oper))
        let div =  Math.trunc(this.regA / denominator)
        this.regB = div
    }

    // opcode 7
    cdv(oper){
        let denominator = Math.pow(2, this.getComboValue(oper))
        let div =  Math.trunc(this.regA / denominator)
        this.regC = div
    }
}

// ============================ CALLS ============================
const fs = require("fs");
const assert = require("assert");

(() => {
    // try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const example1 = fs.readFileSync(__dirname + "/example1.txt").toString()
        const example2 = fs.readFileSync(__dirname + "/example2.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        const examplePartII = fs.readFileSync(__dirname + "/example-part-2.txt").toString()
        // console.log(input);
        const solutionExample = new Solution(example)
        const solutionExample1 = new Solution(example1)
        const solutionExample2 = new Solution(example2)
        const solutionInput = new Solution(input)
        const solutionExamplePartII = new Solution(examplePartII)

        // assert.deepStrictEqual(solutionExample.runOne(), "4,6,3,5,6,3,5,2,1,0") // "4,6,3,5,6,3,5,2,1,0"
        // assert.deepStrictEqual(solutionExample1.runOne(), "0,1,2") // "0,1,2"
        // assert.deepStrictEqual(solutionExample2.runOne(), "4,2,5,6,7,7,7,7,3,1,0") // "4,2,5,6,7,7,7,7,3,1,0"
        // assert.deepStrictEqual(solutionInput.runOne(), "1,7,2,1,4,1,5,4,0") // "1,7,2,1,4,1,5,4,0"

        // assert.deepStrictEqual(solutionExamplePartII.runTwo(), 117440) // 117440
        assert.deepStrictEqual(solutionInput.runTwo(), 117440) // 117440
    // } catch (error) {
    //     console.error(`Got an error: ${error.message}`)
    // }
})()
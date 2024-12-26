const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveOne(example), 480) // 480
        // assert.deepStrictEqual(solveOne(input), 35574) // 35574
        // assert.deepStrictEqual(solveOneBis(example), 480) // 480
        // assert.deepStrictEqual(solveOneBis(input), 35574) // 35574
        // assert.deepStrictEqual(solveOneTer(example), 480) // 480
        // assert.deepStrictEqual(solveOneTer(input), 35574) // 35574

        assert.deepStrictEqual(solveTwo(input), 80882098756071) // 80882098756071
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

// ============================ PART I ============================
function solveOne(input){
    input = input.replaceAll("\r", "")

    let machines = input.split("\n\n")
    machines = machines.map(machine => {
        let instructions = machine.split('\n')
        const regex = /\d+/g

        let matchA = instructions[0].match(regex).map(Number) // [xoffset, yoffset]
        let matchB = instructions[1].match(regex).map(Number) // [xoffset, yoffset]
        let matchPrize = instructions[2].match(regex).map(Number) // [xprize, yprize]

        return {A: matchA, B: matchB, prize: matchPrize}
    })

    const ATokenCost = 3
    const BTokenCost = 1

    let res = 0

    machines.forEach(machine => {
        const [axoffs, ayoffs] = machine.A
        const [bxoffs, byoffs] = machine.B
        const [xprize, yprize] = machine.prize

        let cheapestTokenCost = Infinity
        let isPossible = false

        //choose how many button press (max is 100 of A and 100 of B)
        for(let press=1 ; press<=200 ; press++){
            //choose how many of those are As (other will automatically be Bs)
            for(let As=0 ; As<=100 && As<=press ; As++){
                const Bs = press - As
                const position = [As*axoffs + Bs*bxoffs, As*ayoffs + Bs*byoffs] // [x, y]
                if(position[0]===xprize && position[1]===yprize){
                    isPossible = true
                    const tokenCost = As*ATokenCost + Bs*BTokenCost
                    if(tokenCost < cheapestTokenCost) cheapestTokenCost = tokenCost
                }
            }
        }

        if(isPossible){
            res += cheapestTokenCost
        }
    })

    console.log(res)

    return res
}

function solveOneBis(input){
    input = input.replaceAll("\r", "")

    let machines = input.split("\n\n")
    machines = machines.map(machine => {
        let instructions = machine.split('\n')
        const regex = /\d+/g

        let matchA = instructions[0].match(regex).map(Number) // [xoffset, yoffset]
        let matchB = instructions[1].match(regex).map(Number) // [xoffset, yoffset]
        let matchPrize = instructions[2].match(regex).map(s => Number(s)) // [xprize, yprize]

        return {A: matchA, B: matchB, prize: matchPrize}
    })

    const ATokenCost = 3
    const BTokenCost = 1

    let res = 0
    machines.forEach(machine => {
        let tokens = minTokens(machine.prize, machine.A, machine.B)
        if(tokens !== Infinity) res += tokens
    })
    
    console.log(res)

    return res

    // (prize: [x, y], A:[xoffset, yoffset], B:[xoffset, yoffset]) : Number
    function minTokens(prize, A, B){
        const [xprize, yprize] = prize
        const [axoffs, ayoffs] = A
        const [bxoffs, byoffs] = B
        let minTokens = Infinity

        //Get every pair (a, b)

        //loop on As
        let As = 0
        while(As <= 100){
            if(axoffs * As > prize[0] || ayoffs * As > prize[1]) break

            //loop on Bs
            let Bs = 0
            while(Bs <= 100){
                const tokens = As* ATokenCost + Bs * BTokenCost
                if(tokens > minTokens) break
                const position = [As*axoffs + Bs*bxoffs, As*ayoffs + Bs*byoffs]
                if(position[0] > xprize || position[1] > yprize) break

                //on target
                if(position[0] === xprize && position[1] === yprize){
                    if(tokens < minTokens) minTokens = tokens
                    break
                }
    
                Bs++
            }
            As++
        }

        return minTokens
    }
}

function solveOneTer(input){
    input = input.replaceAll("\r", "")

    let machines = input.split("\n\n")
    machines = machines.map(machine => {
        let instructions = machine.split('\n')
        const regex = /\d+/g

        let matchA = instructions[0].match(regex).map(Number) // [xoffset, yoffset]
        let matchB = instructions[1].match(regex).map(Number) // [xoffset, yoffset]
        let matchPrize = instructions[2].match(regex).map(s => Number(s)) // [xprize, yprize]

        return {A: matchA, B: matchB, prize: matchPrize}
    })

    const ATokenCost = 3
    const BTokenCost = 1

    let res = 0

    machines.forEach(machine => {
        const [axoffs, ayoffs] = machine.A
        const [bxoffs, byoffs] = machine.B
        const [xprize, yprize] = machine.prize

        // We are going to try every tokens until we find a pair of presses on A and B that can lead us to the prize.
        // A press on A costs 3 tokens and a press on B costs one token. Let As and Bs the number of press on A and B, let t be the number of tokens, for a given t and As, we have :
        // 3*As + Bs = t <=> Bs = t - 3As

        let tokens = 0
        while(tokens <= 400){
            //loop on As
            for(let As=0 ; As<=100 ; As++){
                const Bs = tokens - As*ATokenCost //find Bs
                if(Bs < 0) continue

                const position = [As*axoffs + Bs*bxoffs, As*ayoffs + Bs*byoffs]
                if(position[0]===xprize && position[1]===yprize){
                    res += tokens
                    return
                }
            }
            tokens++
        }
    })

    console.log(res)

    return res
}
// ============================ PART II ============================
// Let's take machine 1 in example.txt
// Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400
// Let A and B the number of press on button A and button b respectively.
// We are asked to solve the linear Diophantine equations :
// 94*A + 22*B = 8400 and
// 34*A + 67*B = 5400
// Step 1 - Eliminate 1 variable (here aligning A) :
// 34*(94*A + 22*B) = 34*8400   =>  3196A + 748B = 285600 (1)
// 94*(34*A + 67*B) = 94*5400   =>  3196A + 6298B = 507600 (2)
// Eliminate A by subtracting (1) from (2) to keep everything positive :
// (3196A + 6298B)−(3196A + 748B) = 507600 − 285600     <=>
// 5550B = 222000       => B = 40
// Now find A :
// 94*A + 22*40 = 8400  <=>  94A + 880 = 8400  <=> 94A = 7520      => A = 80
// The only natural number solution is A = 80 and B = 40

function solveTwo(input){
    input = input.replaceAll("\r", "")

    let machines = input.split("\n\n")
    machines = machines.map(machine => {
        let instructions = machine.split('\n')
        const regex = /\d+/g

        let matchA = instructions[0].match(regex).map(Number) // [xoffset, yoffset]
        let matchB = instructions[1].match(regex).map(Number) // [xoffset, yoffset]
        let matchPrize = instructions[2].match(regex).map(s => Number(s) + 10000000000000) // [xprize, yprize]

        return {A: matchA, B: matchB, prize: matchPrize}
    })

    const ATokenCost = 3
    const BTokenCost = 1

    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER

    let res = 0

    machines.forEach(machine => {
        const [As, Bs] = findPair(machine.A, machine.B, machine.prize)

        if(Number.isInteger(As) && Number.isInteger(Bs)){
            res += As * ATokenCost
            res += Bs * BTokenCost
        }
    })

    console.log(res)

    return res

    function findPair(A, B, prize){
        const [xprize, yprize] = prize
        const [axoffs, ayoffs] = A
        const [bxoffs, byoffs] = B

        let equationX = [axoffs, bxoffs, xprize]
        equationX = equationX.map(n => n*ayoffs)

        let equationY = [ayoffs, byoffs, yprize]
        equationY = equationY.map(n => n*axoffs)

        let Bs = (equationX[2]-equationY[2]) / (equationX[1]-equationY[1])
        let As = (xprize - bxoffs*Bs) / (axoffs)

        return [As, Bs]
    }
}

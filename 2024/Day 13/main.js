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

        // assert.deepStrictEqual(solveTwo(input), 80882098756071) // 80882098756071
        assert.deepStrictEqual(solveTwoBis(input), 80882098756071) // 80882098756071
        assert.deepStrictEqual(solveTwoTer(input), 80882098756071) // 80882098756071
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
// https://en.wikipedia.org/wiki/System_of_linear_equations#Elimination_of_variables
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

// The solution is always unique (since one equation is not a scalar multiple of the other). Some solutions will not be integers and will be discarded.

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

// Same idea than above, less lines
function solveTwoBis(input){
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


    let res = 0

    machines.forEach(machine => {
        const [xprize, yprize] = machine.prize
        const [axoffs, ayoffs] = machine.A
        const [bxoffs, byoffs] = machine.B

        const Bs = (yprize*axoffs - xprize*ayoffs) / (axoffs*byoffs - bxoffs*ayoffs)
        const As = (xprize - bxoffs*Bs) / axoffs

        if(Number.isInteger(As) && Number.isInteger(Bs)){
            res += As * ATokenCost
            res += Bs * BTokenCost
        }
    })

    console.log(res)

    return res
}


// Using Cramer's rule
// https://en.wikipedia.org/wiki/Cramer%27s_rule#Explicit_formulas_for_small_systems
// Let A and B the number of button press of A and B respectively. x_A, x_B the offset on x and y_A, y_B the offset on y for A and B. x_p, y_p the coordinates of the prize.
// We have the linear system :
// A*x_A + b*x_B = x_p
// A*y_A + b*y_B = y_p

// which in matrix format is :
// |x_a x_B| |A|   |x_p|
// |y_A y_B|.|B| = |y_p|

// With Cramer's rule, we have :

//        |x_p x_B|      |x_A x_B|
// A = det|y_p y_B| / det|y_A y_B|  =  ((x_p*y_B) - (x_B*y_p)) / ((x_A*y_B)-(x_B*y_A))   and


//        |x_A x_p|      |x_A x_B|
// B = det|y_A y_p| / det|y_A y_B|  =  ((x_A*y_p) - (x_p*y_A)) / ((x_A*y_B)-(x_B*y_A))

function solveTwoTer(input){
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


    let res = 0

    machines.forEach(machine => {
        const [x_p, y_p] = machine.prize
        const [x_A, y_A] = machine.A
        const [x_B, y_B] = machine.B

        const A = ((x_p*y_B) - (x_B*y_p)) / ((x_A*y_B)-(x_B*y_A))
        const B = ((x_A*y_p) - (x_p*y_A)) / ((x_A*y_B)-(x_B*y_A))

        if(Number.isInteger(A) && Number.isInteger(B)){
            res += A * ATokenCost
            res += B * BTokenCost
        }
    })

    console.log(res)

    return res
}

//======================================================
// We can also use the Gauss-Jordan elimination algorithm and achieve the same result.
// For a system of equations Ax = c where A is the coefficient matrix and c is the column (or vector) of constants, we build the augmented matrix :

// [A|c]

// And by using elementary row operations such as :
// - Swapping rows.
// - Scaling rows (multiplying/dividing by constants).
// - Adding or subtracting multiples of rows.

// We want to get it to its reduced row-echelon form where I is the identity matrix and x is the vector containing the solutions to the system :
// [I|x]

// In our case, the augmented matrix is :
// |xa xb xp|                                            |1 0 A|
// |ya yb yp| and its reduced row-echelon form would be  |0 1 B| where A and B are the solutions of the equations.

// Let's do the calculations :

// L2 - ya/xa * L1 -> L2
// |xa xb xp|    |      xa                   xb                       xp      |     |xa         xb                  xp          |
// |ya yb yp| -> |ya - ya/xa * xa       yb - ya/xa * xb       yp - ya/xa * xp |  =  |0   (xayb - xbya)/xa      (xayp - xpya)/xa |

// xa / (xayb - xbya) * L2 -> L2
// |xa  xb                   xp                 |     |xa     xb                  xp                |
// |0   1    (xayp - xpya)/xa * xa/(xayb - xbya)|  =  |0      1       (xayp - xpya) / (xayb - xbya) |

// L1 - xb*L2 -> L1
// |xa  xb-xb     xp - (xb * (xayp - xpya) / (xayb - xbya)) |     |xa  0   (xp(xayb - xbya) - xb(xayp - xpya)) / (xayb - xbya) |
// |0     1            (xayp - xpya) / (xayb - xbya)        |  =  |0   1           (xayp - xpya) / (xayb - xbya)               |  = 

// |xa  0  (xaxpyb - xbxpya - xaxbyp + xbxpya) / (xayb - xbya)  |     |xa  0  (xaxpyb - xaxbyp) / (xayb - xbya)   |
// |0   1               (xayp - xpya) / (xayb - xbya)           |  =  |0   1   (xayp - xpya) / (xayb - xbya)      |

// L1/xa -> L1
// |1  0  (xaxpyb - xaxbyp) / xa(xayb - xbya)  |     |1  0    (xpyb - xbyp) / (xayb - xbya)  |
// |0  1   (xayp - xpya) / (xayb - xbya)       |  =  |0  1    (xayp - xpya) / (xayb - xbya)  |

// Following Gauss-Jordan, we have :
// A = (xpyb - xbyp) / (xayb - xbya) and B = (xayp - xpya) / (xayb - xbya) which are the same results as found above using Cramer's rule

// Unfortunately, this algorithm will introduce divisions and so floating point arithmetic and so the program associated will have precision issues.
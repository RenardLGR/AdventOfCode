const fs = require("fs");
const assert = require("assert");


(() => {
    try {
        const example = fs.readFileSync(__dirname + "/example.txt").toString()
        const input = fs.readFileSync(__dirname + "/input.txt").toString()
        // console.log(input);
        // assert.deepStrictEqual(solveExample(example), 143)
        // assert.deepStrictEqual(solveOne(input), 4462) // 4462
        // assert.deepStrictEqual(solveTwo(example), 123)
        // assert.deepStrictEqual(solveTwo(input), 6767) // 6767
        // assert.deepStrictEqual(solveTwoBis(input), 6767) // 6767
        assert.deepStrictEqual(solveTwoTer(input), 6767) // 6767
    } catch (error) {
        console.error(`Got an error: ${error.message}`)
    }
})()

// PART I and II reasoning process / preamble : "All true is equivalent to none false"
// We are getting ask if an update is in the right order (If all pages of the update are in the right spot).
// Let P(x) be the predicate "the page x is in the right spot" and ¬P(x) : "the page x is not in the right spot"
// Let A and B be logical propositions, with De Morgan's laws : 
// ¬(A ∧ B) ≡ (¬A ∨ ¬B) i.e Not (A and B) is the same as (Not A) or (Not B)
// ¬(A ∨ B) ≡ (¬A ∧ ¬B) i.e Not (A or B) is the same as (Not A) and (Not B)
// We have the generalization (1) ∀xP(x) ≡ ¬(∃x¬P(x)) (2)  i.e All elements are true is the same as None of the elements are false.
// https://en.wikipedia.org/wiki/De_Morgan%27s_laws#Extension_to_predicate_and_modal_logic

// In other terms, checking "All pages are in the right spot" (1) is like checking "No page is in the wrong spot" (2) or "A page in the wrong spot doesn't exist" (2)
// So, finding a page in the wrong spot will invalidate (2) and in consequence (1). We will be attempting that in the following program.

// ============================ PART I ============================
function solveExample(input){
    // ========= PARSING =========
    input = input.replaceAll("\r", "")

    let [rawOrders, rawUpdates] = input.split("\n\n")
    
    // vanillaOrders is just an Array of rule couples [A, B] meaning A comes before B
    let vanillaOrders = rawOrders.split("\n").map(r => r.split("|").map(Number))

    // cleanOrders should be an Object with each page as a key, and as value an Array of pages that should be printed after the key page
    // Example :
    // {97 : [13, 61, 47, 29, 53, 75],
    // 47 : [53, 13, 61, 29],
    // page : [...printedAfter page]}
    // meaning the page 97 should be printed before page 13, 61, 47, 29 and 53
    let cleanOrders = {}
    rawOrders.split("\n").forEach(l => {
        let [page, after] = l.split("|").map(Number)
        // cleanOrders[page] = (cleanOrders[page] || []).concat(after)
        if(page in cleanOrders){
            cleanOrders[page].push(after)
        }else{
            cleanOrders[page] = [after]
        }
    })

    // cleanUpdates is just an Array containing the given update order as subarrays
    let cleanUpdates = rawUpdates.split("\n")
    if(cleanUpdates[cleanUpdates.length-1] === ""){
        cleanUpdates.pop()
    }
    cleanUpdates = cleanUpdates.map(l => l.split(",").map(Number))
    
    // ========= SOLVING =========
    let res = 0
    cleanUpdates.forEach((l, idx) => {
        if(isUpdateRightOrder(l, cleanOrders)){
        // if(isUpdateRightOrderVanilla(l, vanillaOrders)){
            // console.log("line ", idx+1, " is ok");
            let middle = l[Math.floor(l.length/2)]
            res += middle
        }else{
            // console.log("line ", idx+1, " is not ok");
        }
    })

    console.log(res);
    
    return res
}

// (update : Array<Number>, cleanOrders : Object{page : Array<Number>}) : Boolean
// Tell if an update is in the right order, given the page ordering rules
function isUpdateRightOrder(update, cleanOrders){
    // To do so, we have to check for each page at index idx of the update if no pages before idx are in cleanOrders[idx]
    for(let i=0 ; i<update.length ; i++){
        let page = update[i]
        for(let j=0 ; j<i ; j++){
            // Some pages are not in the page ordering rules, ignore those
            if(!(page in cleanOrders)) continue
            if(cleanOrders[page].includes(update[j])){
                // console.log(page, " should have been printed before ", update[j])
                return false
            }
        }
    }
    return true
}


// (update : Array<String>, orderingRules : Array<Array>String>>) : Boolean
// This is a more vanilla way of doing it, it takes the rules without too much parsing.
// For every rules where it is mentioned that A should be before B : A|B, we will see if there is no B breaking that rule
function isUpdateRightOrderVanilla(update, orderingRules) {
    // orderingRules = [['47', '53'], ['97', '13'], ['97', '61'], ['97', '47'], ['75', '29'], ['61', '13']]
    // [A, B] means A should be printed before B
    // update = [ '97', '61', '53', '29', '13' ]

    for (let i = 0; i < update.length; i++) {
        let page = update[i]
        // Check 
        for (let j = 0; j < orderingRules.length; j++) { 
            let rule = orderingRules[j]
            let after = rule[1]
            if(rule[0] === page){
                // The rule says page should be before rule[1]
                for(let k=i-1 ; k>=0 ; k--){
                    // If I find a page before update[i] such as it breaks a rule, we have a faulty order
                    if(update[k] === after){
                        // console.log("Wrong", page, "should be before", update[k])
                        return false
                    }
                }
            }
        }
    }

    return true
}

function solveOne(input){
    return solveExample(input)
}

// ============================ PART II ============================
function solveTwo(input){
    // ========= PARSING =========
    input = input.replaceAll("\r", "")

    let [rawOrders, rawUpdates] = input.split("\n\n")

    // cleanOrders should be an Object with each page as a key, and as value an Array of pages that should be printed after the key page
    // Example :
    // {97 : [13, 61, 47, 29, 53, 75],
    // 47 : [53, 13, 61, 29],
    // page : [...printedAfter page]}
    // meaning the page 97 should be printed before page 13, 61, 47, 29 and 53

    let cleanOrders = {}
    rawOrders.split("\n").forEach(l => {
        let [page, after] = l.split("|").map(Number)
        // cleanOrders[page] = (cleanOrders[page] || []).concat(after)
        if(page in cleanOrders){
            cleanOrders[page].push(after)
        }else{
            cleanOrders[page] = [after]
        }
    })    

    // cleanUpdates is just an Array containing the given update order as subarrays
    let cleanUpdates = rawUpdates.split("\n")
    if(cleanUpdates[cleanUpdates.length-1] === ""){
        cleanUpdates.pop()
    }
    cleanUpdates = cleanUpdates.map(l => l.split(",").map(Number))
    
    // ========= SOLVING =========
    let res = 0
    cleanUpdates.forEach((l, idx) => {
        if(isUpdateRightOrder(l, cleanOrders)){
        }else{
            let rightOrder = getRightOrderBis(l, cleanOrders)
            let middle = rightOrder[Math.floor(rightOrder.length/2)]
            res += middle
        }
    })

    console.log(res);
    
    return res
}

// (update : Array<Number>, cleanOrders : Object{page : Array<Number>}) : Boolean
// From an update in the wrong order, returns the update in the right order
// Adapting part I, once we find a conflict  between two pages and their rule, we switch them and re-run the function.
// At one point, no switches are made meaning every pages of an update are correctly ordered.
//! Note : this function changes the array in place, the returned array has the same address as the input one
function getRightOrder(update, cleanOrders){
    let isDone = false
    while(!isDone){
        isDone = true
        //loop on update elements
        for(let i=0 ; i<update.length ; i++){
            let page = update[i]
            //loop on elements before
            for(let j=0 ; j<i ; j++){
                // Some pages are not in the page ordering rules, ignore those
                if(!(page in cleanOrders)) continue
                if(cleanOrders[page].includes(update[j])){
                    isDone = false
                    // console.log(page, " should have been printed before ", update[j])
                    update[i] = update[j]
                    update[j] = page
                    break
                }
            }
        }
    }
    return update
}

// (update : Array<Number>, cleanOrders : Object{page : Array<Number>}) : Boolean
// From an update in the wrong order, returns the update in the right order
// We can just use the built-in sort method with the rules given by cleanOrders
function getRightOrderBis(update, cleanOrders){
    return update.sort((a,b) => {
        // A negative value indicates that a should come before b.
        // A positive value indicates that a should come after b.
        // Zero or NaN indicates that a and b are considered equal.
        if((a in cleanOrders) && cleanOrders[a].includes(Number(b))){
            //It means a is before b
            return -1
        }
        if((b in cleanOrders) && cleanOrders[b].includes(Number(a))){
            //It means b is before a
            return 1
        }
        return 0
    })
}

// Nothing new, the sorting is implemented inside the function
function solveTwoBis(input){
    input = input.replaceAll("\r", "")
    let [rawOrders, rawUpdates] = input.split("\n\n")
    
    let cleanOrders = rawOrders.split("\n").reduce((acc, cur) => {
        let [before, after] = cur.split("|")
        acc[before] = (acc[before] || []).concat(after)
        return acc
    }, {})

    let cleanUpdates = rawUpdates.split("\n")
    if(cleanUpdates[cleanUpdates.length-1] === ""){
        cleanUpdates.pop()
    }
    cleanUpdates = cleanUpdates.map(l => l.split(","))

    let res = 0
    cleanUpdates.forEach(update => {
        let sorted = update.slice().sort((a,b) => {
            if((a in cleanOrders) && cleanOrders[a].includes(b)){
                // a should be before b
                return -1
            }
            if((b in cleanOrders) && cleanOrders[b].includes(a)){
                // a should be before b
                return 
            }
            return 0
        })
        //check if update and sorted are the same, if so we had a correctly ordered update
        if(!update.every((e,i) => e === sorted[i])){
            let middlePage = sorted[Math.floor(sorted.length/2)]
            res += Number(middlePage)
        }
    })

    console.log(res)

    return res
}



// Using a homemade merge sort for fun !
function solveTwoTer(input){
    input = input.replaceAll("\r", "")

    let [rawOrders, rawUpdates] = input.split("\n\n")
    
    let cleanOrders = rawOrders.split("\n").reduce((acc, cur) => {
        let [before, after] = cur.split("|")
        acc[before] = (acc[before] || []).concat(after)
        return acc
    }, {})

    let cleanUpdates = rawUpdates.split("\n")
    if(cleanUpdates[cleanUpdates.length-1] === ""){
        cleanUpdates.pop()
    }
    cleanUpdates = cleanUpdates.map(l => l.split(","))
    
    let res = 0
    cleanUpdates.forEach(update => {
        let sorted = mergeSort(update, cleanOrders)
        //check if update and sorted are the same, if so we had a correctly ordered update
        if(!update.every((e,i) => e === sorted[i])){
            let middlePage = sorted[Math.floor(sorted.length/2)]
            res += Number(middlePage)
        }
    })

    console.log(res);
    
    return res
}

// (update : Array<Number>, cleanOrders : Object{page : Array<Number>}) : Array<Number>
// using a homemade merge sort, returns the update in the right order
function mergeSort(update, cleanOrders){
    if(update.length <= 1) return update

    let middle = Math.floor(update.length/2)
    let left = mergeSort(update.slice(0, middle), cleanOrders)
    let right = mergeSort(update.slice(middle), cleanOrders)

    return merge(left, right, cleanOrders)
}

function merge(left, right, cleanOrders){
    let res = []

    while(left.length > 0 || right.length > 0){
        if(left.length === 0){
            res = res.concat(right)
            return res
        }
        if(right.length === 0){
            res = res.concat(left)
            return res
        }
        let l = left[0]
        let r = right[0]

        // if there is no rule on r or l, their order doesn't matter
        if(!(l in cleanOrders) && !(r in cleanOrders)){
            res.push(l)
            res.push(r)
        }
        //push r : r is before l
        else if((r in cleanOrders) && cleanOrders[r].includes(l)){
            res.push(r)
            right.shift()
        }
        //push l : l is before r
        else if((l in cleanOrders) && cleanOrders[l].includes(r)){
            res.push(l)
            left.shift()
        }
        else{
            //It doesn't go there
        }
    }
}
let decodedLine = [0, 0, '.', '.', '.', 1, 1, 1, '.', '.', '.', 2, '.', '.', '.', 3, 3, 3, '.', 4, 4, '.', 5, 5, 5, 5, '.', 6, 6, 6, 6, '.', 7, 7, 7, '.', 8, 8, 8, 8, 9, 9]

for(let i=0 ; i<decodedLine.length ; i++){
    if(decodedLine[i] !== "."){
        console.log(decodedLine[i])
    } else{
        for(let j=decodedLine.length-1 ; j>=0 ; j--){
        if(decodedLine[j] !== "."){
            decodedLine[i] = decodedLine[j]
            decodedLine[j] = "."
        }else{

            decodedLine[i] = decodedLine[j]

        }   
    }

    if(i===2){
        console.log(decodedLine)
    }
        
    }
}
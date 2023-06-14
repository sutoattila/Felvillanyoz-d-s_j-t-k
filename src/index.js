//Név lementése sütibe
import { setCookie, getCookie, deleteCookie } from "./cookies.js";
const p = document.querySelector("#nev")
const nameText = document.querySelector("#name")
const btn = document.querySelector("#btn")
btn.addEventListener("click", ()=>setCookie("username", nameText.value))
const user = getCookie("username")
if(user!= ""){
    p.innerText = "Hello " + user
    //deleteCookie("username")
}
else{
    nameText.parentElement.hidden = false
}
//a játék leírás gombja
const desc = document.querySelector("#desc")
const description = document.querySelector("#description")
desc.addEventListener("click",ClickDesc)
let descHide=false
function ClickDesc(e) {
    if(!descHide){
        description.hidden=false
        descHide=true
        desc.textContent="Játékleírás elrejtése"
    }
    else{
        description.hidden=true
        descHide=false
        desc.textContent="Játékleírás megjelenítése"
    }
}

//A játékpályákat reprezentáló mátrixok
let matrix7 = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],    
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],    
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
let matrix10 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
   
//Pálya kiválasztása
const select = document.querySelector("#map")
const elapsedTime = document.querySelector("#time")
let start 
let map

//Eltelt idő kijelzése
let inGame=true
function timer() {
    if(inGame){
        let end = Math.floor(Date.now()/1000)
        let elapsed = Math.floor(end - start);
        if(elapsed>=60){
            let elapsedMin=Math.floor(elapsed/60)
            let elapsedSec=elapsed%60
            elapsedTime.innerText=`Eltelt idő: ${elapsedMin} perc ${elapsedSec} mp`; 
            setTimeout(()=>timer(),1000)
        }
        else{
            elapsedTime.innerText=`Eltelt idő: ${elapsed} mp`; 
            setTimeout(()=>timer(),1000)
        }
    }
}

//Új játék gomb
const newGameBtn=document.querySelector("button")
newGameBtn.addEventListener("click",newGame) 
function newGame(e){
    document.querySelector("#gameOver").hidden=true
    document.querySelectorAll("table").forEach(e=>e.hidden=true)
    map=select.value
    let table=document.querySelector("."+map)
    table.hidden=false
    elapsedTime.hidden=false
    start = Math.floor(Date.now()/1000)
    newGameBtn.disabled=true
    main(map)
    timer()
}

//A kiválasztott pálya függvényében 7×7es vagy 10×10es mátrix-szal reprezentáljuk azt
//A mátrixot 0-tól indexeljük!

//A nullát tartalmazó falak már a játék indulásakor zöldek
function greenZeros(matrix,rowsArray){
    for (let i = 0; i < matrix.length; i++) {
        const x = Array.from(rowsArray[i].querySelectorAll('td'))
        x.forEach(cell => {
            if(cell.classList.contains("fal") && parseInt(cell.textContent)==0){
                cell.classList.add("zold")
            }
        });
    }
}
let matrix
//A mátrixot kezelő main függvény
function main(map){
    for (let index = 0; index < 7; index++) {
        const element = matrix7[index];
        for (let j = 0; j < 7; j++) {
            element[j]=0
        }
    }
    for (let index = 0; index < 10; index++) {
        const element = matrix10[index];
        for (let j = 0; j < 10; j++) {
            element[j]=0
        }
    }
    matrix = (map=="easy" || map=="medium") ?  matrix7 : matrix10
    const table = document.querySelector("."+map);//a kiválasztott táblázat
    console.log(`map: ${map}`)
    const rows = table.querySelectorAll('tr');//a kiválasztott táblázat sorai
    const rowsArray = Array.from(rows);//a kiválasztott táblázat soraiból képzett tömb
    greenZeros(matrix,rowsArray)
    render(matrix,rowsArray,onClick)
    console.log("a mátrix7:")
    for(var i = 0; i < matrix7.length; i++) {
        var row_ = matrix7[i];
        console.log(row_.join());
    }
    table.addEventListener('click', onClick)
    function onClick(event) {
        if(!event.target.classList.contains("fal")){//falra kattintáskor nem történik semmi
            const rowIndex = rowsArray.findIndex(row => row.contains(event.target))//a kattintott cella sorindexe
            const tableRow = Array.from(rowsArray[rowIndex].querySelectorAll('td'))//a kattintott sor cellái a táblázatban
            const columnIndex =  tableRow.findIndex(cell => cell == event.target)//a kattintott cella oszlopindex
            let tableColumn = [] //a kattintott oszlop cellái a táblázatban

            for (let index = 0; index < rowsArray.length; index++) { //a tableColumn feltöltése
                const row = rowsArray[index];
                const cells = Array.from(row.querySelectorAll('td'))
                tableColumn.push(cells[columnIndex])
            }

            const matrixRow = matrix[rowIndex]// a kattintott sor cellái a mátrixban

            let matrixColumn = []// a kattintott oszlop cellái a mátrixban
            matrix.forEach(row => {
                matrixColumn.push(row[columnIndex])//matrixColumn feltöltése
            });

            
            console.log(`rowIndex: ${rowIndex}, columnIndex: ${columnIndex}`)

            //üres cellára kattintáskor
            if(matrixRow[columnIndex]==0){
                //beállítjuk -20-ra a mátrix azon elemét amely a kattintott cellának megfelelő 
                matrixRow[columnIndex]=-20
                matrixColumn[rowIndex]=-20
                //jöveljük a mátrix azon elemeit amelyek a kattintott cella sorában vannak (a falakig)
                //jobbra
                for (let index = columnIndex+1; index < matrixRow.length && !tableRow[index].classList.contains("fal") /*&& !tableRow[index].classList.contains("lamp")*/; index++) {
                    matrixRow[index]++;                    
                }
                //balra
                for (let index = columnIndex-1; index >= 0 && !tableRow[index].classList.contains("fal") /*&& !tableRow[index].classList.contains("lamp")*/; index--) {
                    matrixRow[index]++;      
                }
                //jöveljük a mátrix azon elemeit amelyek a kattintott cella oszlopában vannak (a falakig)
                //le
                for (let index = rowIndex+1; index < matrixColumn.length && !tableColumn[index].classList.contains("fal") /*&& !tableColumn[index].classList.contains("lamp")*/; index++) {
                    matrixColumn[index]++;        
                }

                //fel
                for (let index = rowIndex-1; index >=0 && !tableColumn[index].classList.contains("fal") /*&& !tableColumn[index].classList.contains("lamp")*/; index--) {
                    matrixColumn[index]++;       
                }
                //mivel a kattintás során a kattintott cella oszlopa változik frissítjük a mátrixban
                var i=0
                matrix.forEach(row => {
                    row[columnIndex]=matrixColumn[i]
                    i++
                });
                //kiírjuk a frissített mátrixot
                console.log("a mátrix:")
                for(var i = 0; i < matrix.length; i++) {
                    var row_ = matrix[i];
                    console.log(row_.join());
                }
                //átrajzoljuk a mátrix alapján a táblázatot
                render(matrix,rowsArray,onClick)
            }
            else if(matrixRow[columnIndex]<0){
                console.log("AAAAA")
                matrixColumn[rowIndex]+=20
                for (let index = columnIndex+1; index < matrixRow.length && !tableRow[index].classList.contains("fal") /*&& !tableRow[index].classList.contains("lamp")*/; index++) {
                    matrixRow[index]--;                    
                }
                for (let index = columnIndex-1; index >= 0 && !tableRow[index].classList.contains("fal") /*&& !tableRow[index].classList.contains("lamp")*/; index--) {
                    matrixRow[index]--;      
                }

                //le
                for (let index = rowIndex+1; index < matrixColumn.length && !tableColumn[index].classList.contains("fal") /*&& !tableColumn[index].classList.contains("lamp")*/; index++) {
                    matrixColumn[index]--;        
                }

                //fel
                for (let index = rowIndex-1; index >=0 && !tableColumn[index].classList.contains("fal") /*&& !tableColumn[index].classList.contains("lamp")*/; index--) {
                    matrixColumn[index]--;       
                }
                //mivel a kattintás során a kattintott cella oszlopa változik frissítjük a mátrixban
                var i=0
                matrix.forEach(row => {
                    row[columnIndex]=matrixColumn[i]
                    i++
                });
                //kiírjuk a frissített mátrixot
                console.log("a mátrix:")
                for(var i = 0; i < matrix.length; i++) {
                    var row_ = matrix[i];
                    console.log(row_.join());
                }
                //átrajzoljuk a mátrix alapján a táblázatot
                render(matrix,rowsArray,onClick)

            }
            else if(matrixRow[columnIndex]>0){             
                //növeljük a mátrix azon elemeit amelyek a kattintott cella sorában vannak (a falakig)
                //jobbra
                for (let index = columnIndex+1; index < matrixRow.length && !tableRow[index].classList.contains("fal") /*&& !tableRow[index].classList.contains("lamp")*/; index++) {
                    matrixRow[index]++;                    
                }
                //balra
                for (let index = columnIndex-1; index >= 0 && !tableRow[index].classList.contains("fal") /*&& !tableRow[index].classList.contains("lamp")*/; index--) {
                    matrixRow[index]++;      
                }
                //jöveljük a mátrix azon elemeit amelyek a kattintott cella oszlopában vannak (a falakig)
                //le
                for (let index = rowIndex+1; index < matrixColumn.length && !tableColumn[index].classList.contains("fal") /*&& !tableColumn[index].classList.contains("lamp")*/; index++) {
                    matrixColumn[index]++;        
                }

                //fel
                for (let index = rowIndex-1; index >=0 && !tableColumn[index].classList.contains("fal") /*&& !tableColumn[index].classList.contains("lamp")*/; index--) {
                    matrixColumn[index]++;       
                }
                //mivel a kattintás során a kattintott cella oszlopa változik frissítjük a mátrixban
                var i=0
                matrix.forEach(row => {
                    row[columnIndex]=matrixColumn[i]
                    i++
                });
                matrixRow[columnIndex]-=20
                //kiírjuk a frissített mátrixot
                console.log("a mátrix:")
                    for(var i = 0; i < matrix.length; i++) {
                        var row_ = matrix[i];
                        console.log(row_.join());
                }
                console.log(`a cella classListje: ${Array.from(event.target.classList)}`)
                //átrajzoljuk a mátrix alapján a táblázatot
                render(matrix,rowsArray,onClick)
            }
        }
    }
}

function gameOver(wallsOK,matrix,rowsArray,onClick){
    let gameOver=true
    for (let i = 0; i < matrix.length; i++) {
        const x = Array.from(rowsArray[i].querySelectorAll('td'))
        const y = matrix[i]
        for (let j = 0; j < matrix.length; j++) {
            if(!x[j].classList.contains("fal")){
                if(y[j]==0 || x[j].classList.contains("rossz")){
                    gameOver=false
                    continue
                }
            }               
        }
        if(!gameOver){
            continue
        }
    }
    if(gameOver && wallsOK){
        document.querySelector("#gameOver").hidden=false
        document.querySelector("."+map).removeEventListener("click",onClick)
        rowsArray.forEach(element => {
            element.removeEventListener("click",onClick)
        });
        newGameBtn.disabled=false
    }
    if(!wallsOK && gameOver){
        console.log("Rossz megoldás, ellenőrizd a falak körüli lámpák számát!")
    }
    inGame=!(gameOver&&wallsOK)
}
function render(matrix,rowsArray,onClick){
    let wallsOK = true
    for (let i = 0; i < matrix.length; i++) {
        const x = Array.from(rowsArray[i].querySelectorAll('td'))
        x.forEach(cell => {
            if(!cell.classList.contains("fal")){
                var classList = cell.classList;
                /*while (classList.length > 0) {
                    if(classList.item(0)!="fal"){
                        classList.remove(classList.item(0));
                    }
                }*/
                cell.classList.remove("feny") 
                cell.classList.remove("lamp")
                cell.classList.remove("rossz")
            }
            if(cell.classList.contains("zold")){
                cell.classList.remove("zold") 
            }
        });

        const mr = matrix[i]
        const tr = Array.from(rowsArray[i].querySelectorAll("td"))
        
        for (let j = 0; j < matrix.length; j++) {
            if(mr[j]>0){
                tr[j].classList.add("feny")
            }
            if(mr[j]<0){       
                tr[j].classList.add("lamp")
                let right=j+1
                while(right<matrix.length && !tr[right].classList.contains("fal") && mr[right]>0){
                    right++
                }
                if(right!=matrix.length && mr[right]<0){
                    tr[j].classList.add("rossz")
                    tr[right].classList.add("rossz")
                }
    
                let down = i+1
                let Tcol1
                if(down<matrix.length){
                    Tcol1 = Array.from(rowsArray[down].querySelectorAll("td"))
                }
                let Mcol1 = matrix[down]
                while(down<matrix.length && !Tcol1[j].classList.contains("fal") && Mcol1[j]>0){
                    down++
                    if(down<matrix.length && !Tcol1[j].classList.contains("fal") && Mcol1[j]>0){
                        Tcol1 = Array.from(rowsArray[down].querySelectorAll("td"))
                        Mcol1 = matrix[down]
                    }
                }
                if(down!=matrix.length && Mcol1[j]<0){
                    tr[j].classList.add("rossz")
                    Tcol1[j].classList.add("rossz")
                }
                let up = i-1
                let Tcol2
                if(up>=0){
                    Tcol2 = Array.from(rowsArray[up].querySelectorAll("td"))
                }
                let Mcol2 = matrix[up]
                while(up>=0 && !Tcol2[j].classList.contains("fal") && Mcol2[j]>0){
                    up--
                    if(up>=0 && !Tcol2[j].classList.contains("fal") && Mcol2[j]>0){
                        Tcol2 = Array.from(rowsArray[up].querySelectorAll("td"))
                        Mcol2 = matrix[up]
                    }
                }
                if(up>=0 && Mcol2[j]<0){
                    tr[j].classList.add("rossz")
                    Tcol2[j].classList.add("rossz")
                }
            }
            
            if(tr[j].classList.contains("fal")){
                let n = tr[j].textContent
                if (!n == ""){
                    n = parseInt(n,10)
                    let s = 0
                    const mrb = matrix[i-1]
                    const mra = matrix[i+1]
                    let up
                    let down 
                    let left 
                    let right 
                    if(i-1>=0){
                        up = mrb[j]
                        if(up<0){
                        s++ 
                        }
                    }
                    if(i+1<matrix.length){
                        down = mra[j]
                        if(down<0){
                            s++   
                        }
                    }
                    if(j-1>=0){
                        left = mr[j-1]
                        if(left<0){
                            s++
                        }
                    }
                    if(j+1<matrix.length){
                        right = mr[j+1]
                        if(right<0){
                        s++ 
                        }
                    }
                    if(n==s){
                        tr[j].classList.add("zold")
                    }
                    else{
                        wallsOK=false
                    }
                }
            }
        }
    }
    console.log(`wallsOK: ${wallsOK}`)
    gameOver(wallsOK,matrix,rowsArray,onClick)
}
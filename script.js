//global params
var gameRunning=false;
var gameContainer = document.querySelector('.game-container');
var clickedItemArr = [];
var currentPlayer=0;
var cssProperties = getComputedStyle(document.body);
var pOneColor = cssProperties.getPropertyValue('--playerOne-color');
var pTwoColor = cssProperties.getPropertyValue('--playerTwo-color');
var hover__color = cssProperties.getPropertyValue('--playerTwo-color');
var row__background = cssProperties.getPropertyValue('--row-bg-color');
var playerColors =[pOneColor,pTwoColor];
var rowIndex;
var hasWon;

//setting shadows
document.documentElement.style.setProperty('--player-two-shadow', `0.4rem 0.1rem 0.6rem ${pTwoColor}`);
document.documentElement.style.setProperty('--player-one-shadow', `0.4rem 0.1rem 0.6rem ${pOneColor}`);

//fill cick array
function initArray(){
    for(i=0;i<7;i++){
        var arr = []
        for(j=0;j<6;j++){        
            arr.push(0);            
        }
        clickedItemArr.push(arr);
    };
}

// main

var  startButton = document.querySelector('.startTrigger');
startButton.addEventListener('click', ()=>{
    if(startButton.textContent == 'Play Again'){
        document.querySelectorAll('.row').forEach((item)=>item.style.background=row__background);
        clickedItemArr = [];
        currentPlayer=0;
        startButton.classList.remove('play-again');
    }
    starter();
});

async function starter(){
    startButton.classList.add('game-on');    
    startButton.textContent="Game is On!";
    removePlayerActiveClass(0);
    gameRunning=true;
    document.documentElement.style.setProperty('--column-hover-color','wheat');
    hasWon = [false,null,null];
    initArray();
}
// main


    
//var clickedCol, clickedColRow;
gameContainer.addEventListener('click',async (event)=>{
    if(!gameRunning) return;     
    
    clickedCol = event.target.parentNode.getAttribute('id');
    clickedColRow = event.target.getAttribute('id');
    const clicked = await checkColEmptyAndClick(clickedCol,currentPlayer);    
    if(clicked){
        await colorBlock(clickedCol, rowIndex+1);
        removePlayerActiveClass(1-currentPlayer);
        await chekcIfWon(currentPlayer+1, clickedCol-1, rowIndex);         
        currentPlayer=1- currentPlayer;        
    }    


    //if user has won finish the game
    if(hasWon[0]){
        startButton.classList.remove('game-on');
        startButton.textContent="Play Again";
        startButton.classList.add('play-again')
        document.documentElement.style.setProperty('--column-hover-color','inherit');
        gameRunning=false;
    }
    
});


//check if column is empty
async function checkColEmptyAndClick(col,player){
    
    if(clickedItemArr[col-1].includes(0)){
        rowIndex = clickedItemArr[col-1].lastIndexOf(0);        
        clickedItemArr[col-1][rowIndex]=1+player;         
        return true;
    }      
    return false;    
}


//color a block
async function colorBlock(col, row){    
    var item = document.querySelector(`.game-container #${CSS.escape(col)} #${CSS.escape(row)}`);
    item.style.background = playerColors[currentPlayer];
}

//chekc if current player has won
async function chekcIfWon(player, colIndex, rowIndex){
    console.log("current player:" + player, colIndex, rowIndex);    
    let steps =[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,-0],[-1,-1]]
    
    ttop = { colIndex:colIndex, rowIndex:rowIndex-1};
    ttopNext = { colIndex: ttop.colIndex+1, rowIndex:ttop.rowIndex};

    right = { colIndex:colIndex+1, rowIndex:rowIndex};
    rightNext = { colIndex:right.colIndex, rowIndex:right.rowIndex+1};

    bottom = { colIndex:colIndex, rowIndex:rowIndex+1};
    bottomNext = { colIndex: bottom.colIndex-1, rowIndex:bottom.rowIndex};

    left = { colIndex:colIndex-1, rowIndex:rowIndex};
    leftNext = { colIndex:left.colIndex , rowIndex: left.rowIndex-1};

    var blocksArr =[ttop,ttopNext, right,rightNext, bottom,bottomNext,left,leftNext];

    //iterate over all blocks
    blocksArr.forEach(item => {
        if(item.colIndex>=0 &&item.rowIndex>=0){
            //console.log(item.colIndex, item.rowIndex);            
        }        
    });
    console.log('from the steps array');

    steps.forEach((item,index) => {
        // console.log(clickedItemArr[colIndex+item[0]][rowIndex+item[1]]);
        if(checkIndexExists2D(colIndex+item[0],rowIndex+item[1])){
            //console.log(colIndex+item[0],rowIndex+item[1]); 
            console.log(`player:${player}, direction:${index}`);    
            console.log(calc4Blocks(colIndex,rowIndex,index,player));

            var playerStreak = calc4Blocks(colIndex,rowIndex,index,player);
            if(playerStreak == 4){
                hasWon = [true, player, null]
                //alert(`Player ${hasWon[1]} has won the game`)
                openModal(hasWon[1]);
            }
        }
    });

}

function checkIndexExists2D(col,row){
    try {
        if (clickedItemArr.hasOwnProperty(col)) {
            if (clickedItemArr[col].hasOwnProperty(row)) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
}


function calc4Blocks(col,row,index,player){
    let steps = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,-0],[-1,-1]];
    let streakLength=0;
    if(clickedItemArr[col][row]==player)streakLength++;
        for (let i = 0; i < 3; i++) {
            if(checkIndexExists2D(col+steps[index][0],row+steps[index][1])){     

                if(clickedItemArr[col+steps[index][0]][row+steps[index][1]]==player){
                    streakLength++;
                }
                else{
                    return streakLength;
                }
            }
            col=col+steps[index][0];
            row=row+steps[index][1];
        }        
    return streakLength;
}

function writeIndexes(){
    for(i=0;i<7;i++){
        for(j=0;j<6;j++){        
            let element = document.querySelector(`.game-container #${CSS.escape(i+1)} #${CSS.escape(j+1)}`);  
            element.textContent=`col:${i}, row:${j}`;
        }
    };
    
}

//toggle active status on player list
function removePlayerActiveClass(player){
    let playersHighlight = document.querySelectorAll('.player');
    playersHighlight.forEach(element => {
        element.classList.remove('active');
    });

    playersHighlight[player].classList.add('active');
}


//Modal class functions
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var modal_text = document.querySelector('#modal-text');

// When the user clicks on the button, open the modal
function openModal(player) {
  modal.style.display = "block";
    modal_text.innerHTML = `<b>Player ${player}</b> won the game!!!`
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//bootstrap modal call
function callModal(){
    $('#myModal').modal('show');
  }


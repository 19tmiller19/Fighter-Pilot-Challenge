

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//game control variables.
let controlPlayer = false;
let hasGameStarted = false;
// just to prevent game from starting while game reloads
let hasGameOver = false;

let startDate = null;

function milliSecondsToMinutes(millis){
    let minutes = math.floor(millis / 6000);
    let seconds =((millis % 60000)/1000).toFixed(0);
    return minutes +":"+ (seconds < 10 ? "0" :"") + seconds;
}

function gameOver() {
    if(!hasGameOver){
        let endDate = new Date();
        let timeDiff = endDate - startDate;
        if(timeDiff < 6000){
            alert(`You survived ${timeDiff / 1000} seconds!`);
            
        }else{
            let minutesSurvived = milliSecondsToMinutes(timeDiff)
            alert(`You survived ${minutesSurvived} minutes. wow`);
        }

        hasGameOver = true;
        location.reload();
    }
}

//canvas black boarder.
function drawBoarder() {
    ctx.fillStyle ='orange';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.clearRect(50,50,500,500);
}


let playerRect = {
    x:275,
    y:275,
    width:50,
    height: 50

}
//game Rectangle.

let rectangles = [{
    x:75,
    y:75,
    dx:5,
    dy:4,
    width:75,
    height:75,
    color: 'green',
},
{
    x: 400,
    y: 75,
    dx: -5,
    dy: 5.5,
    width: 80,
    height: 60,
    color: 'green',
},
{
    x:75,
    y:445,
    dx:5,
    dy: -5,
    width: 40,
    height:80,
    color:'green'
},
{
    x:420,
    y:450,
    dx:-5,
    dy:-5,
    width:130,
    height:25,
    color:'green'
}]
   
// render rectangles to canvas.
function drawRect() {
    //Draw player rect first.
    ctx.fillStyle = "red";
    ctx.fillRect(playerRect.x,playerRect.y,playerRect.width,playerRect.height);
    rectangles.forEach(rect => {
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x,rect.y,rect.width,rect.height);
    })
}

//detect whether player makes contact with boarder
function playerCollisionDetection() {
    if(
        playerRect.x + playerRect.width > 550 ||
        playerRect.x < 50 ||
        playerRect.y + playerRect.height > 550 ||
        playerRect.y < 50
    ){
        gameOver();
    }
}
//returns true if 2 rectangles collide
function isRectangleCollision(rect1, rect2){
    return !(
        rect1.x > rect2.x +rect2.width ||
        rect1.x + rect1.width< rect2.x ||
        rect1.y > rect2.y + rect2.height ||
        rect1.y + rect1.height < rect2.y 
    );
}

//detect whether player makes contact with rectangle
function rectangleCollisionDetection(){
    rectangles.forEach(rect =>{
        if(isRectangleCollision(playerRect, rect)){
            gameOver();
        }
    })
}
//get the green rectangles to start moving
function moveRectangle(){
    rectangles.forEach(rect=>{
        rect.x += rect.dx;
        rect.y += rect.dy;
    })
}
//detect whether green rectangle hit canvas
function borderRectangleCollisionDetection(){
    rectangles.forEach(rect =>{
        if(rect.x + rect.width > canvas.width || rect.x <0){
            rect.dx *= -1;
        }
        if(rect.y + rect.height > canvas.height || rect.y < 0){
            rect.dy *= -1;
        }
    })
}
//speed up game
let numberOfSpeed = 0;
function configureRectSpeed(){
    const speedUpGame = setInterval(() => {
        numberOfSpeed++;
        rectangles.forEach(rect => {
            rect.dx >= 0 ? rect.dx +=1 : rect.dx -= 1;
            rect.dy >= o ? rect.dy +=1 : rect.dy -= 1;
        });
        if(numberOfSpeed === 4){
            clearInterval(speedUpGame);
        }
    },10000)
}
function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBoarder();
    drawRect();

    if(hasGameStarted){
        //get rectangle to start moving
        moveRectangle();
    }

    //detect whether player makes contact with boarder
    playerCollisionDetection();
    //detect whether player makes contact with rectangle
    rectangleCollisionDetection();
    //detect whether green rectangle hit canvas
    borderRectangleCollisionDetection();

    requestAnimationFrame(update);
}
// call update on initial document load.
update();

// returns true if mouse is in rectangle

function isCursorInRect(x,y,rect){
    return(x>rect.x && x<rect.x+rect.width && y>rect.y && y<rect.y+rect.height);
}

canvas.addEventListener("mousedown", e=>{
    //get x and y coordinated in relation to canvas
    const pos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
    //see if they clicked on red square in particular
    if(isCursorInRect(pos.x,pos.y,playerRect)){
        //start timer
        if(!hasGameStarted){
            startDate = new Date();
            configureRectSpeed();
        }
        hasGameStarted = true;
        controlPlayer = true;
    }
})

canvas.addEventListener("mousemove", e => {
    if(controlPlayer && !hasGameOver){
    //get x and y coordinated in relation to canvas
    const pos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop

    };
    playerRect.x = pos.x - 25;
    playerRect.y = pos.y - 25;
}
})

canvas.addEventListener("mouseup", ()=>{
    controlPlayer = false;
})
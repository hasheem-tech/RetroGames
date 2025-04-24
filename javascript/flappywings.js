//variables for board
let board;
let boardWidth = 800;
let boardHeight = 550;
let context;

// variables for bird
let birdWidth = 50;
let birdHeight = 40;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdimg;
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

// variables for trees
let treeArray = [];
let treeWidth = 140;
let treeHeight = 550;
let treeX = boardWidth;
let treeY = 0;

let topTreeImg;
let bottomTreeImg;

// variables for game physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.3;
let gameOver = false;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used to drawing on board

    // draw flappy bird
    //context.fillStyle = "red";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image
    birdimg = new Image();
    birdimg.src = "images/bird.png";
    birdimg.onload = function(){
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }

    topTreeImg = new Image();
    topTreeImg.src = "images/top-tree.png";

    bottomTreeImg = new Image();
    bottomTreeImg.src = "images/bottom-tree.png";
   
   
    if (gameOver == false){
    requestAnimationFrame(update);
    
    setInterval(placeTrees, 1500);
    }

    document.addEventListener("keydown", moveBird);
}
function update(){
    if (gameOver == false){
    requestAnimationFrame(update);
    }
    context.clearRect(0, 0, boardWidth, boardHeight);

    // bird
    velocityY += gravity;
    bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);    
 
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y + bird.height > board.height) {
        gameOver = true;
    }
    //trees

    for (let i=0; i < treeArray.length; i++){ 
        let tree = treeArray[i];
        tree.x += velocityX;
        context.drawImage(tree.img, tree.x, tree.y, tree.width, tree.height);
        if (detectCollision(bird, tree)){
            gameOver = true;
        }
    }
    
    
}

function placeTrees(){
    let randomTreeY = treeY - treeHeight/ 3 - Math.random()*(treeHeight/2);
    let openingSpace = board.height / 4;
    let topTree = {
        img : topTreeImg,
        x : treeX,
        y : randomTreeY,
        width : treeWidth,
        height : treeHeight,
        passed : false
    }
    treeArray.push(topTree);

    let bottomTree = {
        img : bottomTreeImg,
        x : treeX,
        y : randomTreeY + treeHeight + openingSpace,
        width : treeWidth,
        height : treeHeight,
        passed : false
    }
    treeArray.push(bottomTree);
}

function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp"){
        e.preventDefault();
        velocityY = -4;
        console.log(e.code);
    }
}

function detectCollision(bird, tree) {
    // Shrink the bird's hitbox
    let birdHitbox = {
        x: bird.x + 30,
        y: bird.y + 20,
        width: bird.width - 40,
        height: bird.height - 20
    };
    // Shrink the tree's hitbox
    let treeHitbox = {
        x: tree.x + 30,
        y: tree.y + 20,
        width: tree.width - 40,
        height: tree.height - 40
    };
    return birdHitbox.x < treeHitbox.x + treeHitbox.width &&
           birdHitbox.x + birdHitbox.width > treeHitbox.x &&
           birdHitbox.y < treeHitbox.y + treeHitbox.height &&
           birdHitbox.y + birdHitbox.height > treeHitbox.y;
}




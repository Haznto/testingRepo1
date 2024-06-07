const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let tileSize; // Dynamically calculated tile size

// Load images
const wallImg = new Image();
const pathImg = new Image();
const playerImg = new Image();
const keyImg = new Image();

wallImg.src = 'wall.png';
pathImg.src = 'wood.png';
playerImg.src = 'playerDown.png';
keyImg.src = 'GoldenKey.png';

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.Image = new Image();
        this.Image.src = 'playerDown.png';
        this.down = true;
        this.up = false;
        this.left = false;
        this.right = false;
        this.currentQuarter = 0;
        this.quarterWidth = this.Image.width / 4;
        this.quarterHeight = this.Image.height;
    
    }
    // @TO DO: Handle the drawing and image rendering depends on the charachter side, the image src should be changed to the correct side
    drawPlayer() {
        ctx.drawImage(
            this.Image,
            this.quarterWidth * this.currentQuarter,
            0, // source x and y
            this.quarterWidth,
            this.quarterHeight, // source width and height
            this.x * tileSize,
            this.y * tileSize,  
            tileSize,
            tileSize
        );
    }
}

let imagesLoaded = 0;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        calculateTileSize();
        showStartScreen();
    }
}

wallImg.onload = checkImagesLoaded;
pathImg.onload = checkImagesLoaded;
playerImg.onload = checkImagesLoaded;
keyImg.onload = checkImagesLoaded;

// Load sound effects
const keyCollectSound = new Audio('key-collect.mp3');
const levelCompleteSound = new Audio('level-complete.mp3');

// Game state
let player = new Player(1, 1); // Player position
let key = { x: 5, y: 5 }; // Key position
let level = 1;
let collectedCharacters = []; // Store collected characters

// Mazes for each level
const mazes = [
    // Level 1
    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],
    // Level 2
    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],
    // Level 3
    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],
    // Level 4
    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],
    // Level 5
    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ],
    // Level 6
    [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ]
];

const keys = [
    { x: 5, y: 5 },
    { x: 5, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 5 },
    { x: 3, y: 5 },
    { x: 5, y: 5 }
];

const fianceeName = "SOPHIA"; // Replace this with the actual name



function calculateTileSize() {
    const rows = mazes[0].length;
    const cols = mazes[0][0].length;
    tileSize = Math.min(canvas.width / cols, canvas.height / rows);
}

function drawMaze(maze) {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) {
                ctx.drawImage(wallImg, x * tileSize, y * tileSize, tileSize, tileSize);
            } else {
                ctx.drawImage(pathImg, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}



function drawKey() {
    ctx.drawImage(keyImg, key.x * tileSize, key.y * tileSize, tileSize, tileSize);
}


// @TODO: Implement smooth handling for the levels. 

// function gameLoop() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawMaze(mazes[level - 1]);
//     player.drawPlayer();
//     drawKey();
// }

// function animateKeyTransformation() {
//     keyCollectSound.play(); // Play key collection sound
//     let frame = 0;
//     const interval = setInterval(() => {
//         ctx.clearRect(key.x * tileSize, key.y * tileSize, tileSize, tileSize);
//         ctx.fillStyle = `rgba(255, 215, 0, ${1 - frame / 10})`;
//         ctx.fillRect(key.x * tileSize, key.y * tileSize, tileSize, tileSize);

//         if (frame === 10) {
//             clearInterval(interval);
//             drawCharacterAnimation(fianceeName[level - 1]);
//         }

//         frame++;
//     }, 50);
// }

// function drawCharacterAnimation(character) {
//     let frame = 0;
//     const interval = setInterval(() => {
//         ctx.clearRect(key.x * tileSize, key.y * tileSize, tileSize, tileSize);
//         ctx.font = `${30 + frame}px Arial`;
//         ctx.fillStyle = `rgba(255, 0, 0, ${1 - frame / 20})`;
//         ctx.fillText(character, key.x * tileSize + 10 - frame / 2, key.y * tileSize + 30 + frame / 2);

//         if (frame === 20) {
//             clearInterval(interval);
//             collectedCharacters.push(character);
//             drawCharacter(character);
//             levelCompleteSound.play(); // Play level completion sound
//             level++;
//             if (level <= mazes.length) {
//                 player = { x: 1, y: 1 };
//                 key = keys[level - 1];
//                 showLevelTransition();
//             } else {
//                 showFinalScreen();
//             }
//         }

//         frame++;
//     }, 50);
// }

// function drawCharacter(character) {
//     ctx.font = '30px Arial';
//     ctx.fillStyle = 'red';
//     ctx.fillText(character, key.x * tileSize + 10, key.y * tileSize + 30);
// }

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (mazes[level - 1][newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
    }

    if (player.x === key.x && player.y === key.y) {
        animateKeyTransformation();
    }
}

function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to the Maze Game!', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Arial';
    ctx.fillText('Press Enter to Start', canvas.width / 2, canvas.height / 2);
}

function showLevelTransition() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${level}`, canvas.width / 2, canvas.height / 2 - 50);
    setTimeout(gameLoop, 2000); // Show transition for 2 seconds before starting the next level
}

function showFinalScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText('You have collected all the keys!', canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText(`Will you marry me, ${fianceeName}?`, canvas.width / 2, canvas.height / 2);
    ctx.font = '60px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(collectedCharacters.join(''), canvas.width / 2, canvas.height / 2 + 100);
}
start= false

// @TODO: Implement player movement here note: if the player was moving on oither direction his direction should be chandes and the quarter will be set to zero
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'Enter':
            if (level === 1 && player.x === 1 && player.y === 1) {
                start= true
            }
            break;
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            if (player.down) {
                if (player.currentQuarter === 3){
                    player.currentQuarter =0;
                }
                else{
                    player.currentQuarter +=1;
                }
            }
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// // Recalculate tile size and redraw when the window is resized
// window.addEventListener('resize', () => {
//     calculateTileSize();
//     if (level === 1 && player.x === 1 && player.y === 1) {
//         showStartScreen();
//     } else {
//         gameLoop();
//     }
// });




function animate() {
    if (!start) {
        showStartScreen()        
    }
    else{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze(mazes[level - 1]);
        player.drawPlayer();
        drawKey();
    }
    requestAnimationFrame(animate);
}

animate();
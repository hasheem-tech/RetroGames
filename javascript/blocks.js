// Access the canvas
const canvas = document.getElementById('board');
const context = canvas.getContext('2d');

// Scale up the drawing so blocks are bigger
context.scale(20, 20);

// Draw the grid
visualGrid(12, 20);
const board = logicalGrid(12, 20);

// Define tetromino shapes (Tetris blocks)
const T = { matrix: [[1, 1, 1], [0, 1, 0]], name: 'T' };
const I = { matrix: [[1], [1], [1], [1]], name: 'I' };
const O = { matrix: [[1, 1], [1, 1]], name: 'O' };
const L = { matrix: [[0, 0, 1], [1, 1, 1]], name: 'L' };

// Color tetromino shapes
const colors = {
    T: '#f0f',
    I: '#0ff',
    O: '#ff0',
    L: '#f90'
};

// Define a player object
const player = {
    pos: { x: 5, y: 0 },
    matrix: null,
    name: null,
};

// Draw the Tetromino on Canvas
newPlayer();
drawMatrix(player.matrix, player.pos);

// Move tetromino down every second (1000ms)
setInterval(drop, 1000);

// Listen for keydown events to move the tetromino
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        move(-1, 0);    // Move left
    }
    else if (event.key === 'ArrowRight') {
        move(1, 0);     // Move right
    }
    else if (event.key === 'ArrowDown') {
        drop();         // Move down
    }
});

// Functions

// Draws the visual grid
function visualGrid(width, height) {
    context.strokeStyle = '#333';
    context.lineWidth = 0.05;
    // Vertical lines
    for (let x = 0; x <= width; x++) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }
    // Horizontal lines
    for (let y = 0; y <= height; y++) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }
}

// Creates the logical grid for the game board
function logicalGrid(width, height) {
    const board = [];
    while (height--) {
        board.push(new Array(width).fill(0));
    }
    return board;
}

// Draws the tetromino on the canvas
function drawMatrix(matrix, offset) {
    context.fillStyle = colors[player.name];  // Use the correct color
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] !== 0) {
                context.fillRect(col + offset.x, row + offset.y, 1, 1);
            }
        }
    }
}

// Draws the entire game board on the canvas
function drawBoard(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cell = board[row][col];
            if (cell !== 0) {
                context.fillStyle = cell;
                context.fillRect(col, row, 1, 1);
            }
        }
    }
}

// Clears the grid and redraws the grid and tetromino
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    visualGrid(12, 20);
    drawBoard(board);
    drawMatrix(player.matrix, player.pos);
}

// Checks for collision (out-of-bounds or filled cells)
function collide(board, matrix, offset) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] !== 0) {
                const boardY = row + offset.y;
                const boardX = col + offset.x;

                // Check out-of-bounds or occupied cell
                if (
                    boardY >= board.length ||          // hits bottom
                    boardX < 0 ||                      // hits left wall
                    boardX >= board[0].length ||       // hits right wall
                    board[boardY][boardX] !== 0        // hits filled block
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Moves the tetromino
function move(x, y) {
    player.pos.x += x;
    player.pos.y += y;
    if (collide(board, player.matrix, player.pos)) {
        player.pos.x -= x;
        player.pos.y -= y;
    }
    draw();
}

// Locks the tetromino on the board
function lock(board, matrix, offset) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] !== 0) {
                board[row + offset.y][col + offset.x] = colors[player.name];
            }
        }
    }
}

// Drops the tetromino one step down
function drop() {
    player.pos.y++;
    if (collide(board, player.matrix, player.pos)) {
        player.pos.y--;
        lock(board, player.matrix, player.pos);
        newPlayer();
    }
    draw();
}

// Creates a new tetromino and places it at the top of the board
function newPlayer() {
    const tetrominos = [T, I, O, L];
    const random = tetrominos[Math.floor(Math.random() * tetrominos.length)];
    player.matrix = random.matrix;
    player.name = random.name;
    player.pos.y = 0;
    const maxX = 12 - random.matrix[0].length;
    player.pos.x = Math.floor(Math.random() * maxX) + 1;
    if (collide(board, player.matrix, player.pos)) {
        console.log("Game Over!");
    }
}

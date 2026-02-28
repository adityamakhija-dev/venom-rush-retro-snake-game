const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');

const gridSize = 20;
const tileSize = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0; // x-direction movement
let dy = 0; // y-direction movement
let score = 0;
let gameInterval;
let isPlaying = false;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function update() {
    if (!isPlaying) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        gameOver();
        return;
    }

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head); // Add new head

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    draw();
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_ARROW = 37;
    const UP_ARROW = 38;
    const RIGHT_ARROW = 39;
    const DOWN_ARROW = 40;

    if (keyPressed === LEFT_ARROW && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === UP_ARROW && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === RIGHT_ARROW && dx === 0) {
        dx = 1;
        dy = 0;
    } else if (keyPressed === DOWN_ARROW && dy === 0) {
        dx = 0;
        dy = 1;
    }
}

function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    snake = [{ x: 10, y: 10 }];
    dx = 1; // Start moving right
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    generateFood();
    clearInterval(gameInterval); // Clear any existing interval
    gameInterval = setInterval(update, 100); // Game loop
    draw();
}

function gameOver() {
    isPlaying = false;
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
}

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);

// Initial setup
draw();
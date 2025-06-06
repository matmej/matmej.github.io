document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    const box = 20; // Size of each grid box
    let snake = [];
    let food = {};
    let direction = null;
    let nextDirection = null;
    let gameInterval;
    let score = 0;
    let gameSpeed = 200; // milliseconds between updates
    
    // Initialize the game
    function initGame() {
        snake = [
            {x: 9 * box, y: 10 * box},
            {x: 8 * box, y: 10 * box},
            {x: 7 * box, y: 10 * box}
        ];
        generateFood();
        direction = 'RIGHT';
        nextDirection = 'RIGHT';
        score = 0;
        scoreElement.textContent = score;
    }
  
    
    // Generate food at random position
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
        
        // Make sure food doesn't appear on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                return generateFood();
            }
        }
    }
    
    // Draw the game state
   
function draw() {
    // Clear the canvas
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines 
    ctx.strokeStyle = '#81868a';  // Light gray color for grid
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += box) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += box) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

        
        // Draw snake
        for (let segment of snake) {
            ctx.fillStyle = '#5a1d8c';
            ctx.fillRect(segment.x, segment.y, box, box);
            ctx.strokeStyle = '#ecf0f1';
            ctx.strokeRect(segment.x, segment.y, box, box);
        }
        
        // Draw head differently
        ctx.fillStyle = '#8d3bd1';
        ctx.fillRect(snake[0].x, snake[0].y, box, box);
        
        // Draw food
        ctx.fillStyle = '#c21919';
        ctx.fillRect(food.x, food.y, box, box);
    }
    
    // Update game state
    function update() {
        // Update direction
        direction = nextDirection;
        
        // Calculate new head position
        let head = {x: snake[0].x, y: snake[0].y};
        
        switch (direction) {
            case 'UP':
                head.y -= box;
                break;
            case 'DOWN':
                head.y += box;
                break;
            case 'LEFT':
                head.x -= box;
                break;
            case 'RIGHT':
                head.x += box;
                break;
        }
        
        // Check for collisions
        if (
            head.x < 0 || head.x >= canvas.width ||
            head.y < 0 || head.y >= canvas.height ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            
            // Increase speed slightly every 5 points
            if (score % 5 === 0 && gameSpeed > 50) {
                gameSpeed -= 5;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
            
            generateFood();
        } else {
            // Remove tail if no food was eaten
            snake.pop();
        }
    }
    
    // Main game loop
    function gameLoop() {
        update();
        draw();
    }
    
    // Game over function
    function gameOver() {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
    }
    
    // Start the game
    function startGame() {
        clearInterval(gameInterval);
        initGame();
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', startGame);
    
    document.addEventListener('keydown', (e) => {
        // Prevent reverse direction
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction !== 'DOWN') nextDirection = 'UP';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'UP') nextDirection = 'DOWN';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'RIGHT') nextDirection = 'LEFT';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'LEFT') nextDirection = 'RIGHT';
                break;
        }
    });
    
    // Initialize (but don't start) the game
    initGame();
    draw();
});
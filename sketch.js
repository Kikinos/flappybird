let bird;
let pipes = [];
let birdImg;
let bgImg; // Add a variable for the background image
let gameOver = false;
let gameStarted = false;
let score = 0;
let restartButton;
let level = 1;

function setup() {
    createCanvas(1000, 900); // Changed width to 900
    bird = new Bird();
    pipes.push(new Pipe()); // Spawn the initial pipe immediately
}

function preload() {
    birdImg = loadImage('./img/ptacek.png');
    bgImg = loadImage('./img/pozadi.png'); // Load the background image
}

function draw() {
    image(bgImg, 0, 0, width, height); // Draw the background image to fit the canvas

    if (!gameStarted) {
        textSize(32);
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        text("Press SPACE to Start", width / 2, height / 2);
        return;
    }

    if (gameOver) {
        fill(0 , 0, 0); // Change text color to red
        textAlign(CENTER, CENTER);
        fill(0, 0, 0); // Change text color to red
        textSize(64);
        text("Game Over!", width / 2, height / 2);
        textSize(32);
        text("Score: " + score, width / 2, height / 2 + 40);
        text("Level: " + level, width / 2, height / 2 + 80);
        text("Press SPACE to Restart", width / 2, height / 2 + 120);
        return;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();

        if (pipes[i].hits(bird)) {
            gameOver = true;
        }

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            score++;
            if (score % 5 === 0) {
                level++;
            }
        }
    }

    bird.update();
    bird.show();

    if (bird.y >= height || bird.y <= 0) {
        gameOver = true;
    }

    if (gameStarted && frameCount % (60 * 1.5) == 0) { // 60 frames per second * 1.5 seconds
        pipes.push(new Pipe());
    }

    textSize(32);
    fill(255);
    text("Score: " + score, 75, 30); // Ensure score is within canvas
    text("Level: " + level, 75, 60); // Display level
}

function keyPressed() {
    if (key == ' ' && !gameStarted) {
        gameStarted = true;
    } else if (key == ' ' && gameOver) {
        restartGame();
    } else if (key == ' ' && !gameOver) {
        bird.up();
    }
}

function restartGame() {
    gameOver = false;
    gameStarted = false;
    score = 0;
    level = 1;
    pipes = [];
    bird = new Bird();
    pipes.push(new Pipe());
    restartButton.hide();
}

class Bird {
    constructor() {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 1;
        this.lift = -25;
        this.velocity = 0;
    }

    show() {
        image(birdImg, this.x, this.y, 64, 64); // Increased size to 64x64
    }

    up() {
        this.velocity += this.lift;
    }

    update() {
        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
}

class Pipe {
    constructor() {
        this.spacing = 175 - level * 5; // Decrease spacing with level
        this.top = random(height / 6, (3 / 4) * height);
        this.bottom = height - (this.top + this.spacing);
        this.x = width;
        this.w = 40; // Increased width to 40
        this.speed = 6 + level * 0.5; // Increase speed with level
    }

    hits(bird) {
        let birdWidth = 48;
        let birdHeight = 48;
        let hitboxPadding = 5; // Reduce hitbox size by 5 pixels on each side
        if (bird.x + birdWidth - hitboxPadding > this.x && bird.x + hitboxPadding < this.x + this.w) {
            if (bird.y + hitboxPadding < this.top || bird.y + birdHeight - hitboxPadding > height - this.bottom) {
                return true;
            }
        }
        return false;
    }

    show() {
        fill(0, 255, 0);
        rect(this.x, 0, this.w, this.top);
        rect(this.x, height - this.bottom, this.w, this.bottom);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x < -this.w;
    }
}

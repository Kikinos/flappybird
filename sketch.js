let bird; // prommena bird
let pipes = []; //pole pro trubky
let birdImg; //obrazzek ptaka
let bgImg; //obrazek pozadi
let pipeImg;
let gameOver = false; //promenna pro konec hry
let gameStarted = false; //promenna pro zacatek hry
let score = 0;  //promenna pro skore
let highScore = 0; // promenna pro nejvyssi skore
let level = 1; //promenna pro uroven

function setup() { //funkce setup
    createCanvas(1000, 900); //vytvoreni hraci plochy
    bird = new Bird(); //vytvoreni ptaka
}

function preload() { //funkce preload - nacteni obrazku
    birdImg = loadImage('./img/ptacek.png'); //nacteni obrazku ptaka
    bgImg = loadImage('./img/pozadi.png'); //nacteni obrazku pozadi
    pipeImg = loadImage('./img/Prekazka.png'); //nacteni obrazku trubky
}

function draw() {
    image(bgImg, 0, 0, width, height); //vykresli obrazek pozadi

    if (!gameStarted) { // Pokud hra nezacala - vypise text a ceka na stisknuti mezerniku
        fill(0, 0, 0, 150); // semi-transparent black overlay
        rect(0, 0, width, height); // draw overlay
        textSize(32); 
        fill(255);
        textAlign(CENTER, CENTER);
        text("Press SPACE to Start", width / 2, height / 2); //zmacknout mezernik pro start - uprostred obrazovky
        return;
    }

    if (gameOver) { //pokud hra skoncila - vypise text a ceka na stisknuti mezerniku
        fill(0, 0, 0, 150); // semi-transparent black overlay
        rect(0, 0, width, height); // draw overlay
        textAlign(CENTER, CENTER);
        fill(255, 0, 0);
        textSize(64);
        text("Game Over!", width / 2, height / 2 - 40); //hra skoncila
        textSize(32);
        fill(255);
        text("Score: " + score, width / 2, height / 2 + 20); //skore - 
        text("High Score: " + highScore, width / 2, height / 2 + 60); //nejvyssi skore
        text("Level: " + level, width / 2, height / 2 + 100); //dosazena uroven
        text("Press SPACE to Restart", width / 2, height / 2 + 140); //zmacknout mezernik pro restart
        return;
    }

    for (let i = pipes.length - 1; i >= 0; i--) { //cyklus pro trubky - 
        pipes[i].show(); //zobrazi trubky
        pipes[i].update(); //aktualizuje trubky

        if (pipes[i].hits(bird)) { //pokud ptak narazi do trubky - hra skoncila
            gameOver = true; // Game over
            if (score > highScore) { //pokud skore je vetsi nez highscore - aktualizuje highscore
                highScore = score;
            }
        }

        if (pipes[i].offscreen()) { //pokud je trubka mimo obrazovku
            pipes.splice(i, 1); //smaze se
            score++; //prida se skore
            if (score % 5 === 0) { //pokud je skore nasobek 5 - uroven se zvysi
                level++; //zvysi se uroven
            }
        }
    }

    bird.update(); //aktualizuje ptaka
    bird.show(); //zobrazi ptaka

    if (bird.y >= height || bird.y <= 0) {
        gameOver = true;
        if (score > highScore) { //pokud skore je vetsi nez highscore - aktualizuje highscore
            highScore = score; //aktualizuje highscore
        }
    }

    if (frameCount % 90 == 0) { //pokud zacala hra a snimky jsou delitelne 90
        pipes.push(new Pipe()); //prida se nova trubka
    }

    textSize(32);
    fill(255);
    text("Score: " + score, 75, 30); //vypise skore
    text("High Score: " + highScore, 115, 60); // vypise nejvyssi skore
    text("Level: " + level, 75, 90); //vypise uroven
}

function keyPressed() {
    if (key == ' ' && !gameStarted) { //pokud zmackneme mezernik a hra nezacala
        gameStarted = true; //hra zacne
    } else if (key == ' ' && gameOver){ //pokud zmackneme mezernik a hra skoncila
        restartGame();
    } else if (key == ' ' && !gameOver) { //pokud zmackneme mezernik a hra nekoncila
        bird.up(); //ptak vyleti nahoru
    }
}

function restartGame() {
    gameOver = false; //hra neskoncila
    gameStarted = true; //hra zacne
    score = 0; //skore se vynuluje
    level = 1; //uroven se vynuluje 
    pipes = []; //pole pro trubky se vynuluje
    bird = new Bird(); //vytvori se novy ptak
    pipes.push(new Pipe()); //prida se nova trubka
}

class Bird { //trida Bird
    constructor() { //konstruktor
        this.y = height / 2; //vyska ptaka
        this.x = 64; //sirka ptaka
        this.gravity = 1; //gravitace
        this.lift = -25; //zvednuti
        this.velocity = 0; //zrychleni
    }

    show() { 
        image(birdImg, this.x, this.y, 64, 64); //zobrazi ptaka
    }

    up() {
        this.velocity += this.lift; // zvedne ptaka
    }

    update() {
        this.velocity += this.gravity; //zrychleni ptaka
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
        this.spacing = 175 - level * 5;
        this.top = random(height / 6, (3 / 4) * height);
        this.bottom = height - (this.top + this.spacing);
        this.x = width;
        this.w = 60;
        this.speed = 6 + level * 0.5;
    }

    hits(bird) {
        let birdWidth = 48;
        let birdHeight = 48;
        let hitboxPadding = 5;
        if (bird.x + birdWidth - hitboxPadding > this.x && bird.x + hitboxPadding < this.x + this.w) {
            if (bird.y + hitboxPadding < this.top || bird.y + birdHeight - hitboxPadding > height - this.bottom) {
                return true;
            }
        }
        return false;
    }

    show() {
        image(pipeImg, this.x, 0, this.w, this.top, 0, 0, pipeImg.width, pipeImg.height);
        image(pipeImg, this.x, height - this.bottom, this.w, this.bottom, 0, 0, pipeImg.width, pipeImg.height);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x < -this.w;
    }
}

        return this.x < -this.w;
    }
}

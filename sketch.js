let bird; // proměnná pro objekt ptáka
let pipes = []; // pole pro uložení trubek
let birdImg; // obrázek ptáka
let bgImg; // obrázek pozadí
let pipeImg; // obrázek trubek
let gameOver = false; // proměnná označující konec hry
let gameStarted = false; // proměnná označující, zda hra začala
let score = 0; // proměnná pro aktuální skóre
let highScore = 0; // proměnná pro nejvyšší dosažené skóre
let level = 1; // proměnná pro aktuální úroveň hry

function setup() {
    createCanvas(900, 650); // vytvoření plátna o rozměrech 900x650 pixelů
    bird = new Bird(); // vytvoření nového objektu ptáka
    pipes.push(new Pipe()); // přidání první trubky do pole trubek
}

function preload() { // funkce pro načtení zdrojů před spuštěním hry
    birdImg = loadImage('./img/ptacek.png'); // načtení obrázku ptáka
    bgImg = loadImage('./img/pozadi.png'); // načtení obrázku pozadí
    pipeImg = loadImage('./img/Prekazka.png'); // načtení obrázku trubky
}

function draw() { // hlavní funkce vykreslování
    image(bgImg, 0, 0, width, height); // vykreslení obrázku pozadí

    if (!gameStarted) { // kontrola, zda hra ještě nezačala
        fill(0, 0, 0, 150); // poloprůhledné černé překrytí
        rect(0, 0, width, height); // vykreslení překrytí
        textSize(32); 
        fill(255); // bílá barva textu
        textAlign(CENTER, CENTER); 
        text("Press SPACE to Start", width / 2, height / 2); // výzva k zahájení hry
        return; // ukončení funkce, pokud hra nezačala
    }

    if (gameOver) { // kontrola, zda hra skončila
        fill(0, 0, 0, 150); // poloprůhledné černé překrytí
        rect(0, 0, width, height); // vykreslení překrytí
        textAlign(CENTER, CENTER);
        fill(255, 0, 0); // červená barva textu
        textSize(64); // velikost textu
        text("Game Over!", width / 2, height / 2 - 40); // text "Game Over"
        textSize(32); 
        fill(255); // bílá barva textu
        text("Score: " + score, width / 2, height / 2 + 20); // zobrazení skóre
        text("High Score: " + highScore, width / 2, height / 2 + 60); // zobrazení nejvyššího skóre
        text("Level: " + level, width / 2, height / 2 + 100); // zobrazení aktuální úrovně
        text("Press SPACE to Restart", width / 2, height / 2 + 140); // výzva k restartu
        return; // ukončení funkce, pokud hra skončila
    }

    for (let i = pipes.length - 1; i >= 0; i--) { // cyklus přes pole trubek
        pipes[i].show(); // vykreslení trubek
        pipes[i].update(); // aktualizace pozice trubek

        if (pipes[i].hits(bird)) { // kontrola, zda pták narazil do trubky
            gameOver = true; // označení konce hry
            if (score > highScore) { // aktualizace nejvyššího skóre
                highScore = score;
            }
        }

        if (pipes[i].offscreen()) { // kontrola, zda trubka opustila obrazovku
            pipes.splice(i, 1); // odstranění trubky z pole
            score++; // zvýšení skóre
            if (score % 10 === 0 && level < 5) { // zvýšení úrovně každých 10 bodů (maximálně do úrovně 5)
                level++;
            }
        }
    }

    bird.update(); // aktualizace stavu ptáka
    bird.show(); // vykreslení ptáka

    if (bird.y >= height || bird.y <= 0) { // kontrola, zda pták narazil na horní nebo dolní okraj obrazovky
        gameOver = true; // označení konce hry
        if (score > highScore) { // aktualizace nejvyššího skóre
            highScore = score;
        }
    }
    if (gameStarted && frameCount % 90 == 0) { // každých 90 snímků přidá novou trubku
        pipes.push(new Pipe());
    }

    textSize(32); 
    fill(255); 
    text("Score: " + score, 75, 30); // vykreslení aktuálního skóre
    text("High Score: " + highScore, 115, 60); // vykreslení nejvyššího skóre
    text("Level: " + level, 75, 90); // vykreslení aktuální úrovně
}

function keyPressed() { // klávesy
    if (key == ' ' && !gameStarted) { // mezerník při nezahájené hře
        gameStarted = true; // hra začne
        frameCount = 0; // resetuje počítadlo snímků
    } else if (key == ' ' && gameOver) { // mezerník po konci hry
        restartGame(); // restart hry
    } else if (key == ' ' && !gameOver) { // mezerník během hry
        bird.up(); // pták letí nahoru
    }
}

function restartGame() { // restartování hry
    gameOver = false; // hra není ukončena
    gameStarted = true; // hra začíná
    score = 0; // skóre se resetuje
    level = 1; // úroveň se resetuje
    pipes = []; // vyprázdnění pole trubek
    frameCount = 0; // reset počítadla snímků
    bird = new Bird(); // vytvoření nového objektu ptáka
    pipes.push(new Pipe()); // přidání první trubky
}

class Bird { // třída Bird (pták)
    constructor() { 
        this.y = height / 2; // počáteční výška ptáka
        this.x = 64; // horizontální pozice ptáka
        this.gravity = 1; // gravitace ovlivňující ptáka
        this.lift = -25; // síla zvednutí při skoku
        this.velocity = 0; // počáteční rychlost
    }

    show() { 
        image(birdImg, this.x, this.y, 64, 64); // vykreslení ptáka
    }

    up() { 
        this.velocity += this.lift; // změna rychlosti při skoku
    }

    update() { 
        this.velocity += this.gravity; // přidání gravitace k rychlosti
        this.velocity *= 0.9;
        this.y += this.velocity; // změna výšky podle rychlosti

        if (this.y > height) { // zabránění pádu mimo obrazovku
            this.y = height; 
            this.velocity = 0; 
        }

        if (this.y < 0) { // zabránění překročení horní hranice
            this.y = 0; 
            this.velocity = 0; 
        }
    }
}

class Pipe { // třída Pipe (trubka)
    constructor() { 
        this.spacing = max(50, 175 - level * 5); // mezera mezi horní a dolní trubkou
        this.top = random(height / 6, (3 / 4) * height); // náhodná výška horní trubky
        this.bottom = height - (this.top + this.spacing); // výška dolní trubky
        this.x = width; // počáteční horizontální pozice trubky
        this.w = 60; // šířka trubky
        this.speed = 6 + level * 0.5; // rychlost pohybu trubky
    }

    hits(bird) { // kontrola kolize ptáka s trubkou
        let birdWidth = 48; 
        let birdHeight = 48; 
        let hitboxPadding = 5; 
        if (bird.x + birdWidth - hitboxPadding > this.x && bird.x + hitboxPadding < this.x + this.w) {
            if (bird.y + hitboxPadding < this.top || bird.y + birdHeight - hitboxPadding > height - this.bottom) {
                return true; // kolize detekována
            }
        }
        return false; // žádná kolize
    }

    show() { 
        image(pipeImg, this.x, 0, this.w, this.top, 0, 0, pipeImg.width, pipeImg.height); // vykreslení horní trubky
        image(pipeImg, this.x, height - this.bottom, this.w, this.bottom, 0, 0, pipeImg.width, pipeImg.height); // vykreslení dolní trubky
    }

    update() { 
        this.x -= this.speed; // posunutí trubky doleva
    }

    offscreen() { 
        return this.x < -this.w; // kontrola, zda trubka opustila obrazovku
    }
}

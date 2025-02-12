const WIDTH = 500; // Longueur du canvas
const HEIGHT = 469; // Largeur du canvas
const BLOCK_SIZE = 10; // Taille d'un bloc (Le serpent étant fait de blocs)

let snake = null; // Serpent
let foods = []; // Tableau qui va contenir la bouffe du serpent

// Classe serpent (en gros ce qu'on va utiliser pour construire le serpent comme un moule à brique)
class Snake {
  constructor({ x = 0, y = 0, dirX = 1, dirY = 0, color = "yellow" } = {}) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.color = color;
    /* 
      Ici on definit les valeurs de base de la classe avec le mot-clé this et ainsi :
       x => abscisse du serpent
       y => ordonnée du serpent
       dirX => le sens de deplacement suivant l'axe des abscisses
       dirY => le sens de deplacement suivant l'axe des ordonnées
       color => la couleur du serpent
    */

    this.speed = BLOCK_SIZE;
    this.length = 2;
    this.tail = [];
    /*
      Ici on définit des valeurs ajoutées au préalable, ainsi : 
        speed => vitesse du serpent
        length => la longueur du serpent
        tail => la queue du serpent
    */
  }

  dir(dir) {
    switch (dir) {
      case "up":
        if (this.dirY === 1) {
          return;
        }
        this.dirX = 0;
        this.dirY = -1;
        /*
          Ici on definit dans quelle direction ira le serpent en fonction de la valeur du parametre dir
            -Dans ce cas précis on a :
              si la valeur de dir est égale à "up", alors le serpent ira vers dirY = -1 et dirX = 0 soit le haut
              le if empêche le serpent de faire un demi tour sans changer de sens
            -Cela s'applique à tous les autres cas
        */
        break;
      case "right":
        if (this.dirX === -1) {
          return;
        }
        this.dirX = 1;
        this.dirY = 0;
        break;
      case "left":
        if (this.dirX === 1) {
          return;
        }
        this.dirX = -1;
        this.dirY = 0;
        break;
      case "down":
        if (this.dirY === -1) {
          return;
        }
        this.dirX = 0;
        this.dirY = 1;
        break;
    }
  }

  // La fonction draw() sert a definir visuellement le serpent
  draw() {
    this.fillColor(); // Définit la couleur du serpent avec la fonction fillColor()
    rect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    /*
      La fonction rect() est une fonction incluse dans P5Js qui permet de definir les proportions du serpent ainsi que sa position, ainsi :
        this.x et this.y => la position du serpent 
        Blocksize & Blocksize => longueur et largeur du serpent
    */

    this.tail.forEach(({ x, y }) => {
      rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    }); // Pareil que plus haut avec le rect() mais pour definir la queue au lieu du serpent
  }

  fillColor() {
    const colorMap = {
      yellow: [255, 177, 30],
      blue: [57, 177, 198],
      orange: [209, 98, 0],
      darkblue: [39, 121, 134],
      lightblue: [240, 249, 238],
    }; // Liste de couleurs en rgb() qui peuvent être utilisées en changeant juste le yellow dans les parametres de la classe

    const colors = colorMap[this.color] || "darkblue";

    fill(colors[0], colors[1], colors[2]); // définition de la couleur
  }

  // Fonction pour le mouvement du serpent
  move() {
    if (this.tail.length === this.length) {
      this.tail.shift();
    }

    if (this.tail.length < this.length) {
      this.tail.push({
        x: this.x,
        y: this.y,
      });
    }

    this.x += this.dirX * this.speed;
    this.y += this.dirY * this.speed;

    this.tail.forEach(({ x, y }) => {
      if (this.x === x && this.y === y) {
        this.reset();
      }
    }); // Ici on verifie que si le serpent cogne sa queue que le jeu recommence avec la taille initiale du serpent

    if (this.x >= WIDTH) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = WIDTH;
    }

    if (this.y >= HEIGHT) {
      this.y = 0;
    }
    if (this.y < 0) {
      this.y = HEIGHT;
    } // On fait en sorte que si le serpent atteigne le bord du canvas il ressorte du cote oppose que ce soit haut bas gauche droite à travers les 4 if
  }

  reset() {
    this.tail.splice(0, this.tail.length - 2);
    this.length = 2;
  } // La fonction qui permet de reset le serpent quand il cogne sa queue
}

// Classe qui génère la bouffe du serpent
class Food {
  constructor({ x = 0, y = 0 } = {}) {
    (this.x = x), (this.y = y);
  } // Construction des coordonnées de chaque bouffe

  draw() {
    fill(255, 0, 0);
    rect(this.x + 1, this.y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
  } // Definition de leur taille et de leur couleur
}

// Fonction existante dans la librairie P5Js qui permet de gerer tout le jeu (setup)
function setup() {
  createCanvas(WIDTH, HEIGHT); // Creation du canvas
  frameRate(10); // Gestion de la vitesse à travers les fps. En fait la fonction préfabriquée draw() plus bas dessine le serpent suivant les fps donc à 60fps il redessiner le serpent 60 fois en une seconde ce qui sera etremement rapide donc on diminue les fps à 5 avec frameRate() une fonction de P5Js

  const randDir = Math.random() < 0.5 ? 1 : 0; // constante de direction aléatoire au debut du jeu

  snake = new Snake({
    x: parseInt(random(0, WIDTH) / BLOCK_SIZE) * BLOCK_SIZE,
    y: parseInt(random(0, HEIGHT) / BLOCK_SIZE) * BLOCK_SIZE,
    /*
      Ici on définit une position aléatoire au debut du jeu en utilisant random() (Fonction de P5Js) et ainsi :
        -random(0, Width/Height) => genere un nombre aleatoire entre le debut du canvas et de la fin
        -on divise et mutiplie par Blocksize pour ...
        -on utilise la methode parseInt() pour rendre le nombre entier et aisni avoir une position aléatoire (x, y) au debut du jeu
    */
    dirX: randDir === 1 ? 1 : 0,
    dirY: randDir === 0 ? 1 : 0,
    // Définit une direction aleatoire pour le serpent au debut du jeu
  });

  // ajout d'une bouffe dans le tableau à bouffes foods
  foods.push(
    new Food({
      x: parseInt(random(0, WIDTH) / BLOCK_SIZE) * BLOCK_SIZE,
      y: parseInt(random(0, HEIGHT) / BLOCK_SIZE) * BLOCK_SIZE,
      // Position aléatoire pour la bouffe comme expliqué pour la position aléatoire du serpent
    })
  );
}

// Fonction préexistante dans P5Js qui permet de tracer le serpent en fonction des fps définis
function draw() {
  background(0);

  snake.draw(); // applique le dessin du serpent dans la classe Snake
  snake.move(); // Applique le mouvement du serpent dans la classe Snake

  foods[0].draw(); // Dessine la première bouffe

  if (
    collideRectRect(
      snake.x,
      snake.y,
      BLOCK_SIZE,
      BLOCK_SIZE,
      foods[0].x + 1,
      foods[0].y + 1,
      BLOCK_SIZE - 2,
      BLOCK_SIZE - 2
    )
    // collideRectRect() est une fonction de P5js qui permet de gérer les collisions entre deux rectangles, ici les deu rect sont le serpent et la bouffe définis tous deux par snake et foods suivi chacun de leur caractéristiques
  ) {
    foods.shift(); // A la collision entre le serpent et la bouffe la bouffe disparait
    foods.push(
      new Food({
        x: parseInt(random(0, WIDTH) / BLOCK_SIZE) * BLOCK_SIZE,
        y: parseInt(random(0, HEIGHT) / BLOCK_SIZE) * BLOCK_SIZE,
      })
    ); // A cette meme collision une autre bouffe apparait aleatoirement (meme code que pour bouffe aleatoire plus haut)

    snake.length++; // A cette meme collision la longueur du serpent augmente de 1
  }
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      snake.dir("up");
      break;
    case RIGHT_ARROW:
      snake.dir("right");
      break;
    case LEFT_ARROW:
      snake.dir("left");
      break;
    case DOWN_ARROW:
      snake.dir("down");
      break;
  }
} // keyPressed() est une fonction de P5js qui permet de gerer facilement les Keydown event en js et ici on affecte la valeur up, right, left, down  à la fonction dir() qu'on avait creer dans la classe Snake pour gérer les direction

// Fin du code (Jusqu'à amelioration)

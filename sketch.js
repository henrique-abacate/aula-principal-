var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player, game;
var playerCount, gameState;
var allPlayers;
var pistaImg, carro1, carro1Img, carro2, carro2Img, carros = [];

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  pistaImg = loadImage("assets/track.jpg");
  carro1Img = loadImage("assets/car1.png");
  carro2Img = loadImage("assets/car2.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);

  if(playerCount == 2){
    game.update(1);
  }

  if(gameState === 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

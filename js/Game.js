class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;
    this.leftKeyActive = false;

  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();

    carro1 = createSprite(width/2 - 50, height - 100);
    carro1.addImage("carro1", carro1Img);
    carro1.scale = 0.07;
    carro2 = createSprite(width/2 + 100, height - 100);
    carro2.addImage("carro2", carro2Img);
    carro2.scale = 0.07;
    carro1.addImage ("kaboom",kaboom);
    carro2.addImage ("kaboom",kaboom);

    carros = [carro1,carro2];

    fuels = new Group();
    powerCoins = new Group();
    obstaculos = new Group();
    

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    //this.addSprites (obstaculos,obstaclesPositions.length,obstacle2Image,0.04, obstaclesPositions);
    this.addSprites (powerCoins,3,powerCoinsImg,0.09);
    this.addSprites(fuels,5,fuelImg,0.02);
    this.addSprites(obstaculos,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);

  }

  handleElements(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200,40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 + 230, 100);

    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width/3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3 - 50, 130);

  }

  handleResetButton(){
    //Henrique
    this.resetButton.mousePressed(()=>{
database.ref("/").set({
  gameState : 0,
  playerCount:0,
  players:{},
  carsAtEnd: 0,
});
window.location.reload ();

  });
  }
  play(){
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
  

    if(allPlayers !== undefined){
      image(pistaImg,0,-height*5, width, height*6);
      
      this.showLife();
      this.showLeaderboard();
      this.showFuel ();

      var index = 0;

      for(var plr in allPlayers){
        index = index + 1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        carros[index-1].position.x = x;
        carros[index-1].position.y = y;

        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);

          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleObstacleCollision(index);
          this.carsCollision(index);
          
          if(player.life <= 0){
            this.playerMoving = false;
          carros [index-1].changeImage ("kaboom");
          carros[index-1].scale = 0.5
          }
          

          //camera do jogo na direção y
          camera.position.y = carros[index-1].position.y;
        }
  
      }

      this.handlePlayerControl();

      const finishLine = height*6 - 100;

      if(player.positionY > finishLine){
        gameState = 2;
        player.rank +=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }

  }

  handlePlayerControl(){
    if(keyIsDown(UP_ARROW)){
      this.playerMoving = true;
      player.positionY += 10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW)&&player.positionX > width/3-50){
      this.leftKeyActive = true;
      player.positionX -= 10;
      player.update();

    }
    
    if(keyIsDown(RIGHT_ARROW)&&player.positionX < width/2+250){
      this.leftKeyActive = false;
      player.positionX += 10;
      player.update();
      

    }
  }

  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    });
  }

  update(state){
    database.ref("/").update({
      gameState: state
    });
}

showLeaderboard(){
  var leader1, leader2;
  var players = Object.values(allPlayers);

  if((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1){
    leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
  }

  if(players[1].rank === 1){
    leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
  }
  
  this.leader1.html(leader1);
  this.leader2.html(leader2);
}

addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []){
  for(var i=0; i<numberOfSprites; i++){
    var x,y;
if(positions.length>0){
  x = positions[i].x;
  y= positions[i].y;
  spriteImage = positions[i].image
}
else {x = random(width/2 + 150, width/2 - 150);
y = random(-height*4.5, height - 400);
}
    var sprite = createSprite(x,y);
    sprite.addImage("sprite", spriteImage);

    sprite.scale = scale;

    spriteGroup.add(sprite);
  }
}

handleFuel(index){
  carros[index-1].overlap(fuels, function(collector,collected){
    player.fuel = 185;
    collected.remove();
  });
  if (player.fuel>0 ){
    player.fuel -=0.4;
  }
  if(player.fuel<0){
    this.playerMoving = false;
    this.gameOver();
    gameState =2;
  }
}

handlePowerCoins(index){
  carros[index-1].overlap(powerCoins, function(collector,collected){
    player.score +=20;
    player.update();
    collected.remove();
  });
}

showRank(){
  swal({
    title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
    text: "Parabéns! Você superou os seus inimigos",
    imageUrl: 
    "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize: "100x100",
    confirmButtonText: "Ok"
  });
}

showLife(){
  push();
  image(lifeImg,width/2-130, height - player.positionY - 200,20,20);
  fill("white");
  rect(width/2 - 100, height - player.positionY - 200,185,20);
  fill("red");
  rect(width/2 - 100, height - player.positionY - 200,player.life,20);
  noStroke();
  pop();
}
showFuel(){
  push();
  image(fuelImg,width/2-130, height - player.positionY - 100,20,20);
  fill("white");
  rect(width/2 - 100, height - player.positionY - 100,185,20);
  fill("blue");
  rect(width/2 - 100, height - player.positionY - 100,player.fuel,20);
  noStroke();
  pop();
}

handleObstacleCollision(index){
  if(carros[index-1].collide(obstaculos)){
    if(this.leftKeyActive){
      player.positionX += 100;
    }
    else{
      player.positionX -= 100;
    }
    if(player.life>0){
      player.life -= 185/5;
    }
    player.update();
  }
}

gameOver(){
  swal({
    title: `Gameover!${"\n"}Rank${"\n"}${player.rank}`,
    text: "Puts, Você perdeu",
    imageUrl: 
    "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Ok"
  });
}
carsCollision (index){
  if (index == 1){
  if (carros[index-1].collide(carros[1])){
    if(this.leftKeyActive){
      player.positionX += 100;
    }
    else{
      player.positionX -= 100;
    }
    if(player.life>0){
      player.life -= 185/5;
    }
    player.update();
  
  }
}
if (index == 2){
  if (carros[index-1].collide(carros[0])){
    if(this.leftKeyActive){
      player.positionX += 100;
    }
    else{
      player.positionX -= 100;
    }
    if(player.life>0){
      player.life -= 185/5;
    }
    player.update();
  
  


}
}
}
}
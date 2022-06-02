class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");


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

    carros = [carro1,carro2];

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
  }

  handleResetButton(){
    //Henrique
    this.resetButton.mousePressed(()=>{
database.ref("/").set({
  gameState : 0,
  playerCount:0,
  players:{}
  
});
window.location.reload ();

  });
  }
  play(){
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();

    if(allPlayers !== undefined){
      image(pistaImg,0,-height*5, width, height*6);

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

          //camera do jogo na direção y
          camera.position.y = carros[index-1].position.y;
        }
  
      }

      this.handlePlayerControl();

      drawSprites();
    }

  }

  handlePlayerControl(){
    if(keyIsDown(UP_ARROW)){
      player.positionY += 10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW)&&player.positionX > width/3-50){
      player.positionX -= 10;
      player.update();

    }
    
    if(keyIsDown(RIGHT_ARROW)&&player.positionX < width/2+250){
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

}

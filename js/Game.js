class Game {
  constructor() {}

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
  }

  play(){
    this.handleElements();
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
        
      }

      this.handlePlayerControl();

      drawSprites();
    }

  }

  handlePlayerControl(){

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

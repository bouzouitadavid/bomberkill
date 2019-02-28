        //scale of the game
        let caWidth = window.innerWidth;
        let caHeigth = window.innerHeight;

        //Config of the game
        let config = {
            type: Phaser.AUTO,
            width: caWidth,
            height: caHeigth,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 666 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            scale: {
                width: caWidth,
                height: caHeigth
            }
        };
        //Global let
        let bombs;
        let potions;
        let platforms;
        let lava;
        let cursors;
        let pointer;
        //Physical params
            //Player's Velocity
            let veloX = 200;
            let veloY = -650; 
            let malusX = 1;
            let malusY = 1;
            //Punch force
            let punchForce = 30000;
            //Bombs force
            let bombForceX = 2000*2;
            let bombForceY = 500*2;
            //Lava force
            let lavaForce = -1600;
        //Players
            //Player1
            let player1;
            let camera1;
            //player2
            let player2;
var game = new Phaser.Game(config);

function preload() {
  this.load.image('ship', 'assets/spaceShips_001.png');
  this.load.image('otherPlayer', 'assets/enemyBlack5.png');
  this.load.image('star', 'assets/star_gold.png');
  this.load.image('sky', 'assets/bg_volcano.png');
  this.load.image('ground', 'assets/PNG/volcano_pack_alt_05.png');
  this.load.image('petitsol', 'assets/PNG/volcano_pack_alt_39.png');
  this.load.image('sollave', 'assets/PNG/volcano_pack_05.png');
  this.load.image('lavebord', 'assets/PNG/volcano_pack_53.png');
  this.load.image('lavemid', 'assets/PNG/volcano_pack_54.png');
  this.load.image('solnoir', 'assets/PNG/volcano_pack_alt_35.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('sticky-run0', 'assets/sticky-run0.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('sticky-run1', 'assets/sticky-run1.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('sticky-run2', 'assets/sticky-run2.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('sticky-run3', 'assets/sticky-run3.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('sticky-run4', 'assets/sticky-run4.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('sticky-run5', 'assets/sticky-run6.png', { frameWidth: 32, frameHeight: 48 });
  this.load.image('potion', 'assets/potion.png');
  this.load.image('cross', 'assets/cross1.png');
  this.load.image('explosion','assets/explosion.png');


}

function create() {
              //Background (sky width = 5120 heigth = 2880)=>(from -2560 to 2560 and from -1440 to 1440)
              this.add.image(0, 0, 'sky');
              //Platforms
                  //classic platforms
                  platforms = this.physics.add.staticGroup();
                  //lava platforms
                  lava = this.physics.add.staticGroup();
                      //Function to generate platforms
                      function createEarth (name, number, coodX, coodY, xSpacing, ySpacing, type){
                          for (let i=0; i<number; i++){
                              name.create(coodX,coodY,type).setScale(0.5).refreshBody();
                              coodX += xSpacing;
                              coodY += ySpacing;
                          };
                      };   
                      //Generate earth platforms
                      createEarth(platforms,100,-2500,300,60,0,'ground');
                      // createEarth(platforms,8,900,1100,60,0,'ground');
                      // createEarth(platforms,9,1640,1100,60,0,'ground');
                      // createEarth(platforms,5,600,800,60,0,'ground');
                      // createEarth(platforms,5,1440,800,60,0,'ground');
                      // createEarth(platforms,5,1000,600,60,0,'ground');
                      // createEarth(platforms,5,250,500,60,0,'ground');
                      // createEarth(platforms,5,1800,500,60,0,'ground');
                      // createEarth(platforms,5,300,1350,60,0,'sollave');
                      // createEarth(platforms,5,700,1350,60,0,'sollave');
                      // createEarth(platforms,5,1100,1350,60,0,'sollave');
                      // createEarth(platforms,1,-110,1350,60,0,'sollave');   
                      // createEarth(platforms,1,-50,1600,60,0,'sollave');
                      // createEarth(platforms,1,-180,1900,60,0,'sollave');
                      // createEarth(platforms,1,70,1900,60,0,'sollave');
                      // createEarth(platforms,1,-110,2100,60,0,'sollave');
                      // createEarth(platforms,6,1600,1500,60,0,'sollave');
                      // //Lava box right
                      // createEarth(lava,9,800,1650,60,0,'lavemid');
                      // createEarth(platforms,9,800,1700,60,0,'sollave');
                      // createEarth(platforms,1,1344,1638,0,60,'sollave');
                      // createEarth(platforms,1,1344,17000,0,6,'solnoir');
                      // createEarth(platforms,1,799,1638,0,60,'sollave');
                      // createEarth(platforms,1,799,1700,0,60,'solnoir');
                      // //Lava box left
                      // createEarth(lava,9,100,1650,60,0,'lavemid');
                      // createEarth(platforms,9,100,1700,60,0,'sollave');
                      // createEarth(platforms,1,599,1638,0,60,'sollave');
                      // createEarth(platforms,1,599,1700,0,60,'solnoir');
                      // createEarth(platforms,1,99,1638,0,60,'sollave');
                      // createEarth(platforms,1,99,1700,0,60,'solnoir');


  var self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();
  this.bombs = this.physics.add.group();
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  this.socket.on('currentBombs', function (bombs) {
    Object.keys(players).forEach(function (id) {
      if (bombs[id].bomb === self.socket.id) {
        addBombs(self, bombs[id]);
      }
    });
  });
  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });
  this.cursors = this.input.keyboard.createCursorKeys();

  this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

}

function addPlayer(self, playerInfo) {
  self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'dude');
  if (playerInfo.team === 'blue') {
    self.ship.setTint(0x0000ff);
  } else {
    self.ship.setTint(0xff0000);
  }
  // congif player/ship
  self.ship.isDead = "false";
  self.ship.name = "player1";
  self.ship.state = 5;
  self.ship.setBounce(0.1);
  self.ship.setCollideWorldBounds(false);
  self.physics.add.collider(self.ship, platforms);
  //Camera for player 1
  camera1 = self.cameras.main.startFollow(self.ship);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
  self.physics.add.collider(otherPlayer, platforms);
  
}
function update() {
  pointer = this.input.activePointer;
  ship = this.ship;


  if (this.ship) {
            //fire a bomb
          if(pointer.justDown){
                let bomb = this.bombs.create(ship.x, ship.y, 'bomb');
                bomb.setBounce(0.8);
                bomb.setCollideWorldBounds(false);
                bomb.setVelocity(-(camera1._width/2-pointer.downX)*1.5,-(camera1._height/2-pointer.downY)*1.5);
                bomb.allowGravity = false;
                /* setTimeout(() => bomb.anims.play("explosion"), 4000);
                setTimeout(() => bomb.destroy(), 4020); */
                    // emit player movement
                    this.socket.emit('bombMovement', { bombX: bomb.x, bombY: bomb.y});
          }


            
           //Controll player1
           if (this.cursors.left.isDown){
            this.ship.setVelocityX(-veloX/malusX);
            for (let i = 0; i < 6; i++) {
                if(this.ship.state == i){
                  //this.ship..anims.play(`left${i}`, true);
                };    
            };
        } else if (this.cursors.right.isDown){
          this.ship.setVelocityX(veloX/malusX);
            for (let i = 0; i < 6; i++) {
                if(this.ship.state == i){
                  //this.ship..anims.play(`right${i}`, true);
                };    
            };
        } else {
          this.ship.setVelocityX(0);
            for (let i = 0; i < 6; i++) {
                if(this.ship.state == i){
                  //this.ship..anims.play(`turn${i}`);
                };    
            };
        };
        if (this.cursors.up.isDown && this.ship.body.touching.down)
        {
          this.ship.setVelocityY(veloY/malusY);
        };
  
    this.physics.world.wrap(this.ship, 5);


    // emit player movement
    var x = this.ship.x;
    var y = this.ship.y;
    var r = this.ship.rotation;
    if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
    }
    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    };// end emit players

  }
              //Define collision
              
              // this.physics.add.collider(player2, platforms);
              // this.physics.add.collider(player1, player2, punch);
              // this.physics.add.collider(bombs, platforms);
              // this.physics.add.collider(bombs, bombs);
              // this.physics.add.collider(bombs, player1, explode);
              // this.physics.add.collider(bombs, player2, explode);
              // this.physics.add.collider(player1, lava, burn);
              // this.physics.add.collider(player2, lava, burn);
              // this.physics.add.collider(potions, platforms);
              // this.physics.add.overlap(player1, potions, collectpotion, null, this); 
              // this.physics.add.overlap(player2, potions, collectpotion, null, this); 
} // end update 
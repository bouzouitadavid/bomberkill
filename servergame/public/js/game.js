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
let bombForceX = 2000 * 2;
let bombForceY = 500 * 2;
//Lava force
let lavaForce = -1600;
//Players
//Player1
let player1;
let camera1;
//player2
let player2;
let game = new Phaser.Game(config);


function preload() {
  this.load.image('sky', 'assets/bg_volcano.png');
  this.load.image('ground', 'assets/PNG/volcano_pack_alt_05.png');
  this.load.image('solnoir', 'assets/PNG/volcano_pack_alt_35.png');
  this.load.image('petitsol', 'assets/PNG/volcano_pack_alt_39.png');
  this.load.image('sollave', 'assets/PNG/volcano_pack_05.png');
  this.load.image('lavebord', 'assets/PNG/volcano_pack_53.png');
  this.load.image('lavemid', 'assets/PNG/volcano_pack_54.png');
  this.load.image('pievio', 'assets/PNG/volcano_pack_56.png');
  this.load.image('arbre', 'assets/PNG/volcano_pack_59.png');
  this.load.image('piejau', 'assets/PNG/volcano_pack_65.png');
  this.load.image('plantejaune', 'assets/PNG/volcano_pack_66.png');
  this.load.image('volcan', 'assets/PNG/volcano_pack_68.png');
  this.load.image('herbe', 'assets/PNG/volcano_pack_69.png');
  this.load.image('quartz1', 'assets/PNG/volcano_pack_70.png');
  this.load.image('quartz2', 'assets/PNG/volcano_pack_71.png');
  this.load.image('piebleu', 'assets/PNG/volcano_pack_72.png');
  this.load.image('troncmort', 'assets/PNG/volcano_pack_73.png');
  this.load.image('plantpie', 'assets/PNG/volcano_pack_74.png');
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
  this.load.image('explosion', 'assets/explosion.png');
};

//Element creating
function create() {
  //Background (sky width = 5120 heigth = 2880)=>(from -2560 to 2560 and from -1440 to 1440)
  this.add.image(0, 0, 'sky');
  //Platforms
  //classic platforms                
  platforms = this.physics.add.staticGroup();
  decor = this.physics.add.staticGroup();
  //lava platforms
  lava = this.physics.add.staticGroup();
  //Function to generate platforms
  function createEarth(name, number, coodX, coodY, xSpacing, ySpacing, type, scale = 0.5) {
    for (let i = 0; i < number; i++) {
      name.create(coodX, coodY, type).setScale(scale).refreshBody();
      coodX += xSpacing;
      coodY += ySpacing;
    };
  };
  createEarth(platforms, 9, -240, 300, 60, 0, 'ground'); // PLATEFORME PRINCIPALE MILIEU                    
  createEarth(platforms, 8, 500, 300, 60, 0, 'ground'); // PLATEFORME PRINCIPALE DROITE 
  createEarth(platforms, 9, -1000, 300, 60, 0, 'ground'); // PLATEFORME PRINCIPALE GAUCHE
  createEarth(platforms, 5, -500, 0, 60, 0, 'ground'); // PLATEFORME 1 ER ETAGE GAUCHE
  createEarth(platforms, 5, 250, 0, 60, 0, 'ground'); // PLATEFORME 1 ER ETAGE DROITE
  createEarth(platforms, 8, -1000, -200, 60, 0, 'ground'); // PLATEFORME 2 EME ETAGE GAUCHE
  createEarth(platforms, 4, -1000, -200, 0, -60, 'ground'); // PLATEFORME 2 EME ETAGE GAUCHE
  createEarth(platforms, 2, -938, -380, 60, -0, 'ground'); // PLATEFORME 2 EME ETAGE GAUCHE
  createEarth(platforms, 8, 600, -200, 60, 0, 'ground'); // PLATEFORME 2 EME ETAGE DROITE
  createEarth(platforms, 4, 1050, -200, 0, -60, 'ground'); // PLATEFORME 2 EME ETAGE DROITE
  createEarth(platforms, 2, 1000, -380, -60, 0, 'ground'); // PLATEFORME 2 EME ETAGE DROITE
  //BAC à lave droite
  createEarth(platforms, 9, 270, 700, 60, 0, 'sollave');
  createEarth(lava, 9, 270, 650, 60, 0, 'lavemid');
  createEarth(platforms, 1, 220, 576, 0, 60, 'sollave');
  createEarth(platforms, 2, 220, 640, 0, 60, 'solnoir');
  createEarth(platforms, 1, 800, 576, 0, 60, 'sollave');
  createEarth(platforms, 2, 800, 640, 0, 60, 'solnoir');
  // BAC à lave gauche                             
  createEarth(platforms, 9, -500, 700, 60, 0, 'sollave');
  createEarth(lava, 9, -500, 650, 60, 0, 'lavemid');
  createEarth(platforms, 1, -564, 576, 0, 60, 'sollave');
  createEarth(platforms, 2, -564, 640, 0, 60, 'solnoir');
  createEarth(platforms, 1, 0, 576, 0, 60, 'sollave');
  createEarth(platforms, 2, 0, 640, 0, 60, 'solnoir');

  //ESCALIER BAS GAUCHE
  createEarth(platforms, 6, -564, 550, -60, 40, 'sollave');
  createEarth(platforms, 7, -850, 750, -60, 0, 'sollave');
  createEarth(platforms, 4, -1250, 500, -60, 0, 'sollave');

  // PLATEFORME MAISON + MAISON

  createEarth(platforms, 15, -400, -400, 60, 0, 'ground'); // PLATEFORME MAISON

  //    //DECO                    
  createEarth(decor, 3, -170, 145, 190, 0, 'arbre', 1);
  createEarth(decor, 1, 700, 210, 0, 0, 'arbre');
  createEarth(decor, 1, 905, 175, 0, 0, 'plantpie', 1.5);
  createEarth(decor, 1, -600, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -650, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -700, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -800, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -850, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -800, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -950, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -900, 240, 0, 0, 'herbe');
  createEarth(decor, 1, -900, -290, 0, 0, 'quartz1', 1);
  createEarth(decor, 1, -850, -290, 0, 0, 'quartz2', 1);
  createEarth(decor, 3, -1150, 670, 30, 0, 'piejau', 0.75);
  createEarth(decor, 3, -950, 670, 30, 0, 'pievio', 0.75);
  createEarth(decor, 3, 260, -65, 110, 0, 'plantejaune', 0.75);
  createEarth(decor, 3, -450, -90, 60, 0, 'herbe', 1);
  createEarth(decor, 2, -150, -620, 350, 0, 'volcan', 3.0);
//fin de la création de la map

///////////////////////////////
//Communication avec le serveur
  let self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId == self.socket.id) {
        addPlayer(this, players[id]);
      } else {
        addOtherPlayers(this, players[id]);
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
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });
  //Sert à quoi ? 
  this.cursors = this.input.keyboard.createCursorKeys();
}


function addPlayer(self, playerInfo) {
  self.player = self.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  // congif player/player
  self.player.isDead = "false";
  self.player.name = player.id;
  self.player.state = 5;
  self.player.setBounce(0.1);
  self.player.setCollideWorldBounds(false);
  self.physics.add.collider(self.player, platforms);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
  self.physics.add.collider(otherPlayer, platforms);
}

function update() {
  if (this.player) {
    //Controll player2
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-veloX / malusX);
      for (let i = 0; i < 6; i++) {
        if (this.player.state == i) {
          //this.player..anims.play(`left${i}`, true);
        };
      };
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(veloX / malusX);
      for (let i = 0; i < 6; i++) {
        if (this.player.state == i) {
          //this.player..anims.play(`right${i}`, true);
        };
      };
    } else {
      this.player.setVelocityX(0);
      for (let i = 0; i < 6; i++) {
        if (this.player.state == i) {
          //this.player..anims.play(`turn${i}`);
        };
      };
    };
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(veloY / malusY);
    };

    // emit player movement
    var x = this.player.x;
    var y = this.player.y;
    if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y )) {
      this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y });
    }
    // save old position data
    this.player.oldPosition = {
      x: this.player.x,
      y: this.player.y,
    };
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
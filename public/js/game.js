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
let bombs
let bombCount = 0
let bomb
let potions
let platforms
let lava
let cursors
let pointer
//Physical params
let bombX
let bombY
let bombVeloX
let bombVeloY
//Player's Velocity
let veloX = 200
let veloY = -650
let malusX = 1
let malusY = 1
//Punch force
let punchForce = 30000
//Bombs force
let bombForceX = 2000 * 2
let bombForceY = 500 * 2
//Lava force
let lavaForce = -1600

//Player1
let player1
//stockera tout les autres joueurs
let otherPlayers = []
let mainPlayerExist = false
let otherPlayerExist = false
let camera
let clientID
let input
let game = new Phaser.Game(config)


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
////////////////////
//Element creating//
////////////////////
function create() {
  //Background (sky width = 5120 heigth = 2880)=>(from -2560 to 2560 and from -1440 to 1440)
  this.add.image(0, 0, 'sky');
  //Platforms
  //classic platforms                
  platforms = this.physics.add.staticGroup();
  //decor = plante,arbre,roche 
  decor = this.physics.add.staticGroup();
  //lava platforms
  lava = this.physics.add.staticGroup();
  //add physics to the bombs
  bombs = this.physics.add.group();
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
  //DECO                    
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
  ///////////////////////
  //création des touches 
  cursors = this.input.keyboard.createCursorKeys()
  z = this.input.keyboard.addKey("z")
  q = this.input.keyboard.addKey("q")
  d = this.input.keyboard.addKey("d")
  e = this.input.keyboard.addKey("e")
  m = this.input.keyboard.addKey("m")
  pointer = this.input.activePointer
  ////////////////////////
  //Collision 
  this.physics.add.collider(bombs, platforms)
  this.physics.add.collider(bombs, bombs)
  this.physics.add.collider(bombs, lava)

  //////////////////////////////
  //Création des anims 
  for (let i = 0; i < 6; i++) {
    this.anims.create({
      key: `left${i}`,
      frames: this.anims.generateFrameNumbers(`sticky-run${i}`, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
  }
  for (let i = 0; i < 6; i++) {
    this.anims.create({
      key: `turn${i}`,
      frames: [{ key: `sticky-run${i}`, frame: 4 }],
      frameRate: 20
    });
  };
  for (let i = 0; i < 6; i++) {
    this.anims.create({
      key: `right${i}`,
      frames: this.anims.generateFrameNumbers(`sticky-run${i}`, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  };
  //anim death 
  this.anims.create({
    key: "die",
    frames: [{ key: "cross" }],
    frameRate: 20
  });

  ///////////////////////////////
  //Communication avec le serveur
  let self = this;
  this.socket = io();
  otherPlayers = this.physics.add.group();
  this.socket.on('currentPlayers', function (players) {
    clientID = self.socket.id;
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId == clientID) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  this.socket.on('disconnect', function (playerId) {
    otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.socket.on('playerMoved', function (playerInfo) {
    //fait une boucle sur chaque autres joueurs et incrémente les nouvelles positions transmisses par le serveur
    otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        otherPlayer.input = playerInfo.input;
        //pour le test de l'anim
        otherPlayer.state = 5; // playerInfo.state
      }
    });
  });
  //récéption des bombs
  this.socket.on('OtherBombs', function (boom) {
    console.log("bomb id" + boom.id)
    bomb = bombs.create(boom.x, boom.y, 'bomb')
    bomb.setBounce(0.8)
    bomb.body.velocity.x = boom.vx
    bomb.body.velocity.y = boom.vy
    setTimeout(() => bomb.destroy(), 4020)
  })
}

function addPlayer(self, playerInfo) {
  player1 = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'dude')
  // congif player/player
  player1.isDead = "false"
  player1.state = 5
  player1.setBounce(0.1)
  player1.setCollideWorldBounds(false)
  self.physics.add.collider(player1, platforms)
  camera = self.cameras.main.startFollow(player1)
  mainPlayerExist = true
  //créer les collisions avec les bombs
  self.physics.add.collider(player1, bombs, explode)
  self.physics.add.collider(player1, lava)
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'dude')
  otherPlayer.playerId = playerInfo.playerId
  otherPlayers.add(otherPlayer)
  self.physics.add.collider(otherPlayers, platforms)
  self.physics.add.collider(otherPlayers, player1)
  otherPlayerExist = true;
}
///////////////////////
// Création de bomb
function fire() {
  if(player1.state >= 0){
  bomb = bombs.create(player1.x, player1.y, 'bomb')
  bomb.setBounce(0.8)
  //bomb.setCollideWorldBounds(false)
  bomb.setVelocity(-(camera._width / 2 - pointer.downX) * 1.5, -(camera._height / 2 - pointer.downY) * 1.5)
  bomb.allowGravity = false
  bomb.name = clientID + bombCount
  bomb.id = clientID
  bomb.number = bombCount
  bombX = bomb.body.x
  bombY = bomb.body.y
  bombVeloX = bomb.body.velocity.x
  bombVeloY = bomb.body.velocity.y
  bombCount += 1
  }
  //setTimeout(() => bomb.destroy(), 4020);
  return (bomb, bombX, bombY, bombVeloX, bombVeloY)
}
//////////////////////
//KABOOM
function explode(player, bomb) {
  function explose(victime) {
    let xForce = bombForceX * ((player.x - bomb.x));
    let yForce = bombForceY * ((player.y - bomb.y));
    victime.setAccelerationX(xForce);
    victime.setAccelerationY(yForce);
    //Créer un variation au cours du temps de l'acceleration
    setTimeout(() => {
      victime.setAccelerationY(0)
    }, 40)
    setTimeout(() => {
      victime.setAccelerationX(xForce / 2)
    }, 250)
    setTimeout(() => {
      victime.setAccelerationX(xForce / 3)
    }, 450)
    setTimeout(() => {
      victime.setAccelerationX(0)
    }, 500)
  }
  explose(player)
  player.state -= 1
  /*
  bomb.anims.play("explosion");
  bombSound.volume = 0.2;
  bombSound.play();
  */
  setTimeout(() => bomb.destroy(), 50);
  die(player)
}
////////////////
//Die 
function die(player) {
  if (player.state < 0) {
    player.x = 0
    player.y = 0
    //player.dieText.visible = true
    player.body.enable = false
    player.anims.play("die")
    /*
    setTimeout(() => player.body.enable = true, 5000);
    setTimeout(() => player.dieText.visible = false, 5000);
    setTimeout(() => player.state = 5, 5000);
    setTimeout(() => player.lifeText.setText('vie: ' + player.state), 5000);
    */
  }
}

function update() {
  if (mainPlayerExist) {
    /////////////////////
    //création des input
    if (cursors.left.isDown) {
      input = "left"
    }
    else if (cursors.right.isDown) {
      input = "right"
    }
    else {
      input = "center"
    }
    //////////////////////////////////////
    //Animation et movement pour le joueur
    function animatedAndMove(player, input) {
      if (input == "left") {
        player.setVelocityX(-veloX / malusX);
        for (let i = 0; i < 6; i++) {
          if (player.state == i) {
            player.anims.play(`left${i}`, true);
          }
        }
      } else if (input == "right") {
        player.setVelocityX(veloX / malusX);
        for (let i = 0; i < 6; i++) {
          if (player.state == i) {
            player.anims.play(`right${i}`, true);
          }
        }
      } else {
        player.setVelocityX(0);
        for (let i = 0; i < 6; i++) {
          if (player.state == i) {
            player.anims.play(`turn${i}`);
          }
        }
      }
    }
    //////////////////////////////
    //Animation des autres joueurs
    function animatedOther() {
      otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayer.input == "left") {
          for (let i = 0; i < 6; i++) {
            if (otherPlayer.state == i) {
              otherPlayer.anims.play(`left${i}`, true);
            }
          }
        }
        else if (otherPlayer.input == "right") {
          for (let i = 0; i < 6; i++) {
            if (otherPlayer.state == i) {
              otherPlayer.anims.play(`right${i}`, true);
            }
          }
        }
        else {
          for (let i = 0; i < 6; i++) {
            if (otherPlayer.state == i) {
              otherPlayer.anims.play(`turn${i}`, true);
            }
          }
        }
      })
    }
    animatedAndMove(player1, input);
    if (otherPlayerExist) {
      animatedOther()
    }
    if (cursors.up.isDown && player1.body.touching.down) {
      player1.setVelocityY(veloY / malusY);
    }
    //permet de créer les bombes au click
    if (pointer.justDown) {
      fire()
      this.socket.emit('bombs', { x: bombX, y: bombY, vx: bombVeloX, vy: bombVeloY, name: bomb.name, id: bomb.id })
    }
    ///////////////////////
    // emit player movement
    let x = player1.x
    let y = player1.y
    if (player1.oldPosition && (x !== player1.oldPosition.x || y !== player1.oldPosition.y)) {
      this.socket.emit('playerMovement', { x: player1.x, y: player1.y, input: input, state: player1.state, id: clientID })
    }
    // save old position data
    player1.oldPosition = {
      x: player1.x,
      y: player1.y
    }
    //dying condition
    if (player1.y >= 1440) {
      player1.state = -5
      die(player1)
    }
  }
}

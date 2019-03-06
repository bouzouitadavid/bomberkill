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
let bombSound;

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
//Set game
let game = new Phaser.Game(config);
//Element loading
function preload() {
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
    this.load.image('explosion', 'assets/explosion.png');
    this.load.audio('bombSound', 'assets/Sound/bombSound.wav');
};
//Element creating
function create() {
    //Background (sky width = 5120 heigth = 2880)=>(from -2560 to 2560 and from -1440 to 1440)
    this.add.image(0, 0, 'sky');
    //Platforms
    //classic platforms
    platforms = this.physics.add.staticGroup();
    //lava platforms
    lava = this.physics.add.staticGroup();
    //Function to generate platforms
    function createEarth(name, number, coodX, coodY, xSpacing, ySpacing, type) {
        for (let i = 0; i < number; i++) {
            name.create(coodX, coodY, type).setScale(0.5).refreshBody();
            coodX += xSpacing;
            coodY += ySpacing;
        };
    };
    //Generate earth platforms
    createEarth(platforms, 100, -2500, 300, 60, 0, 'ground');

    //Player 1 creation
    player1 = this.physics.add.sprite(-100, 0, 'dude');
    player1.isDead = "false";
    player1.name = "player1";
    player1.state = 5;
    player1.setBounce(0.1);
    player1.setCollideWorldBounds(false);
    //Camera for player 1
    camera1 = this.cameras.main.startFollow(player1);
    //Screen life for player 1 
    player1.lifeText = this.add.text(-156, 0, 'vie: 5', { fontSize: '32px', fill: 'red' })
    player1.dieText = this.add.text(-150, -200, 'GAME OVER!', { fontSize: '50px', fill: 'red' });
    player1.dieText.visible = false;
    //Player 2 creation
    player2 = this.physics.add.sprite(100, 0, 'dude');
    player2.isDead = "false";
    player2.name = "player2";
    player2.state = 5;
    player2.setBounce(0.1);
    player2.setCollideWorldBounds(false);
    //Screen life for player 2 
    player2.lifeText = this.add.text(42, player2.y, 'vie: 5', { fontSize: '32px', fill: 'red' })
    player2.dieText = this.add.text(-150, -200, 'GAME OVER!', { fontSize: '50px', fill: 'red' });
    player2.dieText.visible = false;
    //Players Animation (general)
    for (let i = 0; i < 6; i++) {
        this.anims.create({
            key: `left${i}`,
            frames: this.anims.generateFrameNumbers(`sticky-run${i}`, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    };
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
    //animation of death
    this.anims.create({
        key: "die",
        frames: [{ key: "cross" }],
        frameRate: 20
    });
    //animation of explosion
    this.anims.create({
        key: "explosion",
        frames: [{ key: "explosion" }],
        frameRate: 20
    });
    //define touch 
    cursors = this.input.keyboard.createCursorKeys();
    z = this.input.keyboard.addKey("z");
    q = this.input.keyboard.addKey("q");
    d = this.input.keyboard.addKey("d");
    e = this.input.keyboard.addKey("e");
    m = this.input.keyboard.addKey("m");
    pointer = this.input.activePointer;
    //create bombs (gun)
    bombs = this.physics.add.group();
    //create potion 
    potions = this.physics.add.group({
        key: 'potion',
        //repeat: 11,
        setXY: { x: Phaser.Math.RND.between(-2560, 2560), }
    });
    potions.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.15, 0.35));
    });
    //Define collision
    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(player1, player2, punch);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, bombs);
    this.physics.add.collider(bombs, player1, explode);
    this.physics.add.collider(bombs, player2, explode);
    this.physics.add.collider(player1, lava, burn);
    this.physics.add.collider(player2, lava, burn);
    this.physics.add.collider(potions, platforms);
    this.physics.add.overlap(player1, potions, collectpotion, null, this);
    this.physics.add.overlap(player2, potions, collectpotion, null, this);
    // Sounds
    // bomb
    bombSound = this.sound.add('bombSound');

};
function update() {
    //Controll player1
    if (q.isDown) {
        player1.setVelocityX(-veloX / malusX);
        for (let i = 0; i < 6; i++) {
            if (player1.state == i) {
                player1.anims.play(`left${i}`, true);
            };
        };
    } else if (d.isDown) {
        player1.setVelocityX(veloX / malusX);
        for (let i = 0; i < 6; i++) {
            if (player1.state == i) {
                player1.anims.play(`right${i}`, true);
            };
        };
    } else {
        player1.setVelocityX(0);
        for (let i = 0; i < 6; i++) {
            if (player1.state == i) {
                player1.anims.play(`turn${i}`);
            };
        };
    };
    if (z.isDown && player1.body.touching.down) {
        player1.setVelocityY(veloY / malusY);
    };
    //Controll player2
    if (cursors.left.isDown) {
        player2.setVelocityX(-veloX / malusX);
        for (let i = 0; i < 6; i++) {
            if (player2.state == i) {
                player2.anims.play(`left${i}`, true);
            };
        };
    } else if (cursors.right.isDown) {
        player2.setVelocityX(veloX / malusX);
        for (let i = 0; i < 6; i++) {
            if (player2.state == i) {
                player2.anims.play(`right${i}`, true);
            };
        };
    } else {
        player2.setVelocityX(0);
        for (let i = 0; i < 6; i++) {
            if (player2.state == i) {
                player2.anims.play(`turn${i}`);
            };
        };
    };
    if (cursors.up.isDown && player2.body.touching.down) {
        player2.setVelocityY(veloY / malusY);
    };
    //fire a bomb
    if (pointer.justDown) {
        fire();
    }
    //rest in peace
    if (player1.y >= 1440) {
        player1.state = -1;
        die(player1);
    }
    if (player2.y >= 1440) {
        player2.state = -1;
        die(player2);
    }
};
function fire() {
    let bomb = bombs.create(player1.x, player1.y, 'bomb');
    bomb.setBounce(0.8);
    bomb.setCollideWorldBounds(false);
    bomb.setVelocity(-(camera1._width / 2 - pointer.downX) * 1.5, -(camera1._height / 2 - pointer.downY) * 1.5);
    bomb.allowGravity = false;
    /* setTimeout(() => bomb.anims.play("explosion"), 4000);
    setTimeout(() => bomb.destroy(), 4020); */
}
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
    explose(player);
    player.state -= 1;
    player.lifeText.setText('vie: ' + player.state);
    bomb.anims.play("explosion");
    bombSound.volume = 0.2;
    bombSound.play();
    setTimeout(() => bomb.destroy(), 50);
    die(player);
}
function punch(player1, player2) {
    //function punching 
    function punching(victime, sens) {
        if (sens == 1) {
        } else if (sens == 2) {
            punchForce = (-punchForce)
        }
        victime.setAccelerationX(punchForce)
        //Créer un variation au cours du temps de l'acceleration
        setTimeout(() => { victime.setAccelerationX(punchForce / 2) }, 250)
        setTimeout(() => { victime.setAccelerationX(punchForce / 3) }, 450)
        setTimeout(() => { victime.setAccelerationX(0) }, 500)
    };
    if (e.isDown && d.isDown) {
        punching(player2, 2)
    } else if (e.isDown && q.isDown) {
        punching(player2, 2)
    } if (cursors.right.isDown && m.isDown) {
        punching(player1, 2)
    } else if (cursors.left.isDown && m.isDown) {
        punching(player1, 2)
    };
};
function burn(player, lava) {
    player.state -= 1;
    player.lifeText.setText('vie: ' + player.state);
    function lavaRepulse(victime) {
        victime.setAccelerationY(lavaForce)
        //Créer un variation au cours du temps de l'acceleration
        setTimeout(() => { victime.setAccelerationY(lavaForce / 2) }, 250)
        setTimeout(() => { victime.setAccelerationY(lavaForce / 3) }, 450)
        setTimeout(() => { victime.setAccelerationY(0) }, 500)
    }
    lavaRepulse(player)
    die(player);
};
function collectpotion(player, potion) {
    potion.disableBody(true, true);
    //  Add and update the vie
    if (player.state < 5) {
        player.state += 1;
        player.lifeText.setText('vie: ' + player.state);
    }
    if (potions.countActive(true) === 0) {
        //  A new batch of potions to collect
        potions.children.iterate(function (child) {
            child.enableBody(true, Phaser.Math.RND.between(-2560, 2560), 0, true, true);
        });
    };
};
function die(player) {
    if (player.state < 0) {
        player.x = 0;
        player.y = 0;
        player.dieText.visible = true;
        player.body.enable = false;
        player.anims.play("die");
        setTimeout(() => player.body.enable = true, 5000);
        setTimeout(() => player.dieText.visible = false, 5000);
        setTimeout(() => player.state = 5, 5000);
        setTimeout(() => player.lifeText.setText('vie: ' + player.state), 5000);

    };
};

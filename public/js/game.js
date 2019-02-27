var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 666 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player1;
var player2;
var starslet 
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText = "";
///
//Paramètres physiques
//Velocity des joueurs
var veloX = 200;
var veloY = -350; 
var malusX = 1;
var malusY = 1;
//setup la force des punch
var punchForce = 30000;
//setup la forces des bombes
var bombForceX = 2000;
var bombForceY = 300;


var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(640, 360, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //first paramètre = longueur // second == hauteur de la platforme
    platforms.create(-50, 700, 'ground').setScale(2).refreshBody();   

    //  Now let's create some ledges
    platforms.create(900, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player1 = this.physics.add.sprite(100, 600, 'dude');
    player1.isDead = "false"
    player1.name = "player1"

    //  Player1 physics properties. Give the little guy a slight bounce.
    player1.setBounce(0.1);
    player1.setCollideWorldBounds(false);

    //  Our player1 animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

/*     //Created player 2
    player2 = this.physics.add.sprite(200, 600, 'dude');
    player2.isDead = "false"
    player2.name = "player2"

    // Player2 physics properties. Give the little guy a slight bounce.
    player2.setBounce(0.1)
    player2.setCollideWorldBounds(false)

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    // end player 2 */
    
    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    z = this.input.keyboard.addKey("z")
    q = this.input.keyboard.addKey("q")
    d = this.input.keyboard.addKey("d")
    e = this.input.keyboard.addKey("e")

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(stars, platforms);
    //collision entre joueur
    this.physics.add.collider(player1, player2, punch);

    //Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player1, stars, collectStar, null, this);
    this.physics.add.overlap(player2, stars, collectStar, null, this);

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, bombs);
    this.physics.add.collider(bombs, player1);
    this.physics.add.collider(bombs, player2, explode);
    this.physics.add.collider(bombs, stars, explode);

}

function update ()
{   
    //vérifie pour chaque joueur s'il est vivant ou non
    function isDead (player) {
        if (player.y > 720){
            player.isDead = "true"
            console.log("Is Dead"+player.y)
            player.disableBody(true, true)
        } else {
            return false
        }
    }
    //if (!isDead(player1)) {}
    //if (!isDead(player2)) {}
    //player 1 controll
    if (cursors.left.isDown)
    {
        player1.setVelocityX(-veloX/malusX);
        player1.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player1.setVelocityX(veloX/malusX);
        player1.anims.play('right', true);
    }
    else
    {
        player1.setVelocityX(0);
        player1.anims.play('turn');
    }
    if (cursors.up.isDown && player1.body.touching.down)
    {
        player1.setVelocityY(veloY/malusY);
    }
    ///
    //player 2 controll
    if (q.isDown) //si on caresse le Q
    {
        player2.setVelocityX(-veloX/malusX);
        player2.anims.play('left', true);
    }
    else if (d.isDown) // si on touch THE D
    {
        player2.setVelocityX(veloX/malusX);
        player2.anims.play('right', true);
    }
    else
    {
        player2.setVelocityX(0);
        player2.anims.play('turn');
    }
    if (z.isDown && player2.body.touching.down)
    {
        player2.setVelocityY(veloY/malusY);
    }
    //créer les bombes 
    if(this.input.activePointer.justDown){
        let bomb = bombs.create(player1.x, player1.y, 'bomb');
        bomb.setBounce(0.8);
        bomb.setCollideWorldBounds(false);
        bomb.setVelocity(-(player1.x - this.input.activePointer.downX)*1.5,-(player1.y - this.input.activePointer.downY)*1.5);
        bomb.allowGravity = false;
    }
}

function punch (player1, player2){
    //function punching 
    function punching (victime, sens){
        if (sens == 1){}
        else if (sens == 2){ puncheForce = (-punchForce);}
        victime.setAccelerationX(punchForce)
            //Créer un variation au cours du temps de l'acceleration
            setTimeout(() => {victime.setAccelerationX(punchForce/2)}, 250)
            setTimeout(() => {victime.setAccelerationX(punchForce/3)}, 450)
            setTimeout(() => {victime.setAccelerationX(0)}, 500)
    }
    if(e.isDown && d.isDown){
        punching(player1, 1)
    }
    else if(e.isDown && q.isDown){
        punching(player1, 2)
    }
    if(cursors.right.isDown && e.isDown){
        punching(player2, 1)
    }
    else if(cursors.left.isDown && e.isDown){
        punching(player2, 2)
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });
    }
}
//
//-(player.x - bomb.x),
//-(player.y - bomb.y),
//

function explode (player, bomb){
    function explose ( victime ){
        let xForce = bombForceX*((player.x - bomb.x))
        let yForce = bombForceY*((player.y - bomb.y)/10)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        victime.setAccelerationX(xForce)
        victime.setAccelerationY(yForce)
            //Créer un variation au cours du temps de l'acceleration
            setTimeout(() => {
                victime.setAccelerationX(xForce/2)
                victime.setAccelerationY(yForce/2)
            }, 250)
            setTimeout(() => {
                victime.setAccelerationX(xForce/3)
                victime.setAccelerationY(yForce/3)
            ;}, 450)
            setTimeout(() => {
                victime.setAccelerationX(0)
                victime.setAccelerationY(0)
            }, 500)
    }
    explose(player)
    bomb.destroy()
}
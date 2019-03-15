var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

let players = {}
let bomb = {
  id : "",
  x : "",
  y : "",
  vx : "",
  vy : ""
}
let potion ={
  x : "",
  y : ""
}
let howManyPotion = 0
let chargeur ={
  x:"",
  y:""
}
let howManyChargeur = 0

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);
  // create a new player and add it to our players object
  players[socket.id] = {
    //x et y gère la position dans l'espace 2D des joueurs
    x: Math.floor(Math.random() * Math.floor(2))==0?Math.floor(Math.random() * Math.floor(1000)): -(Math.floor(Math.random() * Math.floor(1400))),
    y: Math.floor(Math.random() * Math.floor(2))==0?-1400:0,
    state: 5,
    //input gère le déclenchement des animations
    input: "",
    //stock l'id
    playerId: socket.id
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    // à la déconnexion supprime le joueur déconnecter
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  // when a player moves, update the player data
  socket.on('playerMovement', function (data) {
    //Le serveur récupère tout changement de position et le stock à la bonne personne à l'aide de l'ID
    players[data.id].x = data.x;
    players[data.id].y = data.y;
    players[data.id].state = data.state;
    players[data.id].input = data.input;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });
  
  socket.on('bombs', function (data){
    bomb.id = data.id
    bomb.x = data.x
    bomb.y = data.y
    bomb.vx = data.vx
    bomb.vy = data.vy
    socket.broadcast.emit('OtherBombs', bomb)
  })
  const createPotion=()=>{
    if(howManyPotion <1){
      potion.x = Math.floor(Math.random() * Math.floor(2))==0?Math.floor(Math.random() * Math.floor(1000)): -(Math.floor(Math.random() * Math.floor(1400)))
      potion.y = Math.floor(Math.random() * Math.floor(2))==0?-1400:0
      socket.emit('potions', potion)
      return howManyPotion++
    }
  }
  createPotion()

  socket.on('howManyPotion', function(boolean){
    if(boolean){
      howManyPotion--
      createPotion()
    }
  })

  const createChargeur=()=>{
    if(howManyChargeur <1){
      chargeur.x = Math.floor(Math.random() * Math.floor(2))==0?Math.floor(Math.random() * Math.floor(1000)): -(Math.floor(Math.random() * Math.floor(1400)))
      chargeur.y = Math.floor(Math.random() * Math.floor(2))==0?-1400:0
      socket.emit('chargeurs', chargeur)
      return howManyChargeur++
    }
  }
  createChargeur()

  socket.on('howManyChargeur', function(boolean){
    if(boolean){
      howManyChargeur--
      createChargeur()
    }
  })
});

// config for heroku
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8081;
}

server.listen(port, function () {
  console.log(`Listening on ${server.address().port}`);
});

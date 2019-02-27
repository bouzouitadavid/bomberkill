// Reference express module
const express = require('express');
// New instance of express
const app = express();
// Supply app to HTTP server => allow express to handle HTTP requests
const server = require('http').Server(app);
// Reference socket.io module and listen server object
const io = require('socket.io').listen(server);

// Middleware to render static files
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/assets'));

// Serves index.html as root page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Listen to events
io.on('connection', (socket) => {
    console.log('A player connected');

    socket.on('disconnect', () => {
        console.log('Player disconnected');
    })
})

// Server listen on port
server.listen(8081, () => {
    console.log(`Listening on ${server.address().port}`);
});
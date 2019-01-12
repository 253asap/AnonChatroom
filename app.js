//setting up dependencies
const express = require('express');
const socket = require('socket.io');

//Injection security
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

//express server setup and middleware for MVC
const app = express();
const server = app.listen(process.env.PORT || 5000,() => {console.log(`Server has started...`)});
app.use(express.static('client_side'));

//socket and server interactions
const io = socket(server);
let currentUsers = 0;

io.on('connection',(socket) => {
    console.log(`Someone has connected`);
    currentUsers += 1;
    io.emit('userCount', `User Online: ${currentUsers}`);
    socket.on('chatMessage', (data)=>{
        data.imageUrl = DOMPurify.sanitize(data.imageUrl, {ALLOWED_TAGS: ['b']});
        data.message = DOMPurify.sanitize(data.message, {ALLOWED_TAGS: ['b']});
        socket.broadcast.emit('chatMessage', data)
        });
    socket.on('disconnect', ()=>{
        currentUsers -= 1;
        io.emit('userCount', `User Online: ${currentUsers}`);
    })
});

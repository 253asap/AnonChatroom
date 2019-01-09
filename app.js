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

io.on('connection',(socket) => {
    console.log(`Someone has connected`, socket.id);
    socket.on('chatMessage', (data)=>{
        data.imageUrl = DOMPurify.sanitize(data.imageUrl, {ALLOWED_TAGS: []});
        data.message = DOMPurify.sanitize(data.message, {ALLOWED_TAGS: []});
        socket.broadcast.emit('chatMessage', data)
        });
});

//connecting to server
const socket = io.connect('https://anonchatv1.herokuapp.com/');
//DOM elements
const LOGINBTN = document.getElementById('loginSend');
const IMAGEURL = document.getElementById('imageUrl');
const LOGINSCREEN = document.getElementById('login');
const CHATBOX = document.getElementById('chatBox');
const CHATWINDOW = document.getElementById('chat');
const PROFILEIMG = document.getElementById('profileImg');
const CHATSEND = document.getElementById('sendBtn');
const MESSAGE = document.getElementById('message');
const MUTEBTN = document.getElementById('mute');
const USERSON = document.getElementById('users');
let image = 'Anon.png';
let muteSound = false;
let messageSound = new Audio('messageSound.ogg');

//Login screen
LOGINBTN.addEventListener('click', ()=>{
    LOGINSCREEN.style.display = 'none'
    CHATBOX.style.display = 'block'
    if(IMAGEURL.value != ''){
        image = IMAGEURL.value;
    }
    PROFILEIMG.src = image;
})

//reduce possible spam
let sendMessage = true;
setInterval(()=>{sendMessage = true},1500);

//chat functions
const sendChat = ()=>{
    if(MESSAGE.value == '' || sendMessage == false){
        console.log('please enter a message or wait 1.5secs');
        return false;
    }
    socket.emit('chatMessage',{imageUrl:image,message:MESSAGE.value});
    let time = new Date().toLocaleTimeString();
    CHATWINDOW.innerHTML += `<div class="myChatMessage">
                    <img id="profileImg" src="${image}" alt="">
                    <div><p class="time">${time}</p><p>${MESSAGE.value}</p></div>
                </div>`
    MESSAGE.value = '';
    sendMessage = false;
    CHATWINDOW.scrollTo(0,CHATWINDOW.scrollHeight);
}
const mute = ()=>{
    if(muteSound == false){
        muteSound = true;
        MUTEBTN.style.backgroundColor = 'rgb(148, 41, 33)';
        MUTEBTN.innerHTML = 'Sound Off';
    }
    else{
        muteSound = false;
        MUTEBTN.style.backgroundColor = 'rgb(46, 148, 33)'
        MUTEBTN.innerHTML = 'Sound On';
    }
}

CHATSEND.addEventListener('click', sendChat);
MESSAGE.addEventListener('keypress',(e)=>{
    if(e.keyCode == 13){
        sendChat();
    }
});
MUTEBTN.addEventListener('click', mute);

//Listen for server events
socket.on('chatMessage', (data)=>{
    let time = new Date().toLocaleTimeString();
    CHATWINDOW.innerHTML += `<div class="chatMessage">
                    <img id="profileImg" src="${data.imageUrl}" alt="">
                    <div><p class="time">${time}</p><p>${data.message}</p></div>
                </div>`
    CHATWINDOW.scrollTo(0,CHATWINDOW.scrollHeight);
    if(muteSound == false){
        messageSound.play();
    }
});
socket.on('userCount', (userCount)=>{
    USERSON.innerHTML = userCount;
})
let canvas, ctx;

let prevTime = 0.0;
let delta = 0.0; 

const screen = {w:1920, h:1080}; 
let   scroll = {x:0, y:0}
const speed  = {x:-50, y:50}
const blockSize = 100;

let apikey = "";
let userName = "";
let gameId = 0;

let gameName = "Rising Zan: Samurai Gunman";
let gameSystem = "PlayStation";
let completion = "69.420%";

function init() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = screen.h;
    canvas.width = screen.w;

    prevTime = Date.now();

    fetch("apikey.json")
        .then(res => res.json())
        .then(data => {
            apikey = data.apiKey;
        })

    fetch("config.json")
        .then(res => res.json())
        .then(data => {
            userName = data.userName;
            gameId = data.gameId;
            searchGame();
        })
}

function render() {
    // clear background
    ctx.fillStyle = "darkgray";
    ctx.fillRect(0,0,screen.w,screen.h);

    // draw checkerboard pattern
    ctx.fillStyle = "gray";
    for (let i = 0; i<Math.ceil(screen.w/blockSize)+1; i++) {
            for (let j = 0; j<Math.ceil(screen.h/blockSize)+1; j+=2) {
            ctx.fillRect( 
                (i*blockSize)-blockSize+((i%2)*blockSize)+scroll.x, 
                (j*blockSize)+-blockSize+scroll.y, 
                blockSize, 
                blockSize); 
            ctx.fillRect( 
                (i*blockSize)+((i%2)*blockSize)+scroll.x, 
                (j*blockSize)+scroll.y, 
                blockSize, 
                blockSize); 
        }
    }

    // draw game and console
    drawOutlinedText(50,50,48,gameName);
    drawOutlinedText(50,98,24,gameSystem);

    // draw completion bar
    ctx.fillStyle = "black";
    ctx.fillRect(20,screen.h-50-20,screen.w-40,50);
    ctx.fillStyle = "yellow";
    ctx.fillRect(30, screen.h-50-20+10, (screen.w-40-20)*(Number.parseFloat(completion)/100), 30)

    //console.log(Number.parseFloat(completion));
}

function update() {
    let now = Date.now();
    delta = (now - prevTime) / 1000;
    prevTime = now;

    scroll.x += speed.x * delta;
    if ( Math.abs(scroll.x) > blockSize) { scroll.x %= blockSize; }
    scroll.y += speed.y * delta;
    if (Math.abs(scroll.y) > blockSize ) { scroll.y %= blockSize; }
}

function run() {
    render();
    update();
    requestAnimationFrame(run);
}

function drawOutlinedText(x, y, size, text) {
    ctx.font = `${size}px monospace`;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "white";
    ctx.fillText(text,x,y);
}

function searchGame() {
    if (!isNaN(gameId) && gameId > 0) {
        /* fetch(`https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?g=${gameId}&u=${userName}&y=${apikey}`)
            .then(res => res.json())
            .then(data => {
                gameName = data.Title;
                gameSystem = data.ConsoleName;
                completion = data.UserCompletionHardcore
                console.log(data);
                document.getElementById("output").innerHTML=`${gameName} [${gameSystem}]<br/>${completion}`
                console.log(gameId);
            }) */
    } else {
        // document.getElementById("output").innerHTML="Oops!";
    }
}

window.onload = function() {
    init();
    run();
}


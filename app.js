let canvas, ctx;

let prevTime = 0.0;
let delta = 0.0; 

const screen = {w:1920, h:1080}; 
let   scroll = {x:0, y:0}
const speed  = {x:-100, y:100}
const blockSize = 200;

let apikey = "";
let userName = "";
let gameId = 0;

let gameName = "Rising Zan: Samurai Gunman";
let gameSystem = "PlayStation";
let completion = "420.69%";

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
    // ctx.clearRect(0,0,screen.w,screen.h);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,screen.w,screen.h);

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


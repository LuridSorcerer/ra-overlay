let canvas, ctx;

let clock = { time: 0.0, prevTime: 0.0, delta: 0.0 }

const screen = {w:1920, h:1080}; 
let   scroll = {x:0, y:0}
let   speed  = {x:-50, y:50}
let   blockSize = 100;
let   color1 = "darkgray";
let   color2 = "lightgray";

let apikey = "";
let userName = "";
let gameId = 0;

let gameName = "Loading...";
let gameSystem = "Loading...";
let completion = { s:"Loading...", x:0 }

function init() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = screen.h;
    canvas.width = screen.w;

    clock.time = clock.prev = Date.now();

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
            color1 = data.color1;
            color2 = data.color2;
            blockSize = data.blockSize;
            speed.x = data.speed.x;
            speed.y = data.speed.y;
            searchGame();
        })
        
        updateCompletionString("69.420");
}

function render() {
    // clear background
    ctx.fillStyle = color1;
    ctx.fillRect(0,0,screen.w,screen.h);

    // draw checkerboard pattern
    ctx.fillStyle = color2;
    // for each column
    for (let i = -1; i<Math.ceil(screen.w/blockSize); i++) {
			// for every other row
			let rowOffset = (i%2)*blockSize; 
            for (let j = -1; j<Math.ceil(screen.h/blockSize)+1; j+=2) {
            ctx.fillRect( 
                (i*blockSize)-blockSize+(rowOffset)+scroll.x, 
                (j*blockSize)+-blockSize+scroll.y, 
                blockSize, 
                blockSize); 
            ctx.fillRect( 
                (i*blockSize)+(rowOffset)+scroll.x, 
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
    ctx.fillRect(30, screen.h-50-20+10, (screen.w-40-20)*(Number.parseFloat(completion.s)/100), 30)

    // draw completion percentage
    drawOutlinedText(
		completion.x,
        screen.h-50-20,
        48,
        completion.s);
}

function update() {
	// update clock
    clock.time = Date.now();
    clock.delta = (clock.time - clock.prevTime) / 1000;
    clock.prevTime = clock.time;

	// scroll background
    scroll.x += speed.x * clock.delta;
    if ( Math.abs(scroll.x) > blockSize) { scroll.x %= blockSize; }
    scroll.y += speed.y * clock.delta;
    if (Math.abs(scroll.y) > blockSize ) { scroll.y %= blockSize; }
}

function run() {
    render();
    update();
    requestAnimationFrame(run);
}

function updateCompletionString(text) {
	ctx.font = "48px monospace";
	completion.s = text;
	completion.x = (screen.w/2)-(ctx.measureText(completion.s).width/2);
}

function drawOutlinedText(x, y, size, text) {
    ctx.font = `${size}px monospace`;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "white";
    ctx.fillText(text,x,y);
}

function searchGame() {
    if (!isNaN(gameId) && gameId > 0) {
        fetch(`https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?g=${gameId}&u=${userName}&y=${apikey}`)
            .then(res => res.json())
            .then(data => {
                gameName = data.Title;
                gameSystem = data.ConsoleName;
                updateCompletionString(data.UserCompletionHardcore);
            })
            .catch(e => {
                gameName = `Error occured: ${e}`;
            });
    } else {
        console.log("Oops!")
    }
}

window.onload = function() {
    init();
    run();
}
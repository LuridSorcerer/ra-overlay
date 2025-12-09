let canvas, ctx;
let clock = { time: 0.0, prevTime: 0.0, delta: 0.0 }
const screen = {w:1920, h:1080}; 

let apikey = "";
let userName = "";
let gameId = 0;

let gameName = "Loading...";
let gameSystem = "Loading...";
let completion = { s:"Loading...", x:0 }

let bg = { canvas: null, ctx: null, w: 1920, h: 1080, 
	blocksize: 100, color1: "darkgray", color2: "gray",
	scroll: {x: 0, y: 0}, speed: {x: 50, y: 50}, 
	init: function () {
		// create canvas and context
		this.canvas = document.createElement('canvas');	
		this.canvas.width = this.w;
		this.canvas.height = this.h;
		this.ctx = this.canvas.getContext('2d');
	}, 
	update: function (delta) { 	
		// scroll background
		this.scroll.x += this.speed.x * delta;
		if ( Math.abs(this.scroll.x) > this.blocksize*2) {
			this.scroll.x %= this.blocksize*2;
		}
		this.scroll.y += this.speed.y * delta;
		if ( Math.abs(this.scroll.y) > this.blocksize*2) {
			this.scroll.y %= this.blocksize*2;
		}
	},
	render: function () {
		// clear background
		this.ctx.fillStyle = this.color1;
		this.ctx.fillRect(0,0,this.w,this.h);

		// draw checkerboard pattern
		this.ctx.fillStyle = this.color2;
		// for each column
		for (let i = -1; i<Math.ceil(this.w/this.blockSize); i++) {
			// for every other row
			let rowOffset = (i%2)*this.blockSize; 
			for (let j = -1; j<Math.ceil(this.h/this.blockSize)+1; j+=2) {
			// upper-left square
			this.ctx.fillRect( 
				(i*this.blocksize) -this.blocksize + rowOffset + this.scroll.x,
				(j*this.blocksize) - this.blocksize + this.scroll.y,
				this.blocksize, 
				this.blocksize);
			 // lower-right square
			this.ctx.fillRect( 
				(i*this.blocksize) + rowOffset + this.scroll.x,
				(j*this.blocksize) + this.scroll.y,
				this.blockSize, 
				this.blockSize);
			}
		}
	} 
}

function init() {

	bg.init();

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
            bg.color1 = data.color1;
            bg.color2 = data.color2;
            bg.blockSize = data.blockSize;
            bg.speed.x = data.speed.x;
			bg.speed.y = data.speed.y;
            searchGame();
        })
}

function render() {
	// blit bg canvas
	bg.render();
	ctx.drawImage(bg.canvas, 0,0);
	
    // draw game and console
    drawOutlinedText(50,50,48,gameName);
    drawOutlinedText(50,98,24,gameSystem);

    // draw completion bar
    drawOutlinedText(24, screen.h-50-20, 24, "Achievements" );
    ctx.fillStyle = "black";
    ctx.fillRect(20,screen.h-50-20,screen.w-40,50);
    ctx.fillStyle = "yellow";
    ctx.fillRect(30, screen.h-50-20+10, (screen.w-40-20)*(Number.parseFloat(completion.s)/100), 30)

    // draw completion percentage
    drawOutlinedText(
		completion.x,
        screen.h-30,
        48,
        completion.s);
}

function update() {
	// update clock
    clock.time = Date.now();
    clock.delta = (clock.time - clock.prevTime) / 1000;
    clock.prevTime = clock.time;

	// update bg
	bg.update(clock.delta);
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
    ctx.lineWidth = 4;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "white";
    ctx.fillText(text,x,y);
}

function searchGame() {
    if (!isNaN(gameId) && gameId > 0) {
        fetch(`https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?g=${gameId}&u=${userName}&y=${apikey}`)
            .then(res => {
                if (!res.ok) {
                    throw new error (`HTTP error: ${res.status}`);
                }
                return res.json();
            })
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

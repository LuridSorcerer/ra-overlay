let canvas, ctx;
const screen = {w:1920, h:1080}; 

let apikey = "";
let userName = "";
let gameId = 0;

let gameName = "Loading...";
let gameSystem = "Loading...";
let completion = { s:"Loading...", x:0 }

import { bg } from "./bg.mjs";
import { clock } from "./clock.mjs";

function init() {
    clock.init();
	bg.init();

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = screen.h;
    canvas.width = screen.w;

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
    clock.update();

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

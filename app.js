let canvas, ctx;
const screen = {w:1920, h:1080}; 

import { bg } from "./bg.mjs";
import { clock } from "./clock.mjs";
import { ra_overlay } from "./ra_overlay.mjs";

function init() {
    clock.init();
	bg.init();
    ra_overlay.init();

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = screen.h;
    canvas.width = screen.w;

    fetch("apikey.json")
        .then(res => res.json())
        .then(data => {
            ra_overlay.apikey = data.apiKey;
        })

    fetch("config.json")
        .then(res => res.json())
        .then(data => {
            ra_overlay.userName = data.userName;
            ra_overlay.gameId = data.gameId;
            bg.color1 = data.color1;
            bg.color2 = data.color2;
            bg.blockSize = data.blockSize;
            bg.speed.x = data.speed.x;
			bg.speed.y = data.speed.y;
            ra_overlay.searchGame();
        })
}

function render() {
	// blit bg canvas
	bg.render();
	ctx.drawImage(bg.canvas, 0,0);

    // blit ra_overlay canvas
    ra_overlay.render();
    ctx.drawImage(ra_overlay.canvas, 0, 0);
}

function update() {
    clock.update();
	bg.update(clock.delta);
    ra_overlay.update();
}

function run() {
    render();
    update();
    requestAnimationFrame(run);
}

window.onload = function() {
    init();
    run();
}

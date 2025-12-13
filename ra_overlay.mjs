const ra_overlay = {
    canvas: null, ctx: null, w: 1920, h: 1080, 
    apikey: "", userName: "", gameId: 0, 
    gameName: "Loading...", gameSystem:  "Loading...", completion: { s:"0", x:0 }, 

    init: function() {
		// create canvas and context
		this.canvas = document.createElement('canvas');	
		this.canvas.width = this.w;
		this.canvas.height = this.h;
		this.ctx = this.canvas.getContext('2d');
    },

    update: function () {
        // todo: perform check to see if an update is required

    }, 

    render: function () {
        // todo: perform check to see if re-render is required

        // clear canvas
        this.ctx.clearRect(0,0,this.w,this.h);

        // draw game and console
        this.drawOutlinedText(50,50,48,this.gameName);
        this.drawOutlinedText(50,98,24,this.gameSystem);

        // draw completion bar
        this.drawOutlinedText(24, this.h-50-20, 24, "Achievements" );
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
            20,
            this.h-50-20,
            this.w-40,
            50);
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(
            30, 
            this.h-50-20+10, 
            (this.w-40-20)*(Number.parseFloat(this.completion.s)/100),
            30);

        // draw completion percentage
        this.drawOutlinedText(
            this.completion.x,
            this.h-30,
            48,
            this.completion.s);
    }, 

    drawOutlinedText: function(x, y, size, text) {
        this.ctx.font = `${size}px monospace`;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 4;
        this.ctx.strokeText(text, x, y);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(text,x,y);
    },

    searchGame: function() {
        if (!isNaN(this.gameId) && this.gameId > 0) {
            fetch(`https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?g=${this.gameId}&u=${this.userName}&y=${this.apikey}`)
                .then(res => {
                    if (!res.ok) {
                        throw new error (`HTTP error: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    this.gameName = data.Title;
                    this.gameSystem = data.ConsoleName;
                    this.completion.s = data.UserCompletionHardcore;
                    this.ctx.font = "48px monospace";
                    this.completion.x = (this.w/2)-(this.ctx.measureText(this.completion.s).width/2);
                })
                .catch(e => {
                    this.gameName = `Error occured: ${e}`;
                    console.log(`Error occured: ${e}`)
                });
        } else {
            console.log("Oops!")
        }
    }


};

export { ra_overlay };
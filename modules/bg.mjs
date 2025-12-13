const bg = { 
    canvas: null, ctx: null, w: 1920, h: 1080, 
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

export { bg }; 
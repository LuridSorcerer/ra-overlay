const clock = {
    time: 0.0, prevTime: 0.0, delta: 0.0,

    init: function () {
        this.time = this.prevTime = Date.now();
    },

    update: function () {
        this.time = Date.now();
        this.delta = (this.time - this.prevTime) / 1000;
        this.prevTime = this.time;
    }

}

export { clock };
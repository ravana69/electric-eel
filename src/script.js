var c, cx,
    width,
    height,
    w,
    nest,
    spore = false,
    tau = Math.PI * 2,
    centre = {x: 0, y: 0},
    resetSwitch = document.getElementById('reset');

resetSwitch.onclick = function(e) {
    e.preventDefault();
    init();
};

var Nest = function(x, y) {

    this.x = x;
    this.y = y;

    this.radius = 20;
    this.r = Math.floor(Math.random() * 128) + 127;
    this.g = Math.floor(Math.random() * 64);
    this.b = Math.floor(Math.random() * 64);

    this.draw = function() {
        cx.beginPath();
        cx.arc(this.x, this.y, this.radius, 0, tau);
        cx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ', 1)';
        cx.fill();
    }

}

var Walker = function(x, y) {

    this.x = x;
    this.y = y;
    this.stride = 8;
    this.size = 20;
    this.segments = [{x: x, y: y}];

    this.radius = Math.floor(Math.random() * 10) + 2;
    this.r = Math.floor(Math.random() * 128) + 127;
    this.g = Math.floor(Math.random() * 64);
    this.b = Math.floor(Math.random() * 64);

    this.define = function() {
        if (Math.random() > 0.5) this.radius = Math.floor(Math.random() * 10) + 2;
        if (Math.random() > 0.98) {
            this.r = Math.floor(Math.random() * 128) + 127;
            this.g = Math.floor(Math.random() * 64);
            this.b = Math.floor(Math.random() * 64);
        }
    }

    this.draw = function() {
        for (var s = 0; s < this.segments.length; s++) {
            var segment = this.segments[s];
            cx.beginPath();
            cx.arc(segment.x, segment.y, this.radius, 0, tau);
            cx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ', 1)';
            cx.fill();
        }
    }

    this.step = function() {

        var willSeekNest = Math.random();

        if (willSeekNest > 0.8) {

            if (this.x < nest.x) {
                this.x += this.stride;
            } else {
                this.x -= this.stride;
            }
            if (this.y < nest.y) {
                this.y += this.stride;
            } else {
                this.y -= this.stride;
            }

        } else {

            var choice = Math.floor(Math.random() * 4);

            if (choice == 0) {
                this.x += this.stride;
            } else if (choice == 1) {
                this.x -= this.stride;
            } else if (choice == 2) {
                this.y += this.stride;
            } else {
                this.y -= this.stride;
            }
        }

        if (! spore) {
            this.segments.push({x:this.x, y: this.y});
            if (this.segments.length > this.size) {
                this.segments.shift();
            }
        } else {
            this.segments = [{x:this.x, y: this.y}];
        }
    }

    this.hasFoundNest = function() {
        if ((this.x >= nest.x - 5 && this.x <= nest.x + 5) && (this.y >= nest.y - 5 && this.y <= nest.y + 5)) {
            this.size += 5;
            return true;
        }
        return false;
    }
}

function run() {
    window.requestAnimationFrame(run);
    if (! spore) {
        cx.clearRect(0, 0, width, height);
        nest.draw();
    }
    w.define();
    w.draw();
    w.step();
    if (w.hasFoundNest()) {
        createNest();
    }
}

function createNest() {
    var x = Math.random() * width;
    var y = Math.random() * height;
    nest = new Nest(x, y);
    nest.draw();
}

function init() {
    c = document.querySelector('canvas');
    width = c.width = window.innerWidth;
    height = c.height = window.innerHeight;
    cx = c.getContext('2d');
    window.addEventListener('resize', function() {
      width = c.width = window.innerWidth ;
      height = c.height = window.innerHeight ;
    }, false);
    cx.globalCompositeOperation = 'lighter';
    centre.x = width / 2;
    centre.y = height / 2;

    w = new Walker(centre.x, centre.y);
    createNest();
}

init();

run();

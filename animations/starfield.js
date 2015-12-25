/* Logan Girvin
 * Copyright 2015
 * starfield takes a HTML5 canvas element and animates an interactive
 * 'warp' effect using the mouse cursor.
 * @requires no other script to draw to the canvas after the function
 */
function starfield(canvas) {
    // constants.
    var CANVAS = canvas;
    var CTX = canvas.getContext("2d");
    var SIZE = 50; //px
    var BEZIER = function(t) {
        // (1-t)^3 P0 + 3 (1 - t)^2 t P1 + 3(1 - t)t^2 P2 + t^3 P3
        return 0 + 0 + 3 * (1 - t) * Math.pow(t, 2) * 1 + Math.pow(t, 3) * 1;
    }
    var MULTIPLIER = 5;
    // fields.
    // must be a field for canvas re-sizing.
    var width = canvas.width;
    var height = canvas.height;
    // star data
    function Stars() {
        var spread = 100000;
        var imageZ = 1;
        this.x = width / 2;
        this.y = height / 2;
        this.stars = new Array();
        this.addStar = function(x, y) {
            var pos = new Array(3);
            pos[0] = Math.random() * spread - spread / 2;
            pos[1] = Math.random() * spread - spread / 2;
            pos[2] = 1000;
            this.stars.unshift(pos);
        };
        // updates the xy position coordinates.
        window.addEventListener("mousemove", function(e) {
            var bound = canvas.getBoundingClientRect();
            this.x = e.clientX - bound.left;
            this.y = e.clientY - bound.top;
        });
        // updates all the stars in the field and removes any
        this.update = function(step) {
            var rm = new Array();
            var star = this.stars;
            star.forEach(function(item, index, array) {
                item[2] = item[2] - step;
                // due to shifting xy, this is the only checkable condition.
                if (item[2] < 0) {
                    rm.unshift(index);
                }
            });
            var offset = 0;
            rm.forEach(function(item, index, array) {
                star.splice(item - offset, 1);
                offset++;
            });
        }
        // draws the stars using CTX and SIZE
        this.draw = function() {
            // clear the screen.
            CTX.fillStyle = "#000000";
            CTX.fillRect(0, 0, width, height);
            // draw stars!
            CTX.fillStyle = "#ffffff";
            CTX.beginPath();
            this.stars.forEach(function(item, index, array) {
                // using similar triangles...
                var dx = ((this.x * MULTIPLIER - item[0]) * imageZ) / item[2];
                var dy = ((this.y * MULTIPLIER - item[1]) * imageZ) / item[2];
                if (item[2] > 0) 
                    CTX.arc(width / 2 + dx, height / 2 - dy, SIZE / item[2], 0, 2 * Math.PI, false);
                CTX.closePath();
            });
            CTX.fill();
        }
    }
    var data = new Stars();
    
    // Two stage animation
    // 1) Fade to black
    // 2) load the main loop/starfield.
    
    // fades the canvas to black.
    function fade(val) {
        CTX.fillStyle = "rgba(0, 0, 0, 0.05)";
        CTX.fillRect(0, 0, width, height);
        for(var i = 0; i < 10; i++) {
            data.addStar();
        }
        data.update(Math.random() * 100);
        if (val <= 100)
            setTimeout(fade, 10, val + 1);
        else {
            loop(0);
        }
    }
    
    // loop of starfield scrolling. Eases in.
    function loop(t) {
        var speed = 1;
        if (t < 1) {
            speed = BEZIER(t);
        }
        speed *= MULTIPLIER;
        data.addStar();
        data.update(speed);
        data.draw();
        setTimeout(loop, 100, t + 0.005);
    }
    
    // callbacks.
    canvas.addEventListener("resize", function() {
        width = CANVAS.width;
        height = CANVAS.height;
    })
    
    // init.
    fade(0);
};
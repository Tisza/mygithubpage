(function() {

    // ID shortcut
    function $(id) {
        document.getElementById(id);
    }

    // canvas context
    var ctx;
    var fg = "#0099CC";
    var bg = "#ffffff";

    // onload
    window.addEventListener("load", function() {
        var canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        /*document.querySelector("header").addEventListener("resize", function() {
            console.log("eeeey");
        })*/
        draw(ctx, Shapes[Math.round(Math.random() * (Shapes.length - 1))]);
    });

    function draw(ctx, data) {
        var color;
        var srt = null;
        var scale = 1;
        for(var i = 0; i < data.length; i++) {
            if(data[i] != "fg" || data[i] != "bg") {
                if(800 / data[i].x < scale) {
                    scale = 800 / data[i].x;
                }
                if(100 / data[i].y < scale) {
                    scale = 100 / data[i].y;
                }
            }
        }

        for(var i = 0; i < data.length; i++) {
            if(data[i] == "fg") {
                color = fg;
            } else if (data[i] == "bg") {
                color = bg;
            } else {
                var x = data[i].x * scale;
                var y = data[i].y * scale;
                if(srt == null) {
                    srt = data[i];
                    ctx.beginPath();
                    ctx.moveTo(x, 100 - y);
                } else if (srt.x * scale == x && srt.y * scale == y) {
                    ctx.lineTo(srt.x * scale, 100 - srt.y * scale);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.closePath();
                    srt = null;
                } else {
                    ctx.lineTo(x, 100 - y);
                }
            }
        }
    }

    function p(px, py) {
        this.x = px;
        this.y = py;
    }

    var Shapes = new Array();

    // Mt. Rainier
    Shapes[0] = new Array();
    var i = 0;
    Shapes[0][i] = "fg";
    i++;
    Shapes[0][i] = new p(0.5, 0.5);
    i++;
    Shapes[0][i] = new p(201.125, 108.159);
    i++;
    Shapes[0][i] = new p(278.485, 91.496);
    i++;
    Shapes[0][i] = new p(343.380, 115.863);
    i++;
    Shapes[0][i] = new p(376.863, 111.909);
    i++;
    Shapes[0][i] = new p(724.556, 296.157);
    i++;
    Shapes[0][i] = new p(733.329, 275.220);
    i++;
    Shapes[0][i] = new p(777.189, 293.843);
    i++;
    Shapes[0][i] = new p(797.944, 277.342);
    i++;
    Shapes[0][i] = new p(855.790, 270.146);
    i++;
    Shapes[0][i] = new p(853.925, 257.704);
    i++;
    Shapes[0][i] = new p(842.464, 245.072);
    i++;
    Shapes[0][i] = new p(868.939, 216);
    i++;
    Shapes[0][i] = new p(827.204, 240.402);
    i++;
    Shapes[0][i] = new p(827.657, 203.527);
    i++;
    Shapes[0][i] = new p(893.997, 153.149);
    i++;
    Shapes[0][i] = new p(962.898, 146.064);
    i++;
    Shapes[0][i] = new p(890.654, 131.815);
    i++;
    Shapes[0][i] = new p(879.136, 113.244);
    i++;
    Shapes[0][i] = new p(915.367, 87.145);
    i++;
    Shapes[0][i] = new p(922.781, 107.602);
    i++;
    Shapes[0][i] = new p(962.985, 83.655);
    i++;
    Shapes[0][i] = new p(935.921, 138.355);
    i++;
    Shapes[0][i] = new p(1113.70, 49.188);
    i++;
    Shapes[0][i] = new p(1269.03, 28.011);
    i++;
    Shapes[0][i] = new p(1255.04, 53.830);
    i++;
    Shapes[0][i] = new p(1329.98, 49.216);
    i++;
    Shapes[0][i] = new p(1345.76, 30.531);
    i++;
    Shapes[0][i] = new p(1403.04, 40.498);
    i++;
    Shapes[0][i] = new p(1558.97, 0.5);
    i++;
    Shapes[0][i] = new p(0.5, 0.5);
    i++;
    Shapes[0][i] = "bg";
    i++;
    Shapes[0][i] = new p(737.161, 127.784);
    i++;
    Shapes[0][i] = new p(874.504, 69.632);
    i++;
    Shapes[0][i] = new p(807.870, 67.443);
    i++;
    Shapes[0][i] = new p(737.161, 127.784);
    i++;
    Shapes[0][i] = "fg";
    i++;
    Shapes[0][i] = new p(891.543, 227.860);
    i++;
    Shapes[0][i] = new p(985.738, 160.205);
    i++;
    Shapes[0][i] = new p(1021.22, 125.996);
    i++;
    Shapes[0][i] = new p(959.820, 149.247);
    i++;
    Shapes[0][i] = new p(891.543, 227.860);
    i++;
    Shapes[0][i] = "fg";
    i++;
    Shapes[0][i] = new p(956.523, 218.876);
    i++;
    Shapes[0][i] = new p(993.233, 208.964);
    i++;
    Shapes[0][i] = new p(1114.83, 106.835);
    i++;
    Shapes[0][i] = new p(1200.80, 74.284);
    i++;
    Shapes[0][i] = new p(1221.66, 54.755);
    i++;
    Shapes[0][i] = new p(1186.80, 69.781);
    i++;
    Shapes[0][i] = new p(1156.21, 77.873);
    i++;
    Shapes[0][i] = new p(1128.29, 97.170);
    i++;
    Shapes[0][i] = new p(1103.93, 100.413);
    i++;
    Shapes[0][i] = new p(1064.06, 114.264);
    i++;
    Shapes[0][i] = new p(987.459, 169.358);
    i++;
    Shapes[0][i] = new p(965.660, 186.834);
    i++;
    Shapes[0][i] = new p(956.523, 218.876);

})();

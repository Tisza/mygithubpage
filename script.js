(function() {
    "use strict";
    
    function $(ele) {
        return document.getElementById(ele);
    }
    
    window.addEventListener("load", function() {
        var canvas = $("cvs");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        /* loadModule("animations/starfield.js", function() {
            starfield($("cvs"));
        }); */
        loadModule("animations/vector.js", function() {
            vector($("cvs"));
        });
        window.addEventListener("resize", resize);
    });
    
    function resize() {
        var canvas = $("cvs");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function loadModule(filepath, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = filepath;
        script.addEventListener("load", callback);
        document.head.appendChild(script);
    }
    
})();

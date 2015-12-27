(function() {
    "use strict";
    
    function $(ele) {
        return document.getElementById(ele);
    }
    
    window.addEventListener("load", function() {
        addHints();
        var canvas = $("cvs");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ccc";
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
    
    function addHints() {
        var classes = document.querySelectorAll(".class");
        for(var i = 0; i < classes.length; i++) {
            var c = classes[i];
            if (c.classList.contains("complete")) {
                c.title = "Complete.";
            } else if (c.classList.contains("current")) {
                c.title = "Currently Taking.";
            } else if (c.classList.contains("planned")) {
                c.title = "Planned to Take.";
            }
        }
    }
    
})();

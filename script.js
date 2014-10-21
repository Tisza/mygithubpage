(function() {
    "use strict";
    function $(Element) {
        return document.getElementById(Element);
    }
    window.addEventListener("load", function(event) {
        var footer = $("footer");
        footer.addEventListener("mouseenter", footerUp);
        footer.addEventListener("mouseleave", footerDown);
        footerDown();
    });
    function footerUp() {
        $("footer").style.bottom = "0px";
    }
    function footerDown() {
        var footer = $("footer");
        var X = footer.offsetTop;
        var Y = $("footerdetail").offsetTop;
        footer.style.bottom = (X + Y - window.innerHeight) + "px";
    }
})();

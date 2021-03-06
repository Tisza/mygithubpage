(function() {
    "use strict";

    // current scroll coords.
    var currentX;
    var currentY;
    // intervals
    var trans;
    var scroll;
    // page objects...
    var head;
    var nav;
    // relative heights
    var pages;

    // shortcut
    function $(Element) {
        return document.getElementById(Element);
    }

    // onload
    window.addEventListener("load", function() {
        // initial values of globals;
        currentX = 0;
        currentY = 0;
        head = document.querySelector("header");
        nav = document.querySelector("nav");
        nav.pos = 0;
        nav.val = 100;
        // called for scrolling
        nav.refresh = function() {
            var hgt = parseInt(window.getComputedStyle(head).height);
            var pg = window.pageYOffset + hgt;
            var index = 0;
            var perc = 0;
            // find out which section we're in
            for(var i = 0; i < pages.length; i++) {
                if(pages[i] < pg) {
                    index = i;
                    perc = (pg - pages[i]) / (pages[i + 1] - pages[i]);
                }
            }
            // sets the position up/down relative
            nav.pos = nav.height / (pages.length - 1) * (index + perc);
            // val is set by scroller...
            nav.style.top = -nav.pos + nav.val + "px";
        }

        // sets up header location information and nav
        pages = new Array();
        createPages();
        var h2 = document.querySelectorAll("h2");
        var ul = document.createElement("ul");
        for(var i = 0; i < h2.length; i++) {
            var li =        document.createElement("li");
            li.innerHTML = h2[i].innerHTML;
            li.amt = h2[i].offsetTop;
            li.tag = h2[i].id;
            li.addEventListener("click", linkHandler);
            ul.appendChild(li);
        }
        nav.appendChild(ul);
        // sets this once because its annoying...
        nav.height = parseInt(window.getComputedStyle(nav).height);
        // initial scroll calls
        scrollX();
        scrollY();

        // handler for scrolling
        window.addEventListener("scroll", function() {
            if(window.pageXOffset != currentX) {
                scrollX();
            } else {
                scrollY();
            }
        });
        window.addEventListener("resize", function() {
            scrollX();
            createPages();
        });

        // if you've loaded from a page, scroll correctly to it
        var id = window.location.hash.substring(1);
        if(id) {
            scrollTo($(id).offsetTop);
        }

        // Protect all the links! Hijacks? In ~MY~ website?
        var links = document.querySelectorAll("a");
        for(var i = 0; i < links.length; i++) {
            links[i].target = "_blank";
        }
    });

    // called for changes in page X or resizes
    function scrollX() {
        var newX = window.pageXOffset;
        var wrapper = parseInt(window.getComputedStyle($("wrapper")).marginLeft);
        head.style.left = wrapper - newX + "px";
        nav.style.left = wrapper - newX + "px";
        currentX = newX;
    }

    // called for changes in page Y
    function scrollY() {
        var newY = window.pageYOffset;
        nav.refresh();
        var minHeight = Math.max(40, nav.height - 16);
        if(currentY < minHeight || newY < minHeight || !head.tucked) {
            transitionHead(Math.max(minHeight, 100 - newY), minHeight);
        }
        nav.style.top = -nav.pos + nav.val + "px";
        currentY = newY;
    }

    // Smooth transition of header size
    function transitionHead(target, minHeight) {
        if(trans) {
            clearInterval(trans);
        }
        trans = setInterval(transitionHelper, 10, target, minHeight);
    }

    // The smoother part of the header resizer
    function transitionHelper(target, minHeight) {
        var n = 3;
        var height = parseInt(window.getComputedStyle(head).height);
        var val = height + Math.min(n, Math.max(-n, target - height));
        head.style.height = val + "px";
        var ht = document.querySelector("header h1");
        ht.style.fontSize = val + "px";
        nav.val = val;
        nav.refresh();
        if(Math.round(Math.abs(val - height)) == 0) {
            clearInterval(trans);
            if(height == minHeight) {
                head.tucked = true;
            } else {
                head.tucked = false;
            }
        }
    }

    // special smoother scrolling function
    function scrollTo(target) {
        if(scroll) {
            clearInterval(scroll);
        }
        scroll = setInterval(scrollHelper, 10, target);
    }

    // the helper for scrolling
    function scrollHelper(target) {
        var hgt = parseInt(window.getComputedStyle(head).height) + 16;
        var cur = window.pageYOffset;
        var n = 25;
        var amt = Math.max(-n, Math.min(n, target - hgt - cur));
        window.scrollTo(currentX, cur + amt);
        if((Math.abs(amt) < n || window.pageYOffset == cur) && (head.tucked || cur == 0)) {
            clearInterval(scroll);
        }
    }

    // Navigation link handling
    function linkHandler(event) {
        var cur = window.pageYOffset;
        window.location.hash = "#" + event.target.tag;
        window.scrollTo(currentX, cur);
        scrollTo(event.target.amt);
    }

    // Creates array of headers to heights
    function createPages() {
        pages = [];
        var h2 = document.querySelectorAll("h2");
        for(var i = 0; i < h2.length; i++) {
            pages[pages.length] = h2[i].offsetTop;
        }
        pages[pages.length] = window.outerHeight;
    }
}());

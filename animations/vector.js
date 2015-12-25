/* Logan Girvin
 * Copyright 2015
 * 
 * vector takes control of a canvas as draws a random triangle mesh using lines
 * for shading.
 */
function vector(canvas) {
    // 1) place vector points.
    //    1a) screen2vector
    // 2) connect them with triangles.
    //    2a) triangle disection/creation
    // 3) shading calculation
    //    bling-phonn shader model with no specular
    // 4) shade value to linear shading
    //    4a) shadevalue function
    //    4b) clip to triangle
    // 5) draw.
    
    // (fairly) constants
    var FIELD_OF_VISION = 45; // radians default, may change with screen size.
    var IMG_Z = 1; // default, must be calculated, changes with screen size.
    var ALTER_ZOOM = false; // weather to alter zoom on screen size change.
    
    var BASE_Z = 1000; // furthest z distance.
    var VAR_Z = 500; // distance variance.
    var LIGHT_Z = 500; // point light plane.
    
    var MIN_NUM_PTS = 5; // does not include corner points, must be greater than 0.
    var MAX_NUM_PTS = 25; // must be greater than zero.
    
    // DO NOT MODIFY BELOW THIS LINE
    // - - - - - - - - - - - - - - -
    var WIDTH = canvas.width; // pixels.
    var HEIGHT = canvas.height; // pixels.
    var LIGHT_X = 0; // vector
    var LIGHT_Y = 0; // vector
    // add hook to recalculate WIDTH, HEIGHT, IMG_Z/FIELD_OF_VISION.
    window.addEventListener("resize", calculateFrame); 
    // initial camera calculations
    calculateImagePlane();
    // add hook for pointlight
    window.addEventListener("mousemove", function(e) {
        var vec3 = screen2vector([e.clientX, e.clientY], LIGHT_Z);
        LIGHT_X = vec3[0];
        LIGHT_Y = vec3[1];
        shade();
    });
    
    // fields.
    var points = new Array(); // x y z
    var edges = new Array(); // x y z
    var triangles = new Array(); // x y z normal:{x y z}
    
    // calculates the new width/height and camera constants.
    function calculateFrame() {
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        calculateImagePlane();
        generatePoints();
        generateEdges();
        draw();
    }
    
    // calculates the image plane.
    function calculateImagePlane() {
        if (ALTER_ZOOM) {
            FIELD_OF_VISION = Math.atan2(WIDTH / 2, IMG_Z);
        } else {
            IMG_Z = WIDTH / (2 * Math.tan(FIELD_OF_VISION));
        }
    }
    
    // assume camera is at origin, facing positive z, +x right, -y up. 
    // calculates and returns an array(vector) point at (x*, y*, offsetz) 
    // aligned with imagePlane(screen) coordinate (scrx, scry). 
    function screen2vector(scr, offsetz) {
        var vec3 = new Array(3);
        vec3[0] = (scr[0] - WIDTH / 2) * offsetz / IMG_Z;
        vec3[1] = (scr[1] - HEIGHT / 2) * offsetz / IMG_Z;
        vec3[2] = offsetz;
        return vec3;
    }
    
    // takes a vector and rasterizes it to the screen image vector.
    function vector2screen(vec3) {
        var vec2 = new Array(2);
        vec2[0] = IMG_Z * vec3[0] / vec3[2] + WIDTH / 2;
        vec2[1] = IMG_Z * vec3[1] / vec3[2] + HEIGHT / 2;
        return vec2;
    }
    
    // clears and generates new random points (and 4 corner points).
    function generatePoints() {
        // clears points
        while(points.length > 0) 
            points.pop();
        // adds corner points
        points.push(screen2vector([0, 0], BASE_Z));
        points.push(screen2vector([0, HEIGHT], BASE_Z));
        points.push(screen2vector([WIDTH, 0], BASE_Z));
        points.push(screen2vector([WIDTH, HEIGHT], BASE_Z));
        // adds random points somewhere on the screen.
        var num_points = Math.floor(Math.random() * (MAX_NUM_PTS - MIN_NUM_PTS))
            + MIN_NUM_PTS;
        for(var i = 0; i < num_points; i++) {
            var randx = Math.round(Math.random() * WIDTH);
            var randy = Math.round(Math.random() * HEIGHT);
            var randz = BASE_Z + Math.round(Math.random() * VAR_Z);
            points.push(screen2vector([randx, randy], randz));
        }
    }
    
    // clears and generates new random (but local) edges.
    function generateEdges() {
        // clear edges
        while (edges.length > 0) 
            edges.pop();
        // begin randomly connecting dots!
        // minimum spanning tree!
        var known = new Array(points.length);
        var cost = new Array(points.length);
        var prev = new Array(points.length);
        for(var i = 0; i < points.length; i++) {
            cost[i] = -1;
            known[i] = false;
            prev[i] = -1;
        }
        var queue = new Array();
        queue.push(0);
        cost[0] = 0;
        while(queue.length > 0) {
            // in lue of a priority queue :<
            var shortest = -1;
            var shortindex = -1;
            var curcost = -1;
            queue.forEach(function(val, ind, arr) {
                if (cost[val] != -1) {
                    if (cost[val] < curcost || curcost == -1) {
                        curcost = cost[val];
                        shortest = val;
                        shortindex = ind;
                    }
                }
            });
            // remove from the queue and mark as known
            queue.splice(shortindex, 1);
            var node = shortest;
            known[node] = true;
            if (prev[node] != -1) { // add it as an actual edge
                edges.push([node, prev[node]]);
            }
            // (as if we had a complete tree) explore all the node's edges.
            points.forEach(function(val, ind, arr) {
                if (!known[ind] && (cost[ind] == -1 || dist(points[node], val) < cost[ind])) {
                    cost[ind] = dist(points[node], val);
                    prev[ind] = node;
                    queue.push(ind);
                }
            });
        }
        
        // start making triangles with it!
        for(var node = 0; node < points.length; node++) {
            // grab all the edges of this node.
            var curEdges = new Array();
            edges.forEach(function(val, ind, arr) {
                if (val[0] == node || val[1] == node) {
                    curEdges.push(val);
                }
            });
            // connect all the permutations you can!
            var a;
            var b;
            curEdges.forEach(function(val, ind, arr) {
                if (val[0] == node) {
                    a = val[1];
                } else {
                    a = val[0];
                }
                curEdges.forEach(function(val2, ind2, arr2) {
                    if (val2 != val) {
                        if (val2[0] == node) {
                            b = val2[1];
                        } else {
                            b = val2[0];
                        }
                        if (testLine(a, b)) {
                            edges.push([a, b]);
                            var norm = calcNorm(points[a], points[b], points[node]);
                            triangles.push([a, b, node, norm]);
                        }
                    }
                });
            });
        }
    }
    
    // tests if a line intersects with another line... (squash to z plane)
    function testLine(start, end) {
        if (start == end) 
            return false;
        var pass = true;
        edges.forEach(function(val, ind, arr) {
            if ((Math.round(val[0]) == Math.round(start) && 
                 Math.round(val[1]) == Math.round(end)) || 
                (Math.round(val[0]) == Math.round(end) && 
                 Math.round(val[1]) == Math.round(start))) {
                pass = false;
            }
                
            // line ab
            var ax = points[val[0]][0];
            var ay = points[val[0]][1];
            var bx = points[val[1]][0];
            var by = points[val[1]][1];
            var slopeAB = (ax - bx != 0 ? (ay - by) / (ax - bx) : null);
            // line cd
            var cx = points[start][0];
            var cy = points[start][1];
            var dx = points[end][0];
            var dy = points[end][1];
            var slopeCD = (cx - dx != 0 ? (cy - dy) / (cx - dx) : null);
            
            // test for parrellel lines
            if (slopeAB - slopeCD == 0) {
                // parrellel never intersects.
            } else {
            // intersection (lots of math...)
            // abx = ax + (bx - ax) t
            // aby = ay + (by - ay) t
            // cdx = cx + (dx - cx) s
            // cdy = cy + (dy - cy) s
            // x = ax + (bx - ax) t = cx + (dx - cx) s
            // ax - cx + (bx - ax) t = (dx - cx) s
            // (ax - cx + (bx - ax) t) / (dx - cx) = s
            // y = ay + (by - ay) t = cy + (dy - cy) ((ax - cx + (bx - ax) t) / (dx - cx))
            // ay + (by - ay) t = cy + (dy - cy) ([(ax - cx) / (dx - cx)] + [(bx - ax) t / (dx - cx)])
            // (ay - cy) + (by - ay) t = [(ax - cx) * (dy - cy) / (dx - cx)] + [(dy - cy) * (bx - ax) t / (dx - cx)]
            // (ay - cy) - ((ax - cx) * (dy - cy) / (dx - cx)) = [(dy - cy) * (bx - ax) t / (dx - cx)] - (by - ay) t
            // (ay - cy) - ((ax - cx) * (dy - cy) / (dx - cx)) = [(dy - cy) * (bx - ax) / (dx - cx) - (by - ay)] t
            // [(ay - cy) - ((ax - cx) * (dy - cy) / (dx - cx))] / [(dy - cy) * (bx - ax) / (dx - cx) - (by - ay)] = t
            var t = ((ay - cy) - ((ax - cx) * (dy - cy) / (dx - cx))) / ((dy - cy) * (bx - ax) / (dx - cx) - (by - ay));
            var s = (ax - cx + (bx - ax) * t) / (dx - cx);
            if (t > 0 && t < 1 && s > 0 && s < 1)
                pass = false;
            }
        });
        return pass;
    }
    
    // returns the distance between two vec3's, duh.
    function dist(a, b) {
        return Math.pow(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + 
                        Math.pow(a[2] - b[2], 2), 0.5);
    }
    
    // calculates the normal, normalizes it, and forces it to face in the -z direction.
    function calcNorm(a, b, c) {
        // a x b = (refer to https://upload.wikimedia.org/wikipedia/commons/c/c1/Sarrus_rule_cross_product.svg)
        var ac = [a[0] - c[0], a[1] - c[1], a[2] - c[2]];
        var bc = [b[0] - c[0], b[1] - c[1], b[2] - c[2]];
        var i = ac[1] * bc[2] - ac[2] * bc[1];
        var j = ac[2] * bc[0] - ac[0] * bc[2];
        var k = ac[0] * bc[1] - ac[1] * bc[0];
        var norm = [i, j, k];
        var distance = dist(norm, [0, 0, 0]);
        var nnorm = [norm[0] / distance, norm[1] / distance, norm[2] / distance];
        if (nnorm[2] > 0) {
            return [-nnorm[0], -nnorm[1], -nnorm[2]];
        }
        return nnorm;
    }
    
    // draws the image.
    function draw() {
        var ctx = canvas.getContext("2d");
        //ctx.fillStyle = "#fff";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#000";
        // points.forEach(function(val, ind, arr) {
        //    var pos = vector2screen(val);
        //    var size = (BASE_Z - val[2] + 10) / 5;
        //    ctx.fillRect(pos[0] - size / 2, pos[1] - size / 2, size, size);
        //});
        edges.forEach(function(val, ind, arr) {
           ctx.beginPath();
           var from = points[val[0]];
           var to = points[val[1]];
           var posfrom = vector2screen(from);
           var posto = vector2screen(to); 
           ctx.moveTo(posfrom[0], posfrom[1]);
           ctx.lineTo(posto[0], posto[1]);
           ctx.stroke();
           ctx.closePath();
        });
        shade();
    }
    
    function shade() {
        var ctx = canvas.getContext("2d");
        triangles.forEach(function(val, ind, arr) {
           var a = vector2screen(points[val[0]]);
           var b = vector2screen(points[val[1]]);
           var c = vector2screen(points[val[2]]);
           ctx.beginPath();
           ctx.moveTo(a[0], a[1]);
           ctx.lineTo(b[0], b[1]);
           ctx.lineTo(c[0], c[1]);
           
           // calculate defuse shade.
           var va = points[val[0]];
           var vb = points[val[1]];
           var vc = points[val[2]];
           var cent = [va[0] / 3 + vb[0] / 3 + vc[0] / 3, 
                       va[1] / 3 + vb[1] / 3 + vc[1] / 3,
                       va[2] / 3 + vb[2] / 3 + vc[2] / 3];
           var light = [LIGHT_X - cent[0], LIGHT_Y - cent[1], LIGHT_Z - cent[2]];
           var lightdist = dist(light, [0, 0, 0]);
           var nlight = [light[0] / lightdist, light[1] / lightdist, light[2] / lightdist];
           var V = nlight[0] * val[3][0] + nlight[1] * val[3][1] + nlight[2] * val[3][2];
           if (V < 0) {
               ctx.fillStyle = "#000";
           } else {
               var grey = Math.round(V * 255);
               ctx.fillStyle = "rgb(" + grey + ", " + grey + ", " + grey + ")";
           }
           ctx.fill();
           ctx.closePath();
        });
    }
    
    // main
    (function() {
        generatePoints();
        generateEdges();
        draw();
    })();
    
}
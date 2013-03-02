App.clearDocument()

// block dimensions
var h = 3.2
var P = 8.0

// Make code shorter
cp = CGM.createPoint
cv = CGM.createVector

var origin = cp(0,0,0)
// Useful vectors
var up = cv(0,0,1);
var left = cv(0,1,0);
var front = cv(1,0,0);

var LEGO_AXLE_UP = 0
var LEGO_AXLE_LEFT = 1
var LEGO_AXLE_FRONT = 2

// Utility function to calculate distance in mm from the number of dots on a lego block
function dotWidth(num) {
    return P * num - 0.2;
}

// Utility function to calculate the height in mm of a number of lego blocks
function blockHeight(num) {
    return num * 3 * h;
}

function axleHeight() {
    return 5.6;
}
// Utility function to calculate the height in mm of a number of lego plates
function plateHeight(num) {
    return num * h;
}


var LEGO_BLACK = 0
var LEGO_RED = 1
var LEGO_GREEN = 2
var LEGO_BLUE = 3
var LEGO_YELLOW = 4
var LEGO_WHITE = 5
var LEGO_COLORS = [[0,0,0],
                   [255,0,0],
                   [0,255,0],
                   [0,0,255],
                   [255,255,0],
                   [255,255,255]];

var helpers = new Array()
// This is cloned because it may be faster than creating multiple cylinders
var knob = CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, 0), up, 1.8, 2.4)
knob = CGM.fillet(CGM.getEdges(knob)[2], 0.25)
helpers.push(knob)

var techKnob = CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, 0), up, 1.8, 2.4)
techKnob = CGM.subtract(techKnob, CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, 0.8), up, 1.0, 3.0/2))
techKnob = CGM.fillet(CGM.getEdges(techKnob)[2], 0.25)
techKnob = CGM.fillet(CGM.getEdges(techKnob)[4], 0.25)
helpers.push(techKnob)

var techHoleLeft = CGM.createCylinder(cp(7.9,0,5.6), left, 7.8, 4.8/2)
techHoleLeft = CGM.unite(techHoleLeft, CGM.createCylinder(cp(7.9,0,5.6), left, 1.5, 6.2/2))
techHoleLeft = CGM.unite(techHoleLeft, CGM.createCylinder(cp(7.9,7.8-1.5,5.6), left, 1.5, 6.2/2))
helpers.push(techHoleLeft)

var techHoleFront = CGM.createCylinder(cp(0,7.9,5.6), front, 7.8, 4.8/2)
techHoleFront = CGM.unite(techHoleFront, CGM.createCylinder(cp(0,7.9,5.6), front, 1.5, 6.2/2))
techHoleFront = CGM.unite(techHoleFront, CGM.createCylinder(cp(7.8-1.5,7.9,5.6), front, 1.5, 6.2/2))
helpers.push(techHoleFront)

var techUnderCylinder = CGM.createCylinder(cp(0,0,0), up, 9.6, 3.0/2)
helpers.push(techUnderCylinder)

var blockUnderCylinder = CGM.createCylinder(cp(8,8,0), up, 8.6, 6.51/2)
blockUnderCylinder = CGM.subtract(blockUnderCylinder, CGM.createCylinder(cp(8,8,0), up, 8.6, 4.8/2))
helpers.push(blockUnderCylinder)

var plateUnderCylinder = CGM.createCylinder(cp(8,8,0), up, 2.2, 6.51/2)
plateUnderCylinder = CGM.subtract(plateUnderCylinder, CGM.createCylinder(cp(8,8,0), up, 2.2, 4.8/2))
helpers.push(plateUnderCylinder)

var smallHole = CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, -1), up, 1.0, 2.6/2)
helpers.push(smallHole)

// The cache for previously created plates
// This could be made smarter by recognizing a 4x1 block is just a rotated 1x4 block
var plateCache = new Object()

// Create a plate of the given size and color
function createPlate(width, height, color) {
    // Check the cache
    var descString = "" + width + "x" + height
    if (plateCache[descString]) {
        // It was in the cache, so set the color and return it
        var cc = LEGO_COLORS[color];
        var tmp = CGM.clone(plateCache[descString]);
        return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
    }
    // It wasn't in the cache, so create it
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,h)
    for (var cpi = 0; cpi<width; ++cpi) {
        for (var cpj = 0; cpj<height; ++cpj) {
            trans.push(CGM.createTranslation(cpi * 8, cpj * 8, h));
        }
    }
    var thisKnob = CGM.clone(knob);
    blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisKnob), trans));
    blockSoFar = CGM.subtract(blockSoFar, CGM.clone(knob))

    blockSoFar = CGM.subtract(blockSoFar, CGM.createCuboid(1.2,1.2,0, width*P-1.4,height*P-1.4,h - 1.0))

    var thisHole = CGM.clone(smallHole)
    blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHole), trans));

    trans = new Array()
    for (var uci = 0; uci<width-1; ++uci) {
        for (var ucj = 0; ucj<height-1; ++ucj) {
            trans.push(CGM.createTranslation(uci * 8, ucj * 8, 0));
        }
    }
    var thisCyl = CGM.clone(plateUnderCylinder);
    blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisCyl), trans));
    // CGM.Part.remove(thisCyl)
    // Add it to the cache
    plateCache[descString] = blockSoFar;

    // Set the color and return it
    var tmp = CGM.clone(plateCache[descString]);
    var cc = LEGO_COLORS[color];
    return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
}

// The block cache
var blockCache = new Object()
function createBlock(width, height, color) {
    // Check the cache
    var descString = "" + width + "x" + height
    if (blockCache[descString]) {
        // It was 
        var cc = LEGO_COLORS[color];
        var tmp = CGM.clone(blockCache[descString]);
        return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
    }
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,3*h)
    blockSoFar = CGM.subtract(blockSoFar, CGM.createCuboid(1.2,1.2,0, width*P-1.4,height*P-1.4,3*h - 1.0))

    for (var cpi = 0; cpi<width; ++cpi) {
        for (var cpj = 0; cpj<height; ++cpj) {
            trans.push(CGM.createTranslation( cpi * 8,  cpj * 8, 3*h));
        }
    }
    var thisKnob = CGM.clone(knob);
    blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisKnob), trans));
    blockSoFar = CGM.subtract(blockSoFar, CGM.clone(knob))

    var thisHole = CGM.clone(smallHole)
    blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHole), trans));

    trans = new Array()
    for (var uci = 0; uci<width-1; ++uci) {
        for (var ucj = 0; ucj<height-1; ++ucj) {
            trans.push(CGM.createTranslation(uci * 8, ucj * 8, 0));
        }
    }
    var thisCyl = CGM.clone(blockUnderCylinder);
    blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisCyl), trans));
    
    blockCache[descString] = blockSoFar;
    
    var tmp = CGM.clone(blockCache[descString]);
    var cc = LEGO_COLORS[color];
    return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
}

var techBeamCache = new Object()
function createTechnicBeam(width, height, color) {
    // if (((width!=1 && height<2)) || ((height != 1) && width<2)) {
    //     return;
    // }
    // Check the cache
    var descString = "" + width + "x" + height
    if (techBeamCache[descString]) {
        // It was 
        var cc = LEGO_COLORS[color];
        var tmp = CGM.clone(techBeamCache[descString]);
        return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
    }
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,3*h)

    for (var cpi = 0; cpi<width; ++cpi) {
        for (var cpj = 0; cpj<height; ++cpj) {
            trans.push(CGM.createTranslation( cpi * 8,  cpj * 8, 3*h));
        }
    }
    var thisKnob = CGM.clone(techKnob);
    blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisKnob), trans));

    trans = new Array()
    if (width == 1) {
        for (var hi = 0;hi<height-1; ++hi) {
            trans.push(CGM.createTranslation(0, hi*8, 0));
        }
        var thisHole = CGM.clone(techHoleFront);
        blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHole), trans))
    } else if (height == 1) {
        for (var wi = 0;wi<width-1; ++wi) {
            trans.push(CGM.createTranslation(wi*8, 0, 0));
            ;
        }
        var thisHole = CGM.clone(techHoleLeft);
        blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHole), trans))
    }
    
    techBeamCache[descString] = blockSoFar;
    
    var tmp = CGM.clone(techBeamCache[descString]);
    var cc = LEGO_COLORS[color];
    return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
}

var axleCache = new Object();
var axleDescs = ["up", "left", "front"]
function createAxle(length, direction) {
    var rad = 4.8/2
    var thirdDiam = 4.8/5
    var thisLen = length * dotWidth(1)
    
    var descString = axleDescs[direction] + length;
    if (axleCache[descString]) {
        return CGM.Property.setRGBA(CGM.clone(axleCache[descString]), 20,20,20,255);
    }
    var thisAxle = CGM.createCylinder(cp(0,0,0), up, thisLen, 4.8/2)
    var sub1 = CGM.createCuboid(cp(-rad, -rad, 0), cp(-thirdDiam, -thirdDiam, thisLen))
    var sub2 = CGM.createCuboid(cp(thirdDiam, thirdDiam, 0), cp(rad, rad, thisLen))
    var sub3 = CGM.createCuboid(cp(-rad, thirdDiam, 0), cp(-thirdDiam, rad, thisLen))
    var sub4 = CGM.createCuboid(cp(thirdDiam, -rad, 0), cp(rad, -thirdDiam, thisLen))

    thisAxle = CGM.subtract(thisAxle, sub1)
    thisAxle = CGM.subtract(thisAxle, sub2)
    thisAxle = CGM.subtract(thisAxle, sub3)
    thisAxle = CGM.subtract(thisAxle, sub4)

    thisAxle = CGM.fillet(CGM.getEdges(thisAxle), 0.5)
    axleCache["up" + length] = thisAxle
    thisAxle = CGM.clone(axleCache["up" + length]);
    switch (direction) {
    case LEGO_AXLE_UP:
        return CGM.setRGBA(thisAxle, 20,20,20,255);
        break;
    case LEGO_AXLE_LEFT:
        thisAxle = CGM.translate(CGM.rotate(thisAxle, origin, cv(1,0,0), -Math.PI/2), 7.9, 0, axleHeight());
        axleCache["left" + length] = thisAxle
        return CGM.Property.setRGBA(CGM.clone(axleCache["left" + length]), 20,20,20,255);
        break;
    default:
        thisAxle = CGM.translate(CGM.rotate(thisAxle, origin, cv(0,1,0), -Math.PI/2), 0, 7.9, axleHeight());
        axleCache["front" + length] = thisAxle
        return CGM.Property.setRGBA(CGM.clone(axleCache["left" + length]), 20,20,20,255);
    }
    return;
}

function createSmallGear() {
}
// -rad, -rad, 0
// -thirdDiam, -thirdDiam, thisLen
// /*
//   +--+--+--+--+
//   |  |  |  |  |
//   +--+--+--+--+
//   |  |  |  |  |
//   +--+--+--+--+
//   |  |  |  |  |
//   +--+--+--+--+
//   |  |  |  |  |
// */

function createBlockAt(width, height, color, x,y,z) {
    var tmp = createBlock(width, height, color);
    return CGM.translate(tmp, x,y,z);
}
function createBeamAt(width, height, color, x,y,z) {
    var tmp = createTechnicBeam(width, height, color)
    return CGM.translate(tmp, x,y,z);
}
function randomColor() {
    return Math.floor(Math.random()*(LEGO_WHITE+1))
}


function createPlateAt(width, height, color, x,y,z) {
    var tmp = createPlate(width, height, color);
    return CGM.translate(tmp, x,y,z);
}

var allPieces = new Array();
function createTowerAt(levels, xp,yp, zp) {
    for (var li = 0; li<levels; ++li) {
        var curHeight = (blockHeight(li));
        // var plate1 = createPlateAt(4,4, randomColor(), 0,0, curHeight);
        // allPieces.push(plate1);
        // curHeight += plateHeight(1)
        if (0 == (li % 2)) {
            if (Math.random()>0.5) {
                var block1 = createBlockAt(4,2, randomColor(), 0+xp,0+yp, curHeight+zp)
                allPieces.push(block1)
                if (Math.random()>0.5) {
                    var block2 = createBlockAt(4,2, randomColor(), 0+xp, dotWidth(2)+yp, curHeight+zp)
                    allPieces.push(block2)
                }
            } else {
                var block2 = createBlockAt(4,2, randomColor(), 0+xp, dotWidth(2)+yp, curHeight+zp)
                allPieces.push(block2)
            }
        } else {
            if (Math.random()>0.5) {
                var block1 = createBlockAt(2,4, randomColor(), 0+xp, 0+yp, curHeight+zp)
                allPieces.push(block1)
                if (Math.random()>0.5) {
                    var block2 = createBlockAt(2,4, randomColor(), dotWidth(2)+xp, 0+yp, curHeight+zp)
                    allPieces.push(block2)
                }
            } else {
                var block2 = createBlockAt(2,4, randomColor(), dotWidth(2)+xp, 0+yp, curHeight+zp)
                allPieces.push(block2)
            }
        }
    }
}


function createTableAt(width, height, depth, xp, yp, zp) {
    for (var lvl = 0; lvl< depth; ++lvl) {
        var curHeight = blockHeight(lvl)+zp
        var b1 = createBlockAt(2,2, randomColor(), 0+xp,0+yp, curHeight)
        var b2 = createBlockAt(2,2, randomColor(), dotWidth(width-2)+xp,0+yp, curHeight)
        var b3 = createBlockAt(2,2, randomColor(), 0+xp, dotWidth(height-2)+yp, curHeight)
        var b4 = createBlockAt(2,2, randomColor(), dotWidth(width-2)+xp, dotWidth(height-2)+yp, curHeight)
        allPieces.push(b1)
        allPieces.push(b2)
        allPieces.push(b3)
        allPieces.push(b4)
    }
    var top = createPlateAt(width, height, randomColor(), 0+xp,0+yp, blockHeight(depth)+zp)
    allPieces.push(top)
}
function clearPieces() {
    for (var pc in allPieces) {
        CGM.Part.remove(allPieces[pc])
    }
    allPieces = new Array();
}

function lego_cleanup() {
    for (var val in blockCache) {
        CGM.Part.remove(blockCache[val]);
    }
    for (var val in plateCache) {
        CGM.Part.remove(plateCache[val]);
    }
    for (var val in techBeamCache) {
        CGM.Part.remove(techBeamCache[val]);
    }
    for (var val in axleCache) {
        CGM.Part.remove(axleCache[val]);
    }
    for (hlp in helpers) {
        CGM.Part.remove(helpers[hlp])
    }
    // CGM.Part.remove(knob)
    // CGM.Part.remove(plateUnderCylinder);
    // CGM.Part.remove(blockUnderCylinder);
    // CGM.Part.remove(smallHole);
    // CGM.Part.remove(techHoleFront);
    // CGM.Part.remove(techHoleLeft);
    // CGM.Part.remove(techUnderCylinder);
}

var myAxl = createAxle(20, LEGO_AXLE_LEFT)
allPieces.push(myAxl)
allPieces.push(createBeamAt(16,1,LEGO_YELLOW, 0,0,0))
allPieces.push(createBeamAt(12,1,LEGO_YELLOW, 0,0,blockHeight(1)))
allPieces.push(createBeamAt(10,1,LEGO_YELLOW, 0,0,blockHeight(2)))
allPieces.push(createBeamAt(8,1,LEGO_YELLOW, 0,0,blockHeight(3)))
allPieces.push(createBeamAt(6,1,LEGO_YELLOW, 0,0,blockHeight(4)))
allPieces.push(createBeamAt(4,1,LEGO_YELLOW, 0,0,blockHeight(5)))
allPieces.push(createBeamAt(2,1,LEGO_YELLOW, 0,0,blockHeight(6)))
createBeamAt(2,1,LEGO_YELLOW, 0, dotWidth(18), 0);
lego_cleanup();

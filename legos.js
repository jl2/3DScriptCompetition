App.clearDocument()

// block dimensions
var h = 3.2
var P = 8.0

// Utility function to calculate distance in mm from the number of dots on a lego block
function dotWidth(num) {
    return P * num - 0.2;
}

// Utility function to calculate the height in mm of a number of lego blocks
function blockHeight(num) {
    return num * 3 * h;
}
// Utility function to calculate the height in mm of a number of lego plates
function plateHeight(num) {
    return num * h;
}

// Useful vectors
var up = CGM.createVector(0,0,1);
var left = CGM.createVector(0,1,0);
var front = CGM.createVector(1,0,0);

// Make code shorter
cp = CGM.createPoint
cv = CGM.createVector

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

// This is cloned because it may be faster than creating multiple cylinders
var knob = CGM.createCylinder(CGM.createPoint((P-0.2)/2, (P-0.2)/2, 0), up, 1.7, 2.5)

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
            // thisKnob = CGM.translate(thisKnob, (P-0.2)/2 + cpi * 8, (P-0.2)/2 + cpj * 8, 3*h);
            // blockSoFar = CGM.unite(blockSoFar, thisKnob);
        }
    }
    var thisKnob = CGM.clone(knob);
    blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisKnob), trans));

    // for (var cpi = 0; cpi<width; ++cpi) {
    //     for (var cpj = 0; cpj<height; ++cpj) {
    //         var thisKnob = CGM.clone(knob);
    //         thisKnob = CGM.translate(thisKnob, (P-0.2)/2 + cpi * 8, (P-0.2)/2 + cpj * 8, h);
    //         blockSoFar = CGM.unite(blockSoFar, thisKnob);
    //     }
    // }
    // Add it to the cache
    plateCache[descString] = blockSoFar;

    // Set the color and return it
    var tmp = CGM.clone(plateCache[descString]);
    var cc = LEGO_COLORS[color];
    return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
}

// The block cache
var blockCache = new Object()

// Create a block of the given size and color
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

    for (var cpi = 0; cpi<width; ++cpi) {
        for (var cpj = 0; cpj<height; ++cpj) {
            trans.push(CGM.createTranslation( cpi * 8,  cpj * 8, 3*h));
            // thisKnob = CGM.translate(thisKnob, (P-0.2)/2 + cpi * 8, (P-0.2)/2 + cpj * 8, 3*h);
            // blockSoFar = CGM.unite(blockSoFar, thisKnob);
        }
    }
    var thisKnob = CGM.clone(knob);
    blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisKnob), trans));
    blockCache[descString] = blockSoFar;
    
    var tmp = CGM.clone(blockCache[descString]);
    var cc = LEGO_COLORS[color];
    return CGM.Property.setRGBA(tmp, cc[0], cc[1], cc[2], 255)
}

function createBlockAt(width, height, color, x,y,z) {
    var tmp = createBlock(width, height, color);
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

function createTower(levels) {
    for (var li = 0; li<levels; ++li) {
        var curHeight = li*(plateHeight(1) + blockHeight(1));
        var plate1 = createPlateAt(4,4, randomColor(), 0,0, curHeight);
        allPieces.push(plate1);
        curHeight += plateHeight(1)
        if (0 == (li % 2)) {
            if (Math.random()>0.5) {
                var block1 = createBlockAt(4,2, randomColor(), 0,0, curHeight)
                allPieces.push(block1)
                if (Math.random()>0.5) {
                    var block2 = createBlockAt(4,2, randomColor(), 0, dotWidth(2),curHeight)
                    allPieces.push(block2)
                }
            } else {
                var block2 = createBlockAt(4,2, randomColor(), 0, dotWidth(2),curHeight)
                allPieces.push(block2)
            }
        } else {
            if (Math.random()>0.5) {
                var block1 = createBlockAt(2,4, randomColor(), 0,0, curHeight)
                allPieces.push(block1)
                if (Math.random()>0.5) {
                    var block2 = createBlockAt(2,4, randomColor(), dotWidth(2),0,curHeight)
                    allPieces.push(block2)
                }
            } else {
                var block2 = createBlockAt(2,4, randomColor(), dotWidth(2), 0,curHeight)
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

// for (var tab = 8; tab >=4; tab -= 2) {
//     createTableAt(tab, tab, tab, dotWidth(offs), dotWidth(offs), curHeight);
//     curHeight += blockHeight(tab) + plateHeight(1);
//     offs += 1
// }
createTableAt(10,10, 10, 0,0,0)
createTableAt(8,8,8, dotWidth(1),dotWidth(1),blockHeight(10) + plateHeight(1))
createTableAt(6,6,6, dotWidth(2),dotWidth(2),blockHeight(18) + plateHeight(2))
createTableAt(4,4,4, dotWidth(3),dotWidth(3),blockHeight(24) + plateHeight(3))
for (var i = 0;i<10; ++i) {
    allPieces.push(createBlockAt(2,2, randomColor(), dotWidth(4), dotWidth(4), blockHeight(28+i) + plateHeight(4)))
}
// createTower(10)

function clearPieces() {
    for (var pc in allPieces) {
        CGM.Part.remove(allPieces[pc])
    }
    allPieces = new Array();
}

function lego_cleanup() {
    CGM.Part.remove(knob)
    for (var val in blockCache) {
        CGM.Part.remove(blockCache[val]);
    }
    for (var val in plateCache) {
        CGM.Part.remove(plateCache[val]);
    }
}
// var offs = 0;
// var curHeight = 0;

// clearPieces()
// var minOff = 5
// for (var offs = 0; offs < 20; ++offs) {
//     allPieces.push(createBlockAt(2,2, randomColor(), -dotWidth(offs+minOff), -dotWidth(offs+minOff), -blockHeight(offs)))
//     allPieces.push(createBlockAt(2,2, randomColor(), +dotWidth(offs+minOff), +dotWidth(offs+minOff), -blockHeight(offs)))
//     allPieces.push(createBlockAt(2,2, randomColor(), -dotWidth(offs+minOff), +dotWidth(offs+minOff), -blockHeight(offs)))
//     allPieces.push(createBlockAt(2,2, randomColor(), +dotWidth(offs+minOff), -dotWidth(offs+minOff), -blockHeight(offs)))
// }

// var plate1 = createPlateAt(4,4, LEGO_GREEN, 0,0,0);
// var plate2 = createPlateAt(4,4, LEGO_GREEN, 0,0,blockHeight(1) + plateHeight(1));
// var plate3 = createPlateAt(4,4, LEGO_GREEN, 0,0,blockHeight(2) + plateHeight(2));
// var block1 = createBlockAt(2,4, LEGO_BLUE, 0,0,plateHeight(1));
// var block2 = createBlockAt(2,4, LEGO_RED, dotWidth(2), 0, plateHeight(1));
// var block3 = createBlockAt(2,2, LEGO_YELLOW, 0,0, plateHeight(2) + blockHeight(1));
// var block4 = createBlockAt(2,2, LEGO_YELLOW, dotWidth(2),0, plateHeight(2) + blockHeight(1));
// var block4 = createBlockAt(2,2, LEGO_YELLOW, dotWidth(2),dotWidth(2), plateHeight(2) + blockHeight(1));
// var block4 = createBlockAt(2,2, LEGO_YELLOW, 0,dotWidth(2), plateHeight(2) + blockHeight(1));
// var block5 = createBlockAt(2,2, LEGO_BLACK, dotWidth(1), dotWidth(1), plateHeight(3) + blockHeight(2))

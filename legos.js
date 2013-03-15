App.clearDocument()

// block dimensions
var h = 3.2
var P = 8.0

// Make code shorter
cp = CGM.createPoint
cv = CGM.createVector

var origin = cp(0,0,0)

// The cache for previously created plates
// This could be made smarter by, for example, recognizing a 4x1 block is just a rotated 1x4 block

var brickCache = new Object()
brickCache['plates'] = new Object()
brickCache['flatplates'] = new Object()
brickCache['techplates'] = new Object()
brickCache['blocks'] = new Object()
brickCache['techbeams'] = new Object()
brickCache['axles'] = new Object()
brickCache['bigtire'] = new Object()
brickCache['smalltire'] = new Object()
brickCache['pulleys'] = new Object()

brickCache['fancyplates'] = new Object()
brickCache['fancytechplates'] = new Object()
brickCache['fancyblocks'] = new Object()

brickCache['gears'] = new Object()

var allPieces = new Array();
var helpers = new Array()

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
function axleOffset() {
    return 7.9;
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
var LEGO_GREY = 5
var LEGO_WHITE = 6
var LEGO_COLORS = [App.Color.createRGB(0,0,0),
                   App.Color.createRGB(255,0,0),
                   App.Color.createRGB(0,255,0),
                   App.Color.createRGB(0,0,255),
                   App.Color.createRGB(255,255,0),
                   App.Color.createRGB(207,207,207),
                   App.Color.createRGB(255,255,255)];

// The knob on top of regular bricks, plates, tech plates, etc
// The fancyknob on top of regular bricks, plates, tech plates, etc
var fancyknob = CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, 0), up, 1.8, 2.4)
fancyknob = CGM.fillet(CGM.getEdges(fancyknob)[2], 0.25)

var lblock = CGM.createCuboid(cp(0,0,0), cp(0.25,1.5,0.1))
lblock = CGM.unite(lblock, CGM.createCuboid(cp(0,0,0), cp(0.8,0.25,0.1)))
lblock = CGM.translate(lblock, (P-0.2)/2-2*4.8/5, (P-0.2)/2-4.8/6, 1.75)
lblock = CGM.fillet(CGM.getEdges(lblock), 0.05)
fancyknob = CGM.unite(fancyknob, lblock)

var eblock = CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(1.0,0, 0), cp(1.25,1.5, 0.1))), 0.05)
eblock = CGM.unite(eblock, CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(1.0,0, 0), cp(1.8,0.3, 0.1))), 0.05))
eblock = CGM.unite(eblock, CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(1.0,0.6, 0), cp(1.8,0.9, 0.1))), 0.05))
eblock = CGM.unite(eblock, CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(1.0,1.2, 0), cp(1.8,1.5, 0.1))), 0.05))
eblock = CGM.translate(eblock, (P-0.2)/2-2*4.8/5, (P-0.2)/2-4.8/6, 1.75)
fancyknob = CGM.unite(fancyknob, eblock)

var gblock = CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(2.0,0,0), cp(2.25,1.5,0.1))), 0.05)
gblock = CGM.unite(gblock, CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(2.0,1.2,0), cp(2.8,1.5,0.1))), 0.05))
gblock = CGM.unite(gblock, CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(2.0,0,0), cp(2.8,0.3,0.1))), 0.05))
gblock = CGM.unite(gblock, CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(2.6,0,0), cp(2.8,0.8,0.1))), 0.05))
gblock = CGM.unite(gblock, CGM.fillet(CGM.getEdges(CGM.createCuboid(cp(2.5,0.6,0), cp(2.8,0.8,0.1))), 0.05))
gblock = CGM.translate(gblock, (P-0.2)/2-2*4.8/5, (P-0.2)/2-4.8/6, 1.75)
fancyknob = CGM.unite(fancyknob, gblock)

var oblock = CGM.createCuboid(cp(2.9,0,0), cp(3.7, 1.5, 0.1))
oblock = CGM.subtract(oblock, CGM.createCuboid(cp(3.2,0.3,0), cp(3.4, 1.2, 0.1)))
oblock = CGM.fillet(CGM.getEdges(oblock), 0.05)
oblock = CGM.translate(oblock, (P-0.2)/2-2*4.8/5, (P-0.2)/2-4.8/6, 1.75)
fancyknob = CGM.unite(fancyknob, oblock)
helpers.push(fancyknob)

var knob = CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, 0), up, 1.8, 2.4)
knob = CGM.fillet(CGM.getEdges(knob)[2], 0.25)
helpers.push(knob)

// Technic knob
var techKnob = CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, 0), up, 1.8, 2.4)
techKnob = CGM.subtract(techKnob, CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, 0.8), up, 1.0, 3.0/2))
techKnob = CGM.fillet(CGM.getEdges(techKnob)[2], 0.125)
techKnob = CGM.fillet(CGM.getEdges(techKnob)[4], 0.125)
helpers.push(techKnob)

// The hole in 1xN beams
var techHoleLeft = CGM.createCylinder(cp(7.9,0,5.6), left, 7.8, 4.8/2)
techHoleLeft = CGM.unite(techHoleLeft, CGM.createCylinder(cp(7.9,0,5.6), left, 1.5, 6.2/2))
techHoleLeft = CGM.unite(techHoleLeft, CGM.createCylinder(cp(7.9,7.8-1.5,5.6), left, 1.5, 6.2/2))
helpers.push(techHoleLeft)

// The hole in Nx1 beams - don't know why I don't rotate the one above...
var techHoleFront = CGM.createCylinder(cp(0,7.9,5.6), front, 7.8, 4.8/2)
techHoleFront = CGM.unite(techHoleFront, CGM.createCylinder(cp(0,7.9,5.6), front, 1.5, 6.2/2))
techHoleFront = CGM.unite(techHoleFront, CGM.createCylinder(cp(7.8-1.5,7.9,5.6), front, 1.5, 6.2/2))
helpers.push(techHoleFront)

// The small cylinder in technic beams - not used yet
var techUnderCylinderLeft = CGM.createCylinder(cp(7.9,0,5.6), left, dotWidth(1), 7/2)
techUnderCylinderLeft = CGM.unite(techUnderCylinderLeft, CGM.createCylinder(cp(7.9, dotWidth(1)/2, 0), up, 9.6, 3.0/2))
helpers.push(techUnderCylinderLeft)

var techUnderCylinderFront = CGM.createCylinder(cp(0,7.9,5.6), front, dotWidth(1), 7/2)
techUnderCylinderFront = CGM.unite(techUnderCylinderFront, CGM.createCylinder(cp(dotWidth(1)/2,7.9, 0), up, 9.6, 3.0/2))
helpers.push(techUnderCylinderFront)

// The hollow cylinder under regular bricks
var blockUnderCylinder = CGM.createCylinder(cp(8,8,0), up, 8.6, 6.51/2)
blockUnderCylinder = CGM.subtract(blockUnderCylinder, CGM.createCylinder(cp(8,8,0), up, 8.6, 4.8/2))
helpers.push(blockUnderCylinder)

// The short hollow cylinder under plates
var plateUnderCylinder = CGM.createCylinder(cp(8,8,0), up, 2.2, 6.51/2)
plateUnderCylinder = CGM.subtract(plateUnderCylinder, CGM.createCylinder(cp(8,8,0), up, 2.2, 4.8/2))
helpers.push(plateUnderCylinder)

// The hole in technic plates
var techPlateHole = CGM.createCylinder(cp(8,8,2), up, 2, 4.8/2)
helpers.push(techPlateHole)
// The small hole under knobs for blocks and plates
var smallHole = CGM.createCylinder(cp((P-0.2)/2, (P-0.2)/2, -1), up, 1.0, 2.6/2)
helpers.push(smallHole)

var toothProfile = CGM.unite(
    CGM.unite(
        CGM.unite(
            CGM.createLineSegment(cp(-0.4*2,0,0), cp(0.4*2,0, 0)),
            CGM.createLineSegment(cp(-0.4*2,0,0), cp(-0.2*2,0, 0.7*2))
        ),
        CGM.createLineSegment(cp(0.4*2,0,0), cp(0.2*2,0, 0.7*2))
    ),
    CGM.createArcThroughThreePoints(cp(-0.2*2, 0,0.7*2),cp(0,0,1*2),cp(0.2*2,0,0.7*2))
)
toothProfile = CGM.fill(toothProfile)
gearTooth = CGM.sweep(toothProfile,CGM.createLineSegment(cp(0,0,0), cp(0, dotWidth(1)*0.8,0)))
gearTooth = CGM.translate(gearTooth, cv(0,dotWidth(1)*0.1,0))
helpers.push(gearTooth)

var crownToothProfile = CGM.unite(
    CGM.unite(
        CGM.unite(
            CGM.createLineSegment(cp(-0.4*2,0,0), cp(0.4*2,0, 0)),
            CGM.createLineSegment(cp(-0.4*2,0,0), cp(-0.4*2,0, 0.7*2))
        ),
        CGM.createLineSegment(cp(0.4*2,0,0), cp(0.4*2,0, 0.7*2))
    ),
    CGM.createArcThroughThreePoints(cp(-0.4*2, 0,0.7*2),cp(0,0,1*2),cp(0.4*2,0,0.7*2))
)
crownToothProfile = CGM.fill(crownToothProfile)
crownGearTooth = CGM.sweep(crownToothProfile,CGM.createLineSegment(cp(0,0,0), cp(0, dotWidth(1)/3,0)))
egs = CGM.getEdges(crownGearTooth)
crownGearTooth = CGM.fillet([egs[4],egs[8],egs[10]], 0.8)
egs = CGM.getEdges(crownGearTooth)
crownGearTooth = CGM.fillet([egs[7], egs[14]],0.8)
var crownGearTop = CGM.createCone(cp(0,dotWidth(1)/3,1.3), cp(0,dotWidth(1)/3+1.4,1.3), 0.7,0.5)
egs = CGM.getEdges(crownGearTop)
crownGearTop = CGM.fillet([egs[0], egs[4]], 0.3)
crownGearTooth = CGM.unite(crownGearTooth, crownGearTop)
helpers.push(crownGearTooth)

var rad = 4.8/2
var thirdDiam = 4.8/5
var len2 = dotWidth(2)

// subAxle is used to create axle shaped holes in gears, tires, and other places
var subAxle = CGM.createCylinder(cp(0,0,0), up, len2, rad)
subAxle = CGM.subtract(subAxle, CGM.createCuboid(cp(-rad, -rad, 0), cp(-thirdDiam, -thirdDiam, len2)))
subAxle = CGM.subtract(subAxle, CGM.createCuboid(cp(thirdDiam, thirdDiam, 0), cp(rad, rad, len2)))
subAxle = CGM.subtract(subAxle, CGM.createCuboid(cp(-rad, thirdDiam, 0), cp(-thirdDiam, rad, len2)))
subAxle = CGM.subtract(subAxle, CGM.createCuboid(cp(thirdDiam, -rad, 0), cp(rad, -thirdDiam, len2)))
subAxle = CGM.fillet(CGM.getEdges(subAxle), 0.5)
subAxle = CGM.rotate(subAxle, origin, cv(1,0,0), -Math.PI/2);
subAxle = CGM.translate(subAxle, 0, -dotWidth(1)/2, 0)
helpers.push(subAxle);

// Create a plate of the given size and color
function createPlateAt(width, height, color, x,y,z, fancy) {
    // Check the cache
    var descString = "" + width + "x" + height
    var cachename = "plates"
    if (fancy) {
        cachename = "fancy" + cachename;
    }
    if (brickCache[cachename][descString]) {
        // It was in the cache, so set the color and return it
        var tmp = CGM.clone(brickCache[cachename][descString]);
        tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
        tmp = CGM.translate(tmp, x,y,z);
        allPieces.push(tmp)
        return tmp
    }
    // It wasn't in the cache, so create it
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,h)
    for (var cpi = 0; cpi<width; ++cpi) {
        for (var cpj = 0; cpj<height; ++cpj) {
            trans.push(CGM.createTranslation(cpi * 8, cpj * 8, h));
        }
    }
    var thisKnob;
    if (fancy) {
        thisKnob = CGM.clone(fancyknob);
    } else {
        thisKnob = CGM.clone(knob);
    }
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
    brickCache[cachename][descString] = blockSoFar;

    // Set the color and return it
    var tmp = CGM.clone(brickCache[cachename][descString]);
    tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
    tmp = CGM.translate(tmp, x,y,z);
    allPieces.push(tmp)
    return tmp
}

function createFlatPlateAt(width, height, color, x,y,z) {
    // Check the cache
    var descString = "" + width + "x" + height
    var cachename = 'flatplates'
    if (brickCache[cachename][descString]) {
        // It was in the cache, so set the color and return it
        var tmp = CGM.clone(brickCache[cachename][descString]);
        tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
        tmp = CGM.translate(tmp, x,y,z);
        allPieces.push(tmp)
        return tmp
    }
    // It wasn't in the cache, so create it
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,h)

    blockSoFar = CGM.subtract(blockSoFar, CGM.createCuboid(1.2,1.2,0, width*P-1.4,height*P-1.4,h - 1.0))

    var thisHole = CGM.clone(smallHole)
    blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHole), trans));

    if (width>1 && height>1) {
        trans = new Array()
        for (var uci = 0; uci<width-1; ++uci) {
            for (var ucj = 0; ucj<height-1; ++ucj) {
                trans.push(CGM.createTranslation(uci * 8, ucj * 8, 0));
            }
        }
        var thisCyl = CGM.clone(plateUnderCylinder);
        blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisCyl), trans));
    }
    var bedges = CGM.getEdges(blockSoFar)
    blockSoFar = CGM.chamfer([bedges[9], bedges[11], bedges[13], bedges[15]], 0.2)
    // CGM.Part.remove(thisCyl)
    // Add it to the cache
    brickCache[cachename][descString] = blockSoFar;

    // Set the color and return it
    var tmp = CGM.clone(brickCache[cachename][descString]);
    tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
    tmp = CGM.translate(tmp, x,y,z);
    allPieces.push(tmp)
    return tmp
}

function createTechPlateAt(width, height, color, x,y,z, fancy) {
    var cachename = "techplates"
    if (fancy) {
        cachename = "fancy" + cachename;
    }
    // Check the cache
    var descString = "" + width + "x" + height
    if (brickCache[cachename][descString]) {
        // It was in the cache, so set the color and return it
        var tmp = CGM.clone(brickCache[cachename][descString]);
        tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
        tmp = CGM.translate(tmp, x,y,z);
        allPieces.push(tmp)
        return tmp
    }
    // It wasn't in the cache, so create it
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,h)
    for (var cpi = 0; cpi<width; ++cpi) {
        for (var cpj = 0; cpj<height; ++cpj) {
            trans.push(CGM.createTranslation(cpi * 8, cpj * 8, h));
        }
    }
    
    var thisKnob;
    if (fancy) {
        thisKnob = CGM.clone(fancyknob);
    } else {
        thisKnob = CGM.clone(knob);
    }
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
    var thisPlateHole = CGM.clone(techPlateHole);
    blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisPlateHole), trans));
    // CGM.Part.remove(thisCyl)
    // Add it to the cache
    brickCache[cachename][descString] = blockSoFar;

    // Set the color and return it
    var tmp = CGM.clone(brickCache[cachename][descString]);
    tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
    tmp = CGM.translate(tmp, x,y,z);
    allPieces.push(tmp)
    return tmp
}

// The block cache
function createBlockAt(width, height, color, x,y,z,fancy) {
    var cachename = "blocks"
    if (fancy) {
        cachename = "fancy" + cachename;
    }
    // Check the cache
    var descString = "" + width + "x" + height
    if (brickCache[cachename][descString]) {
        // It was 
        var tmp = CGM.clone(brickCache[cachename][descString]);
        tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
        tmp = CGM.translate(tmp, x,y,z)
        allPieces.push(tmp)
        return tmp
    }
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,3*h)
    blockSoFar = CGM.subtract(blockSoFar, CGM.createCuboid(1.2,1.2,0, width*P-1.4,height*P-1.4,3*h - 1.0))

    for (var cpi = 0; cpi<width; ++cpi) {
        for (var cpj = 0; cpj<height; ++cpj) {
            trans.push(CGM.createTranslation( cpi * 8,  cpj * 8, 3*h));
        }
    }
    var thisKnob;
    if (fancy) {
        thisKnob = CGM.clone(fancyknob);
    } else {
        thisKnob = CGM.clone(knob);
    }
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
    
    brickCache[cachename][descString] = blockSoFar;
    
    var tmp = CGM.clone(brickCache[cachename][descString]);
    tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
    tmp = CGM.translate(tmp, x,y,z)
    allPieces.push(tmp)
    return tmp
}


function createBeamAt(width, height, color, x,y,z) {
    // if (((width!=1 && height<2)) || ((height != 1) && width<2)) {
    //     return;
    // }
    // Check the cache
    var descString = "" + width + "x" + height
    if (brickCache['techbeams'][descString]) {
        // It was 
        var cc = LEGO_COLORS[color];
        var tmp = CGM.clone(brickCache['techbeams'][descString]);
        tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
        tmp = CGM.translate(tmp, x,y,z);
        allPieces.push(tmp)
        return tmp

    }
    var trans = new Array()
    var blockSoFar = CGM.createCuboid(0,0,0,width*P-0.2,height*P-0.2,3*h)
    blockSoFar = CGM.subtract(blockSoFar, CGM.createCuboid(1.2,1.2,0, width*P-1.4,height*P-1.4,3*h - 1.0))

    
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
        var thisHoleBase = CGM.clone(techUnderCylinderFront);
        blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHoleBase), trans))

        var thisHole = CGM.clone(techHoleFront);
        blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHole), trans))
    } else if (height == 1) {
        for (var wi = 0;wi<width-1; ++wi) {
            trans.push(CGM.createTranslation(wi*8, 0, 0));
            ;
        }
        var thisHoleBase = CGM.clone(techUnderCylinderLeft);
        blockSoFar = CGM.unite(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHoleBase), trans))
        
        var thisHole = CGM.clone(techHoleLeft);
        blockSoFar = CGM.subtract(blockSoFar, CGM.applyPatternToFeature(CGM.getFaces(thisHole), trans))
    }
    
    brickCache['techbeams'][descString] = blockSoFar;
    
    var tmp = CGM.clone(brickCache['techbeams'][descString]);
    tmp = CGM.Property.setColor(tmp, LEGO_COLORS[color])
    tmp = CGM.translate(tmp, x,y,z)
    allPieces.push(tmp)
    return tmp
}

var axleDescs = ["up", "left", "front"]
function createAxleAt(x,y,z,length, direction, arot) {
    var rad = 4.8/2
    var thirdDiam = 4.8/5
    var thisLen = dotWidth(length)
    
    var descString = axleDescs[direction] + length;
    if (brickCache['axles'][descString]) {
        tmp = CGM.Property.setRGBA(CGM.clone(brickCache['axles'][descString]), 20,20,20,255);
        if (arot) {
            App.print("Rotating axle: " + arot)
            switch (direction) {
            case LEGO_AXLE_UP:
                tmp = CGM.rotate(tmp, cp(0,0,0), up, arot)
                break;
            case LEGO_AXLE_LEFT:
                tmp = CGM.rotate(tmp, cp(0,0,0), left, arot)
                break;
            default:
                tmp = CGM.rotate(tmp, cp(0,0,0), front, arot)
                break;
            }
        }
        tmp = CGM.translate(tmp, x,y,z)
        allPieces.push(tmp)
        return tmp
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

    var tmp;
    switch (direction) {
    case LEGO_AXLE_UP:
        brickCache['axles']["up" + length] = thisAxle
        tmp = CGM.PropertysetRGBA(CGM.clone(brickCache['axles']["up" + length]), 20,20,20,255)
        tmp = CGM.rotate(thisAxle, cp(0,0,0), up, arot)
        tmp = CGM.translate(tmp, x,y,z)
        allPieces.push(tmp)
        return tmp
        break;
    case LEGO_AXLE_LEFT:
        thisAxle = CGM.rotate(thisAxle, origin, cv(1,0,0), -Math.PI/2)
        brickCache['axles']["left" + length] = thisAxle
        tmp = CGM.Property.setRGBA(CGM.clone(brickCache['axles']["left" + length]), 20,20,20,255);
        tmp = CGM.rotate(tmp, cp(0,0,0), left, arot)
        tmp = CGM.translate(tmp, x,y,z)
        allPieces.push(tmp)
        return tmp
        break;
    default:
        thisAxle = CGM.rotate(thisAxle, origin, cv(0,1,0), -Math.PI/2)
        brickCache['axles']["front" + length] = thisAxle
        tmp = CGM.Property.setRGBA(CGM.clone(brickCache['axles']["front" + length]), 20,20,20,255);
        tmp = CGM.rotate(tmp, cp(0,0,0), front, arot)
        tmp = CGM.translate(tmp, x,y,z)
        allPieces.push(tmp)
        return tmp
    }
    return;
}
function rotateToDirection(parts, normal, arot) {
    var rval = new Array()
    for (prt in parts) {
        rim = parts[prt]
        if (arot) {
            App.print("Rotating: " + arot)
            rim = CGM.rotate(rim, cp(0,0,0), cv(0,-1,0), arot)
        }
        if (normal == LEGO_AXLE_UP) {
            rim = CGM.rotate(rim, cp(0,0,0), cv(1,0,0), -Math.PI/2)
        } else if (normal == -LEGO_AXLE_UP) {
            rim = CGM.rotate(rim, cp(0,0,0), cv(1,0,0), Math.PI/2)
        } else if (normal == LEGO_AXLE_LEFT) {
            ;
        } else if (normal == -LEGO_AXLE_LEFT) {
            rim = CGM.rotate(rim, cp(0,0,0), cv(0,1,0), -Math.PI)
        } else if (normal == LEGO_AXLE_FRONT) {
            rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), Math.PI/2)
        } else if (normal == -LEGO_AXLE_FRONT) {
            rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), -Math.PI/2)
        }
        rval.push(rim)
    }
    return rval
}


function createSmallGearAt(x,y,z,normal, arot) {
    var gear;
    if (brickCache["gears"]["small"]) {
        gear = CGM.clone(brickCache["gears"]["small"])
    } else {
        var gear = CGM.createCylinder(cp(0,0,0), left, dotWidth(1), 6.2/2)
        gear = CGM.subtract(gear, CGM.clone(subAxle))
        gear = CGM.fillet(CGM.getEdges(gear), 0.125)

        for (var i = 0; i<8;++i) {
            var thisTooth = CGM.clone(gearTooth)
            thisTooth = CGM.translate(thisTooth, 0,0,0.9*6.2/2)
            thisTooth = CGM.rotate(thisTooth, cp(0,0,0), left, i * Math.PI/4)
            gear = CGM.unite(gear, thisTooth)
        }
        
        brickCache["gears"]["small"] = gear
        gear = CGM.clone(brickCache["gears"]["small"])
        
    }
    
    var tmp = rotateToDirection([gear], normal, arot)
    gear = tmp[0]
    gear = CGM.translate(gear, x,y,z)
    gear = CGM.Property.setColor(gear, LEGO_COLORS[LEGO_GREY])
    allPieces.push(gear)
    return gear
}

function createCrownGearAt(x,y,z, normal,arot) {
    var gear;
    if (brickCache["gears"]["crown"]) {
        gear = CGM.clone(brickCache["gears"]["crown"])
    } else {
        var gear = CGM.createCylinder(cp(0,0,0), left, dotWidth(1)/3, dotWidth(1.5)-1.4)
        gear = CGM.subtract(gear, CGM.createCylinder(cp(0,0,0), left, dotWidth(1)/3, dotWidth(0.7)))
        gear = CGM.unite(gear, CGM.createCuboid(cp(-dotWidth(0.7), 0, -2.8), cp(dotWidth(0.7), dotWidth(1)/3,-0.4)))
        gear = CGM.unite(gear, CGM.createCuboid(cp(-dotWidth(0.7), 0, 0.4), cp(dotWidth(0.7), dotWidth(1)/3,2.8)))
        var hub = CGM.createCylinder(cp(0,0,0), left, dotWidth(1), 6.2/1.8)
        egs = CGM.getEdges(hub)
        hub = CGM.fillet([egs[2], egs[5]], 0.5)

        gear = CGM.unite(gear, hub)
        gear = CGM.subtract(gear, CGM.createCuboid(cp(-dotWidth(0.7), 0,-0.4), cp(dotWidth(0.7), dotWidth(1), 0.4)))
        gear = CGM.fillet(CGM.getEdges(gear), 0.2)
        
        gear = CGM.subtract(gear, CGM.clone(subAxle))

        // 
        // gear = CGM.fillet(CGM.getEdges(gear), 0.125)
        
        for (var i = 0; i<24;++i) {
            var thisTooth = CGM.clone(crownGearTooth)
            
            thisTooth = CGM.translate(thisTooth, 0,0,dotWidth(1.5)-1.4)
            thisTooth = CGM.rotate(thisTooth, cp(0,0,0), left, i * Math.PI/12)
            gear = CGM.unite(gear, thisTooth)
        }
        
        brickCache["gears"]["crown"] = gear
        gear = CGM.clone(brickCache["gears"]["crown"])
    }
    var tmp = rotateToDirection([gear], normal, arot)
    gear = tmp[0]
    gear = CGM.translate(gear, x,y,z)
    gear = CGM.Property.setColor(gear, LEGO_COLORS[LEGO_GREY])
    allPieces.push(gear)
    return gear
}

// function createBigGearAt(direction, x,y,z) {
//     var gear = CGM.createCylinder(cp(0,0,0), up, dotWidth(1)*0.75, axleHeight())
//     gear = CGM.translate(gear, x,y,z)
//     allPieces.push(gear)
//     return gear
// }


function createSmallTireAt(x,y,z, normal, arot) {
    var tire;
    var rim;
    if (brickCache["smalltire"]["rim"]) {
        tire = CGM.clone(brickCache["smalltire"]["tire"])
        rim = CGM.clone(brickCache["smalltire"]["rim"])
    } else {

        tire = CGM.createCylinder(cp(0,0,0), left, dotWidth(1), dotWidth(3)/2)
        tire = CGM.subtract(tire, CGM.createCylinder(cp(0,0,0), left, dotWidth(1), dotWidth(2.8)/3))
        for (var i = 0; i<60; ++i) {
            var thisBlock = CGM.createCuboid(0,0,dotWidth(2.8)/2, dotWidth(0.2), 0.5*dotWidth(1), dotWidth(3.1)/2)
            if (i%2 ==0) {
                thisBlock = CGM.translate(thisBlock, 0, dotWidth(1)/2, 0)
            }
            thisBlock = CGM.rotate(thisBlock, cp(0,0,0), left, i * ((2*Math.PI)/60))
            thisBlock = CGM.fillet([CGM.getEdges(thisBlock)[2] ], 0.5)
            tire = CGM.unite(tire, thisBlock)
        }

        rim = CGM.createCylinder(cp(0,0,0), left, dotWidth(1), dotWidth(3)/3)
        rim = CGM.subtract(rim, CGM.clone(subAxle))
        rim = CGM.fillet(CGM.getEdges(rim), 0.5)
        brickCache["smalltire"]["tire"] = tire
        brickCache["smalltire"]["rim"] = rim
        tire = CGM.clone(brickCache["smalltire"]["tire"])
        rim = CGM.clone(brickCache["smalltire"]["rim"])
        
    }
    var tmp = rotateToDirection([rim, tire], normal, arot)
    rim = tmp[0]
    tire = tmp[1]

    // if (normal == LEGO_AXLE_UP) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(1,0,0), -Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(1,0,0), -Math.PI/2)
    // } else if (normal == -LEGO_AXLE_UP) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(1,0,0), Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(1,0,0), Math.PI/2)
    // } else if (normal == LEGO_AXLE_LEFT) {
    //     ;
    // } else if (normal == -LEGO_AXLE_LEFT) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), -Math.PI)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(0,0,1), -Math.PI)
    // } else if (normal == LEGO_AXLE_FRONT) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(0,0,1), Math.PI/2)
        
    // } else if (normal == -LEGO_AXLE_FRONT) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), -Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(0,0,1), -Math.PI/2)
    // }

    rim = CGM.translate(CGM.Property.setRGBA(rim, 255,255,255,255), x,y,z)
    
    tire = CGM.translate(CGM.Property.setRGBA(tire, 20,20,20,255), x,y,z)
    allPieces.push(rim)
    allPieces.push(tire)
    return [rim, tire]
}


function createBigTireAt(x,y,z, normal, arot) {
    var tire;
    var rim;
    if (brickCache["bigtire"]["rim"]) {
        tire = CGM.clone(brickCache["bigtire"]["tire"])
        rim = CGM.clone(brickCache["bigtire"]["rim"])
    } else {
        tire = CGM.createCylinder(cp(0,0,0), left, dotWidth(2), dotWidth(5.8)/2)
        tire = CGM.subtract(tire, CGM.createCylinder(cp(0,0,0), left, dotWidth(2), dotWidth(6)/3))
        tire = CGM.fillet(CGM.getEdges(tire), 0.5)

        for (var i = 0; i<60; ++i) {
            var thisBlock = CGM.createCuboid(0,0,dotWidth(5.8)/2, dotWidth(0.4), dotWidth(1), dotWidth(6)/2)
            if (i%2 ==0) {
                thisBlock = CGM.translate(thisBlock, 0, dotWidth(1), 0)
            }
            thisBlock = CGM.rotate(thisBlock, cp(0,0,0), left, i * ((2*Math.PI)/60))
            thisBlock = CGM.fillet([CGM.getEdges(thisBlock)[2] ], 0.5)
            tire = CGM.unite(tire, thisBlock)
        }

        rim = CGM.createCylinder(cp(0,0,0), left, dotWidth(2), dotWidth(6)/3)
        rim = CGM.subtract(rim, CGM.createCylinder(cp(0,dotWidth(0.5),0), left, dotWidth(2), dotWidth(6)/3.5))

        rim = CGM.subtract(rim, CGM.createCylinder(cp(0,0,0), left, dotWidth(2), 4.8/2))

        for (var i = 0; i<6;++i) {
            var thisHole = CGM.createCylinder(cp(0,0,0), left, dotWidth(2), 4.8/2)
            thisHole = CGM.translate(thisHole, dotWidth(1), 0,0)
            thisHole = CGM.rotate(thisHole, cp(0,0,0), left, i * Math.PI/3)
            rim = CGM.subtract(rim, thisHole)
        }
        rim = CGM.fillet(CGM.getEdges(rim), 0.5)
        brickCache["bigtire"]["tire"] = tire
        brickCache["bigtire"]["rim"] = rim
        tire = CGM.clone(brickCache["bigtire"]["tire"])
        rim = CGM.clone(brickCache["bigtire"]["rim"])
    }
    var tmp = rotateToDirection([rim, tire], normal, arot)
    rim = tmp[0]
    tire = tmp[1]

    // if (normal == LEGO_AXLE_UP) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(1,0,0), -Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(1,0,0), -Math.PI/2)
    // } else if (normal == -LEGO_AXLE_UP) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(1,0,0), Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(1,0,0), Math.PI/2)
    // } else if (normal == LEGO_AXLE_LEFT) {
    //     ;
    // } else if (normal == -LEGO_AXLE_LEFT) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), -Math.PI)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(0,0,1), -Math.PI)
    // } else if (normal == LEGO_AXLE_FRONT) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(0,0,1), Math.PI/2)
        
    // } else if (normal == -LEGO_AXLE_FRONT) {
    //     rim = CGM.rotate(rim, cp(0,0,0), cv(0,0,1), -Math.PI/2)
    //     tire = CGM.rotate(tire, cp(0,0,0), cv(0,0,1), -Math.PI/2)
    // }

    rim = CGM.translate(CGM.Property.setRGBA(rim, 255,255,255,255), x,y,z)
    
    tire = CGM.translate(CGM.Property.setRGBA(tire, 20,20,20,255), x,y,z)
    allPieces.push(rim)
    allPieces.push(tire)
    return [rim, tire]
}

function createPulleyAt(x,y,z, normal, arot) {
    var pulley;
    if (brickCache["pulleys"]["medium"]) {
        pulley = CGM.clone(brickCache["pulleys"]["medium"])
    } else {
        var outter = CGM.createCylinder(cp(0,0,0), left, dotWidth(1)/3, dotWidth(1.5))
        outter = CGM.subtract(outter, CGM.createCylinder(cp(0,0,0), left, dotWidth(1)/3, dotWidth(1.25)))
        egs = CGM.getEdges(outter)
        outter = CGM.chamfer([egs[6],egs[7],egs[8],egs[9]], 0.6)
        egs = CGM.getEdges(outter)
        outter = CGM.fillet([egs[0], egs[2], egs[4], egs[5]], 0.5)

        var tw = dotWidth(1)/3
        var pulley = CGM.unite(outter, CGM.createCylinder(cp(0,tw/5,0), left, 3*tw/5, dotWidth(1.4)))
        pulley = CGM.unite(pulley, CGM.createCylinder(cp(0,0,0), left, dotWidth(1)/3, 6.2/2))

        for (var i = 0; i<6;++i) {
            var thisHole = CGM.createCylinder(cp(0,0,0), left, dotWidth(2), 4.8/2)
            thisHole = CGM.translate(thisHole, dotWidth(1), 0,0)
            thisHole = CGM.rotate(thisHole, cp(0,0,0), left, i * Math.PI/3)
            pulley = CGM.subtract(pulley, thisHole)
        }
        
        brickCache["pulleys"]["medium"] = gear
        gear = CGM.clone(brickCache["pulleys"]["medium"])
        
    }
    
    var tmp = rotateToDirection([pulley], normal, arot)
    pulley = tmp[0]
    pulley = CGM.translate(pulley, x,y,z)
    pulley = CGM.Property.setColor(pulley, LEGO_COLORS[LEGO_GREY])
    return gear
}

function createConnectorAt(x,y,z) {
}

function createSmallConnectorAt(x,y,z) {
}

function randomColor() {
    return Math.floor(Math.random()*(LEGO_WHITE+1))
}

// function createBlockAt(width, height, color, x,y,z, fancy) {
//     var tmp = createBlock(width, height, color, fancy);
//     return CGM.translate(tmp, x,y,z);
// }

// function createBeamAt(width, height, color, x,y,z) {
//     var tmp = createTechnicBeam(width, height, color)
//     return CGM.translate(tmp, x,y,z);
// }
// function createPlateAt(width, height, color, x,y,z, fancy) {
//     var tmp = createPlate(width, height, color, fancy);
//     return CGM.translate(tmp, x,y,z);
// }

// function createTechPlateAt(width, height, color, x,y,z, fancy) {
//     var tmp = createTechnicPlate(width, height, color, fancy);
//     return CGM.translate(tmp, x,y,z);
// }

// function createAxleAt(x,y,z,length, direction, arot) {
//     var tmp = createAxle(length, direction,arot)
//     return CGM.translate(tmp, x,y,z)
// }


function createTowerAt(levels, xp,yp, zp) {
    for (var li = 0; li<levels; ++li) {
        var curHeight = (blockHeight(li));
        // var plate1 = createPlateAt(4,4, randomColor(), 0,0, curHeight);
        // allPieces.push(plate1);
        // curHeight += plateHeight(1)
        if (0 == (li % 2)) {
            if (Math.random()>0.5) {
                var block1 = createBlockAt(4,2, randomColor(), 0+xp,0+yp, curHeight+zp)
                if (Math.random()>0.5) {
                    var block2 = createBlockAt(4,2, randomColor(), 0+xp, dotWidth(2)+yp, curHeight+zp)
                }
            } else {
                var block2 = createBlockAt(4,2, randomColor(), 0+xp, dotWidth(2)+yp, curHeight+zp)
            }
        } else {
            if (Math.random()>0.5) {
                var block1 = createBlockAt(2,4, randomColor(), 0+xp, 0+yp, curHeight+zp)
                if (Math.random()>0.5) {
                    var block2 = createBlockAt(2,4, randomColor(), dotWidth(2)+xp, 0+yp, curHeight+zp)
                }
            } else {
                var block2 = createBlockAt(2,4, randomColor(), dotWidth(2)+xp, 0+yp, curHeight+zp)
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
    }
    var top = createPlateAt(width, height, randomColor(), 0+xp,0+yp, blockHeight(depth)+zp)
}

function clearPieces() {
    for (var pc in allPieces) {
        CGM.Part.remove(allPieces[pc])
    }
    allPieces = new Array();
}

function lego_cleanup() {
    for (var idx in brickCache) {
        for (var val in brickCache[idx]) {
            CGM.Part.remove(brickCache[idx][val])
        }
    }
    for (hlp in helpers) {
        CGM.Part.remove(helpers[hlp])
    }
}
function createTower2() {
    createTableAt(8,8,8, dotWidth(1),dotWidth(1),blockHeight(10) + plateHeight(1))
    createTableAt(6,6,6, dotWidth(2),dotWidth(2),blockHeight(18) + plateHeight(2))
    createTableAt(4,4,4, dotWidth(3),dotWidth(3),blockHeight(24) + plateHeight(3))
    createTowerAt(20, dotWidth(3), dotWidth(3), blockHeight(28))
}
// for (var i = 0;i<10; ++i) {
//     allPieces.push(createBlockAt(2,2, randomColor(), dotWidth(4), dotWidth(4), blockHeight(28+i) + plateHeight(4)))
// }

function createTruckBase() {
    createBeamAt(16,1,LEGO_YELLOW, 0,0,0)
    createBeamAt(16,1,LEGO_YELLOW, 0,dotWidth(7),0)

    createBeamAt(16,1,LEGO_YELLOW, dotWidth(14),dotWidth(1),0)
    createBeamAt(16,1,LEGO_YELLOW, dotWidth(14),dotWidth(6),0)

    createTechPlateAt(2,8, LEGO_RED, 0,0,blockHeight(1),true)
    createTechPlateAt(2,8, LEGO_RED, dotWidth(6),0,blockHeight(1),true)
    createTechPlateAt(2,8, LEGO_RED, dotWidth(14),0,blockHeight(1),true)

    createTechPlateAt(2,8, LEGO_RED, 0,0,plateHeight(-1))
    createTechPlateAt(2,8, LEGO_RED, dotWidth(6),0,plateHeight(-1))
    createTechPlateAt(2,8, LEGO_RED, dotWidth(14),0,plateHeight(-1))

    createTechPlateAt(2,6, LEGO_RED, dotWidth(26),dotWidth(1),plateHeight(-1))
    createTechPlateAt(2,6, LEGO_RED, dotWidth(26),dotWidth(1),blockHeight(1),true)

    createBeamAt(8,1,LEGO_YELLOW, 0,0,blockHeight(1)+plateHeight(1))
    createBeamAt(8,1,LEGO_YELLOW, 0,dotWidth(7),blockHeight(1)+plateHeight(1))

    createAxleAt(12, LEGO_AXLE_LEFT, axleOffset(),dotWidth(-2),0)
    createAxleAt(12, LEGO_AXLE_LEFT, axleOffset() + dotWidth(7),dotWidth(-2),0)
    createAxleAt(10, LEGO_AXLE_LEFT, axleOffset() + dotWidth(26),dotWidth(-1),0)

    t1 = createBigTireAt(axleOffset() ,0,axleHeight(), -LEGO_AXLE_LEFT)
    t2 = createBigTireAt(axleOffset(),dotWidth(8),axleHeight(), LEGO_AXLE_LEFT)

    t3 = createBigTireAt(axleOffset() + dotWidth(7),0,axleHeight(), -LEGO_AXLE_LEFT)
    t4 = createBigTireAt(axleOffset() + dotWidth(7),dotWidth(8),axleHeight(), LEGO_AXLE_LEFT)

    t5 = createBigTireAt(axleOffset() + dotWidth(26),dotWidth(1),axleHeight(), -LEGO_AXLE_LEFT)
    t6 = createBigTireAt(axleOffset() + dotWidth(26),dotWidth(7),axleHeight(), LEGO_AXLE_LEFT)
}
function simpleGears() {
    beam = createBeamAt(8,1,LEGO_YELLOW, 0,0,0)
    a1 = createAxleAt(axleOffset() + dotWidth(0),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, 0)
    a2 = createAxleAt(axleOffset() + dotWidth(1),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, Math.PI/8)
    a3 = createAxleAt(axleOffset() + dotWidth(2),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, 0)
    a4 = createAxleAt(axleOffset() + dotWidth(3),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, Math.PI/8)
    a5 = createAxleAt(axleOffset() + dotWidth(5),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, 0)

    g1 = createSmallGearAt(axleOffset() + dotWidth(0),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, 0)
    g2 = createSmallGearAt(axleOffset() + dotWidth(1),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, Math.PI/8)
    g3 = createSmallGearAt(axleOffset() + dotWidth(2),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, 0)
    g4 = createSmallGearAt(axleOffset() + dotWidth(3),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, Math.PI/8)

    g5 = createCrownGearAt(axleOffset() + dotWidth(5),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, 0)
}

function angledGears() {
    beam = createBeamAt(8,1,LEGO_YELLOW, 0,0,0)
    a1 = createAxleAt(axleOffset() + dotWidth(5),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, Math.PI/8)
    g1 = createCrownGearAt(axleOffset() + dotWidth(5),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, -Math.PI/8)

    p1 = createTechPlateAt(2,6, LEGO_RED, dotWidth(2),0,plateHeight(-1))

    p2 = createTechPlateAt(2,6, LEGO_RED, dotWidth(2),0,blockHeight(1), true)

    crossBeam = createBeamAt(1,4,LEGO_YELLOW, dotWidth(3), dotWidth(1), 0)

    a2 = createAxleAt(dotWidth(5),axleOffset() + dotWidth(1),axleHeight(), 4, LEGO_AXLE_FRONT, 0)
    g2 = createSmallGearAt(dotWidth(4), axleOffset()+ dotWidth(1), axleHeight(), -LEGO_AXLE_FRONT, 0)

    a3 = createAxleAt(dotWidth(5),axleOffset() + dotWidth(3),axleHeight(), 4, LEGO_AXLE_FRONT, Math.PI/8)
    g3 = createCrownGearAt(dotWidth(4), axleOffset()+ dotWidth(3), axleHeight(), -LEGO_AXLE_FRONT, -Math.PI/8)
    // a1 = createAxleAt(axleOffset() + dotWidth(0),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, 0)
    // a2 = createAxleAt(axleOffset() + dotWidth(1),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, Math.PI/8)
    // a3 = createAxleAt(axleOffset() + dotWidth(2),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, 0)
    // a4 = createAxleAt(axleOffset() + dotWidth(3),dotWidth(-1),axleHeight(), 4, LEGO_AXLE_LEFT, Math.PI/8)
    // g1 = createSmallGearAt(axleOffset() + dotWidth(0),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, 0)
    // g2 = createSmallGearAt(axleOffset() + dotWidth(1),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, Math.PI/8)
    // g3 = createSmallGearAt(axleOffset() + dotWidth(2),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, 0)
    // g4 = createSmallGearAt(axleOffset() + dotWidth(3),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, Math.PI/8)


}
angledGears()
// g1 = createSmallGearAt(axleOffset(),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, 0)


// g2 = createSmallGearAt(axleOffset() + dotWidth(1),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, Math.PI/4)
// g4 = createSmallGearAt(axleOffset() + dotWidth(3),dotWidth(1),axleHeight(), LEGO_AXLE_LEFT, Math.PI/8)

// createTruckBase()
// createSmallTireAt(0,0,blockHeight(4), LEGO_AXLE_UP)
// createSmallTireAt(0,dotWidth(4),0, LEGO_AXLE_LEFT)
// t1 = createSmallTireAt(7.9,dotWidth(-1),axleHeight())
// t2 = createSmallTireAt(7.9, dotWidth(4),axleHeight())
// allPieces.push(createBeamAt(12,1,LEGO_YELLOW, 0,0,blockHeight(1)))
// allPieces.push(createBeamAt(10,1,LEGO_YELLOW, 0,0,blockHeight(2)))
// allPieces.push(createBeamAt(8,1,LEGO_YELLOW, 0,0,blockHeight(3)))
// allPieces.push(createBeamAt(6,1,LEGO_YELLOW, 0,0,blockHeight(4)))
// allPieces.push(createBeamAt(4,1,LEGO_YELLOW, 0,0,blockHeight(5)))
// allPieces.push(createBeamAt(2,1,LEGO_YELLOW, 0,0,blockHeight(6)))
// allPieces.push(createBeamAt(2,1,LEGO_YELLOW, 0, dotWidth(18), 0));
lego_cleanup();
// ཧྐྵྨླྺྼྻྂ

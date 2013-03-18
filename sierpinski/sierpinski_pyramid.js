cp = CGM.createPoint
cv = CGM.createVector
function ls(x1,y1,z1,x2,y2,z2) {
    return CGM.createLineSegment(cp(x1,y1,z1), cp(x2,y2,z2))
}
function pyramid(x,y,z,width,height,depth) {
    var pyrmid = CGM.fill(
        CGM.unite(
            CGM.unite(
                CGM.unite(
                    ls(x,y,z,x+width,y,z), ls(x+width,y,z, x+width,y+height,z)
                ),
                ls(x+width,y+height,z, x,y+height,z)
            ),
            ls(x,y+height,z,x,y,z)
        )
    )
    var side = CGM.fill(
        CGM.unite(
            CGM.unite(
                ls(x,y,z, x+width,y,z), ls(x+width,y,z, x+width/2,y+width/2,z+depth)
            ),
            ls(x+width/2,y+width/2,z+depth,x,y,z)
        )
    )
    pyrmid = CGM.unite(pyrmid, CGM.rotate(CGM.clone(side), cp(x+width/2,y+height/2,z), cv(0,0,1), Math.PI/2))
    pyrmid = CGM.unite(pyrmid, CGM.rotate(CGM.clone(side), cp(x+width/2,y+height/2,z), cv(0,0,1), Math.PI))
    pyrmid = CGM.unite(pyrmid, CGM.rotate(CGM.clone(side), cp(x+width/2,y+height/2,z), cv(0,0,1), -Math.PI/2))
    pyrmid = CGM.unite(pyrmid, side)
    return pyrmid
}

var levels = new Array()
for (i=0;i<9;++i) {
    levels.push(0)
}

function gen_pyramid(level, ox,oy,oz, owidth,oheight,odepth) {
    if (levels[level]) {
        return CGM.translate(CGM.clone(levels[level]), ox,oy,oz)
    }
    if (level == 0) {
        levels[0] = pyramid(0,0,0,owidth, oheight, odepth)
        return CGM.translate(CGM.clone(levels[0]), ox,oy,oz)
    } else {
        var nl = level-1
        var hw = owidth/2
        var hh = oheight/2
        var hd = odepth/2
        var p1 = CGM.unite(gen_pyramid(nl, ox,oy,oz,hw,hh,hd), gen_pyramid(nl, ox+hw,oy,oz,hw,hh,hd))
        p1 = CGM.unite(p1, gen_pyramid(nl, ox+hw,oy+hh,oz,hw,hh,hd))
        p1 = CGM.unite(p1, gen_pyramid(nl, ox,oy+hh,oz,hw,hh,hd))
        p1 = CGM.unite(p1, gen_pyramid(nl, ox+hw/2,oy+hh/2,oz+hd,hw,hh,hd))
        levels[level] = p1
        return CGM.clone(levels[level])
    }
}
App.clearDocument()
gen_pyramid(6,0,0,0,100,100,100)

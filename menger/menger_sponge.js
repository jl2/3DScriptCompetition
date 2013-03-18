cp = CGM.createPoint


function menger(olevel, owidth, ox,oy,oz) {
    var levels = new Array()
    for (var i=0;i<olevel; ++i) {
        levels.push(0);
    }

    function inner_menger(level, width, x,y,z) {
        if (levels[level]) {
            return CGM.translate(CGM.clone(levels[level]), x,y,z);
        }
        if (level == 0) {
            levels[0] = CGM.createCuboid(0,0,0,width,width,width);
            return CGM.translate(CGM.clone(levels[0]), x,y,z)
        } else {
            var nl = level - 1
            var nw = width / 3.0
            var xmw = 0
            var xiw = nw
            var xpw = 2*nw
            var ymw = 0
            var yiw = nw
            var ypw = 2*nw
            var zmw = 0
            var ziw = nw
            var zpw = 2*nw

            if (level != olevel) {
                var sofar = inner_menger(nl, nw, xmw,ymw,zmw);
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xmw, yiw, zmw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xmw, ypw, zmw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xmw, ymw, ziw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xmw, ypw, ziw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xmw, ymw, zpw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xmw, yiw, zpw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xmw, ypw, zpw))
                
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xiw, ymw,zmw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xiw, ypw,zmw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xiw, ymw,zpw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xiw, ypw,zpw))
                
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,ymw,zmw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,yiw,zmw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,ypw,zmw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,ymw,ziw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,ypw,ziw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,ymw,zpw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,yiw,zpw))
                sofar = CGM.unite(sofar, inner_menger(nl, nw, xpw,ypw,zpw))
                levels[level] = sofar;
		        return CGM.translate(CGM.clone(levels[level]), x,y,z)
            } else {
                var sofar = [inner_menger(nl, nw, xmw,ymw,zmw),
                ,inner_menger(nl, nw, xmw, yiw, zmw)
                ,inner_menger(nl, nw, xmw, ypw, zmw)
                ,inner_menger(nl, nw, xmw, ymw, ziw)
                ,inner_menger(nl, nw, xmw, ypw, ziw)
                ,inner_menger(nl, nw, xmw, ymw, zpw)
                ,inner_menger(nl, nw, xmw, yiw, zpw)
                ,inner_menger(nl, nw, xmw, ypw, zpw)
                
                ,inner_menger(nl, nw, xiw, ymw,zmw)
                ,inner_menger(nl, nw, xiw, ypw,zmw)
                ,inner_menger(nl, nw, xiw, ymw,zpw)
                ,inner_menger(nl, nw, xiw, ypw,zpw)
                
                ,inner_menger(nl, nw, xpw,ymw,zmw)
                ,inner_menger(nl, nw, xpw,yiw,zmw)
                ,inner_menger(nl, nw, xpw,ypw,zmw)
                ,inner_menger(nl, nw, xpw,ymw,ziw)
                ,inner_menger(nl, nw, xpw,ypw,ziw)
                ,inner_menger(nl, nw, xpw,ymw,zpw)
                ,inner_menger(nl, nw, xpw,yiw,zpw)
                ,inner_menger(nl, nw, xpw,ypw,zpw)]
            }
        }
    }

    var rval=inner_menger(olevel, owidth, ox,oy,oz);
    for (p in levels) {
        try {
            CGM.Part.remove(levels[p])
            levels[p] = 0;
        } catch (e) {
            App.print(e);
        }
    }
    return rval;
}
App.clearDocument()
menger(4,100,0,0,0)
CGM.Property.setRGBA(CGM.Part.getBodies(), 80,80,255,255)

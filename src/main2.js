



var app = angular.module("App", [])

app.controller("AppCtrl", function ($scope) {

	$scope.doSave = false
	$scope.name = "export"
	loadSvg = { state: false, content: undefined }

	var strokeWeight = 0.1 // 0.1 pour laser

	$scope.dim = {
		l  : 80,
		h  : 80,
		epp: 5,
		
		m  : 0,
		nb : 0,
		epb: 5,
		lbl: 10,

		lm : 12,
		lt : 10,
	}

	var img = undefined
	var svg = undefined

	var refresh = true
	$scope.saving = false


	window.onload = function() {
		var canvas = document.getElementById("myCanvas")
		paper.setup(canvas)

		var tool = new paper.Tool()
		var Path = paper.Path
		var Project = paper.project
		var Point = paper.Point
		var Group = paper.Group


		paper.view.onFrame = (ev) => {

			if (refresh) {

				// refresh = false

				Project.clear()

				var groupB = new Group([])
				var groupP = new Group([])

				d = $scope.dim


					// d.lm = 2 + d.epb * 2
					var L1 = 2 + d.epb*2



				x0 = d.lbl
				y0 = d.l

				// x1 = d.lm*2 + d.lbl
				x1 = L1*2 + d.lbl
				y1 = d.lm*2 + d.l

				x2 = x1 + d.m*2
				y2 = y1 + d.m*2

				x3 = d.epp-0.4
				y3 = d.l

				xt = d.epb
				yt = d.lt

				const c = 0.2645833333

				var geometries = []

				function tenon(x, y) { return new paper.Rectangle(x-xt/2, y-yt/2, xt, yt) }
				function tenon2(x, y) { 
					var l = d.epb * (d.nb + 3)
					return new paper.Rectangle(x-l/2, y-yt/2, l, yt+0.5) 
				}

				function trou(x, y) {
					l1 = y1 - d.lt*2
					n  = Math.floor(l1/d.lt/4)
					l2 = l1/n

					var res = []

					for (var i=0 ; i<=n ; i++) {
						l3 = d.epb/2 + d.lm/2 -2 + d.lbl/2
						res.push(tenon(-l3+x, i*l2+y), tenon(l3+x, i*l2+y))
					}

					if (n === 0) {
						res.push(tenon(-l3+x, y1/2), tenon(l3+x, y1/2))
					}

					return res
				}


				// base
				geometries.push(new paper.Rectangle(0, 0, x2, y2))
				// geometries.push(new paper.Rectangle(d.lm+d.m, d.lm+d.m, x0, y0))
				// trou(d.lm+d.m+x0/2, d.lm+d.m).forEach(elt => geometries.push(elt) )
				trou(L1+d.m+x0/2, d.lm+d.m).forEach(elt => geometries.push(elt) )


				// niveau led
				var ledPath = new Path()
					ledPath.strokeColor = "red"
					ledPath.add(new Point(x2+5, 0))
					ledPath.add(new Point(x2+5+x1, 0))
					ledPath.add(new Point(x2+5+x1, y1))
					// ledPath.add(new Point(x2+5+x1-d.lm, y1))
					// ledPath.add(new Point(x2+5+x1-d.lm, d.lm))
					// ledPath.add(new Point(x2+5+x1-d.lm-x0, d.lm))
					// ledPath.add(new Point(x2+5+x1-d.lm-x0, y1))
					ledPath.add(new Point(x2+5+x1-L1, y1))
					ledPath.add(new Point(x2+5+x1-L1, d.lm))
					ledPath.add(new Point(x2+5+x1-L1-x0, d.lm))
					ledPath.add(new Point(x2+5+x1-L1-x0, y1))

					ledPath.add(new Point(x2+5, y1))
					ledPath.add(new Point(x2+5, 0))

					var p = ledPath.position
					ledPath.position = new Point(p._x+5, p._y+5);
					ledPath.strokeWidth = strokeWeight

					groupB.addChild(ledPath)

				// trou(d.lm+x0/2+x2+5, d.lm).forEach(elt => geometries.push(elt) )
				trou(L1+x0/2+x2+5, d.lm).forEach(elt => geometries.push(elt) )


				// plaque haute
				geometries.push(new paper.Rectangle(x2+x1+10, 0, x1, y1))
				geometries.push(new paper.Rectangle(x2+x1+10+x1/2-x3/2, d.lm, x3, y3))
				// trou(d.lm+x0/2+x2+x1+10, d.lm).forEach(elt => geometries.push(elt) )
				trou(L1+x0/2+x2+x1+10, d.lm).forEach(elt => geometries.push(elt) )

				
				// plaques suplémentaires
				for (var i=0 ; i<d.nb ; i++) {
					geometries.push(new paper.Rectangle(x2+x1+10+(x1+5)*(i+1), 0, x1, y1))
					// geometries.push(new paper.Rectangle(x2+x1+10+(x1+5)*(i+1)+d.lm, d.lm, x0, y0))
					geometries.push(new paper.Rectangle(x2+x1+10+(x1+5)*(i+1)+L1, d.lm, x0, y0))
					// trou(d.lm+x0/2+x2+x1+10+(x1+5)*(i+1), d.lm).forEach(elt => geometries.push(elt) )
					trou(L1+x0/2+x2+x1+10+(x1+5)*(i+1), d.lm).forEach(elt => geometries.push(elt) )
				}

				// ajouts des tenons
				for (var i=0 ; i<10 ; i++) {
					var l = d.epb * (d.nb + 3)
					geometries.push(tenon2(10+i*(l + 5)+l/2, y2+d.lt+d.nb*d.epb))
					geometries.push(tenon2(10+i*(l + 5)+l/2, y2+d.lt*2+5+d.nb*d.epb))
				}


				// dessin bois
				geometries.forEach(geometry => {
					var path = Path.Rectangle(geometry)
					path.strokeColor = "red"
					path.strokeWidth = strokeWeight

					p = path.position
					path.position = new Point(p._x+5, p._y+5)

					groupB.addChild(path)
				})

				// ajout gravure pour bandeau led
				{
					var geometry = new paper.Rectangle(x2/2-d.lbl/2, 0, d.lbl, y2)
					var path = Path.Rectangle(geometry)
					path.strokeColor = "green"
					path.strokeWidth = strokeWeight

					p = path.position
					path.position = new Point(p._x+5, p._y+5)

					groupB.addChild(path)
				}

				geometries = []


				if ($scope.saving) {
					groupB.scale(1/c, new Point(0, 0))
					save("bois")
					Project.clear()
				}



				// plaque plexi
				x4 = d.l
				y4 = d.h + d.epb*(2+d.nb)
				geometries.push(new paper.Rectangle(x2+x1*1+10+(x1+5)*(d.nb+1)+10, 0, x4, y4))
				var linePath = new Path()
					linePath.strokeColor = "cyan"
					linePath.add(new Point(x2+x1*1+10+(x1+5)*(d.nb+1)+10, y4-d.epb*(2+d.nb)))
					linePath.add(new Point(x2+x1*1+10+(x1+5)*(d.nb+1)+10+d.l, y4-d.epb*(2+d.nb)))
					var p = linePath.position
					linePath.position = new paper.Point(p._x+5, p._y+5);

					if ($scope.saving) {
						linePath.scale(1/c, new Point(0, 0))
						linePath.position.x = linePath.bounds.width/2+ 5
					}

				
				// svg
				if (img) {
					svg = paper.project.importSVG(img)

					var coef = d.l / svg.bounds.width
					svg.scale(coef)
					d.h = svg.bounds.height
					svg.position = new Point(svg.bounds.width/2+x2+x1*1+10+(x1+5)*(d.nb+1)+10+5, svg.bounds.height/2+5)

					if ($scope.saving) {
						svg.scale(1/c, new Point(0, 0))
						svg.position = new Point(svg.bounds.width/2+5, svg.bounds.height/2+5)
					}

				}


				// dessin plexi
				geometries.forEach(geometry => {
					var path = Path.Rectangle(geometry)
					path.strokeColor = "red"
					path.strokeWidth = strokeWeight

					p = path.position
					path.position = new Point(p._x+5, p._y+5);

					if ($scope.saving) {
						path.scale(1/c, new Point(0, 0))
						path.position.x = path.bounds.width/2 + 5
						path.position.y = path.bounds.height/2 + 5
					}
				}) 

				if ($scope.saving) {
					save("plexi")
				}



				$scope.saving = false
				
			}
		}

	}

	document.getElementById("inputfile").addEventListener("change", function() {
		var fr = new FileReader()
		fr.onload = function() {
			img = fr.result
			refresh = true

			// console.log(img)
		}
		fr.readAsText(this.files[0])
	})

	// // document.addEventListener("DOMContentLoaded", function(event) { 
	// 	document.getElementById("download-to-svg").onclick = function(){
	// 		var fileName = "custom.svg"
	// 		var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}))
	// 		var link = document.createElement("a")
	// 		link.download = fileName
	// 		link.href = url
	// 		link.click()

	// 		console.log("ttes")

	// 		refresh = true
	// 		// saving  = true
	// 	}
	// // })

	function save(name) {
		var fileName = name + ".svg"
		var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}))
		var link = document.createElement("a")
		link.download = fileName
		link.href = url
		link.click()
	}

})
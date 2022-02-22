

var app = angular.module("App", [])

app.controller("AppCtrl", function ($scope) {

	$scope.doSave = false
	$scope.name = "export"
	loadSvg = { state: false, content: undefined }


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


	$scope.seeConsole = function() {
		console.log()
	}

	$scope.loadImg = function(val) {
		// console.log(val)
		loadSvg.state   = true
		loadSvg.content = val
	}


	new p5(p5Funct , document.getElementById("sketch"))

	var svg = undefined

	function p5Funct(p) {
		var img_ = undefined


		p.setup = function() {
			p.createCanvas(2000, 800, p.SVG)
			p.strokeWeight(1) // 0.1 pour le laser
			p.noFill()
		}

		p.draw = function() {
			p.background("white")
			p.stroke(255, 0, 0)

			const c = 0.2645833333

			
			p.translate(5, 5)


			// p.scale(1/c)
			if ($scope.doSave) {
				p.scale(1/c)
			}


			d = $scope.dim

			x0 = d.lbl
			y0 = d.l

			x1 = d.lm*2 + d.lbl
			y1 = d.lm*2 + d.l

			x2 = x1 + d.m*2
			y2 = y1 + d.m*2

			x3 = d.epp
			y3 = d.l

			xt = d.epb
			yt = d.lt

			function tenon(x, y) {
				p.rect(x-xt/2, y-yt/2, xt, yt)
			}

			function trou(x, y) {
				l1 = y1 - d.lt*2
				n  = Math.floor(l1/d.lt/4)
				l2 = l1/n

				for (var i=0 ; i<=n ; i++) {
					l3 = d.epp/2 + d.lm/2 + 2
					tenon(-l3+x, i*l2+y)
					tenon(l3+x, i*l2+y)
				}
			}

			// base
			p.rect(0, 0, x2, y2)
			p.rect(d.lm+d.m, d.lm+d.m, x0, y0)
			trou(d.lm+d.m+x0/2, d.lm+d.m)

			// niveau led
			p.beginShape()
				p.vertex(x2+5, 0)
				p.vertex(x2+5+x1, 0)
				p.vertex(x2+5+x1, y1)
				p.vertex(x2+5+x1-d.lm, y1)
				p.vertex(x2+5+x1-d.lm, d.lm)
				p.vertex(x2+5+x1-d.lm-x0, d.lm)
				p.vertex(x2+5+x1-d.lm-x0, y1)
				p.vertex(x2+5, y1)
			p.endShape(p.CLOSE)
			trou(d.lm+x0/2+x2+5, d.lm)

			// plaque haute
			p.rect(x2+x1+10, 0, x1, y1)
			p.rect(x2+x1+10+x1/2-x3/2, d.lm, x3, y3)
			trou(d.lm+x0/2+x2+x1+10, d.lm)

			// plaques suplémentaires
			for (var i=0 ; i<d.nb ; i++) {
				p.rect(x2+x1+10+(x1+5)*(i+1), 0, x1, y1)
				p.rect(x2+x1+10+(x1+5)*(i+1)+d.lm, d.lm, x0, y0)
				trou(d.lm+x0/2+x2+x1+10+(x1+5)*(i+1), d.lm)
			}

			if ($scope.doSave) {
				p.save($scope.name+"_socle.svg");
				p.background("white")
			}

			// plaque plexi
			x4 = d.l
			y4 = d.h + d.epb*(2+d.nb)
			p.rect(x2+x1*1+10+(x1+5)*(d.nb+1)+10, 0, x4, y4)
			p.stroke("cyan")
			p.line(x2+x1*1+10+(x1+5)*(d.nb+1)+10, y4-d.epb*(2+d.nb), x2+x1*1+10+(x1+5)*(d.nb+1)+10+d.l, y4-d.epb*(2+d.nb))

			// add svg
			if (loadSvg.state) {
				loadSvg.state = false


				img = new Image()
   		 		img.src = "test.jpg"
				

				console.log(img, img.canvas, img.elt)

				img_ = img

			}

			if (img_) {
				x = x2+x1*1+10+(x1+5)*(d.nb+1)+10
				y = d.epb*(2+d.nb)
				y = 0
				h = img_.height * $scope.dim.l / img_.width
				// p.drawingContext.drawImage(img_, x, -y, $scope.dim.l, h)
				p.image(img_, 0, 0, 50, 50)

				p.stroke("green")
				p.rect(50, 50, 50, 50)
			}

			if ($scope.doSave) p.save($scope.name+"_tablette.svg")

			// p.noLoop()

			if ($scope.doSave) {
				$scope.doSave = false
			}
		}
	}

})





// src : https://www.geeksforgeeks.org/how-to-read-a-local-text-file-using-javascript/ + https://stackoverflow.com/questions/22570357/angularjs-access-controller-scope-from-outside
document.getElementById("inputfile").addEventListener("change", function() {
	var fr = new FileReader()
	fr.onload = function() {
		var elt = document.querySelector('[ng-app=App]');
		var scope = angular.element(elt).scope();
		scope.loadImg(fr.result)
	}
	fr.readAsText(this.files[0])
})



window.addEventListener('contextmenu', function (e) { 
// do something here... 
e.preventDefault(); 
}, false);
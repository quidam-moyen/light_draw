


function setup() {
	createCanvas(500, 500, SVG);
	strokeWeight(1); // do 0.1 for laser
	stroke(255, 0, 0); // red is good for laser
	noFill(); // better not to have a fill for laser

	rectMode(CENTER)
}

function draw() {
	background("white")

	var l = 50
	const c = 0.2645833333

	var l_ = l / c
	
	rect(width/2, height/2, l_, l_)

	save("mySVG.svg"); // give file name
	print("saved svg");
	noLoop(); // we just want to export once
}



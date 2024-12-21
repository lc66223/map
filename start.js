const holder={
	"buttonBlockId":"buttons",
	"textBlockId":"textContent",
	"gBlockId":"gBlock",
	"svg":null,
	"data":null
};

async function start() {
 holder.svg = d3.select("svg");
 holder.data = await d3.json("data.json");
 holder.data.selected["js"] = null;
 addButtons(holder.data.components);
 loadContent(holder.data.selected.id);
 return;
}

function addButtons(components) {
	const ul = document.getElementById(holder.buttonBlockId);
	components.forEach((ele) => { 
		let b = createButton(ele);
		ul.appendChild(b);
	})
	return;
}

function createButton(ele) {
  const b = document.createElement("button");
  b.setAttribute("id", ele.id); //Use this to add attributes such as id, class, styles, or even event listeners like onclick
  b.setAttribute("type", "button"); 
  b.setAttribute("class", "buttonblock"); 
  b.innerHTML = "<li>" + ele.title + "</li>"; //Make sure to add button text if you don't want an empty button!!
  b.addEventListener("click", function(event){
		loadContent(ele.id);
	});
  return b;
}

function loadContent(id) {
	loadHtmlContent(id);
	loadJsContent(id);
	return;
}

async function loadJsContent(id) {
	const g = emptyG();
	let comp = findComponent(holder.data.selected.id);//old component
	if (exists(holder.data.selected.js)) {
		holder.data.selected.js.end(comp, g);
		deleteSelectedJs();
	}
	holder.data.selected.id = id;//new id
	comp = findComponent(id);
	let path = getFullPath(comp.svgPath) + "?t=" + Date.now();
	holder.data.selected.js = await import(path);
	//get "rect" element parameter and add it to comp like comp["rect"] = {} 
	//or pass to start()
	//holder.data.selected.js.start(comp, rect, g);
	holder.data.selected.js.start(comp, g);
	return;
}

function getFullPath(path) {
	let status = path.startsWith("/");
	if (!status) {
		let ind = window.location.pathname.lastIndexOf("/");
		let dir = window.location.pathname.substring(0, ind + 1);
		status = path.startsWith("./");
		if (status) {
			path = dir + path.substring(2);
		} else {
			path = dir + path;
		}
	}
	console.log(path);
	return path;
}

function emptyG() {
	console.log("emptyG()");
	const g = holder.svg.select("#" + holder.gBlockId);
	g.selectAll("*").remove();
	return g;
}

function exists(data) {
  return data !== undefined && data !== null;
}

async function loadHtmlContent(id) {
	const path = findComponent(id).contentPath
	const text = await d3.text(path);
	const div = document.getElementById(holder.textBlockId);
	div.innerHTML = text;
	return;
}

function findComponent(id) {
	return holder.data.components.find((element) => element.id == id);
}

async function deleteSelectedJs() {
	holder.data.selected.js = null;// Clear reference
	const cache = await caches.open("my-cache");
	const comp = findComponent(holder.data.selected.id);
	const path = comp.svgPath;
	await cache.delete(path);
	return;
}
/*	
var w = 500;
var h = 100;
					
var dataset = [
	[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
	[410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
];
*/
			
//Create SVG element
/*
var svg = d3.select("rect").append("svg").attr("width", w).attr("height", h);
svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return d[0];
	})
	.attr("cy", function(d) {
		return d[1];
	})
	.attr("r", function(d) {
		return Math.sqrt(h - d[1]);
	});

svg.selectAll("text")
	.data(dataset)
	.enter()
	.append("text")
	.text(function(d) {
		return d[0] + "," + d[1];
	})
	.attr("x", function(d) {
		return d[0];
	})
	.attr("y", function(d) {
		return d[1];
	})
	.attr("font-family", "sans-serif")
	.attr("font-size", "11px")
	.attr("fill", "white");
					
*/					

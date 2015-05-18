var fs = require('fs');
var Imagemin = require('imagemin');
var path = require('path');
window.jQuery = require('jquery.js');
var info = $('#info');
var imagePath;

// File Drop
var holder = document.getElementById('holder');
holder.ondragover = function() {
	return false;
};
holder.ondragleave = holder.ondragend = function() {
	return false;
};
holder.ondrop = function(e) {
	e.preventDefault();
	var file = e.dataTransfer.files[0];
	var files = e.dataTransfer.files;
	//console.log('File you dragged here is ' + file.path);
	imagePath = file.path;
	//console.log(JSON.stringify(files, null, 4));
	minifyImages(files);
	return false;
};



//var options = {
//	repace: 		true,
//	addToFolder: 	true
//};

//fs.writeFile(__dirname + '/options.json', JSON.stringify(options, null, 4));

// Get current options from file
var option = $('#options > div');
var options = JSON.parse(fs.readFileSync(__dirname + '/options.json'));

function writeOptionsToFile(){
	fs.writeFileSync(__dirname + '/options.json', JSON.stringify(options, null, 4));
};

function selectOptionFromFile(){
	var fileToSelect;
	if(options.replace) {
		fileToSelect = $('#replace');
	} else if (options.addToFolder) {
		fileToSelect = $('#addToFolder');
	}
	selectOption(fileToSelect);
};

selectOptionFromFile();



// Options Select
function selectOption(obj) {
	option.removeClass('selected');
	obj.addClass('selected');
	var selected = obj.attr('id');
	if (selected == 'replace') {
		options.replace = true;
		options.addToFolder = false;
	} else if (selected == 'addToFolder') {
		options.replace = false;
		options.addToFolder = true;
	}
	writeOptionsToFile();
};

option.on('click', function() {
	selectOption($(this));
});

function minifyImages(images) {
	var originalSize = 0;

	var imagesText = (images.length == 1 ? " image..." : " images...");
	info.text("Minifying " + images.length + " image...");
	var imagesArray = [];
	var imageNames = [];
	var destination;

	if(options.replace) {
		destination = path.dirname(images[0].path);
	} else if (options.addToFolder) {
		destination = path.dirname(images[0].path) + '/minified';
	}

	for(i = 0; i < images.length; i++) {
		imagesArray.push(images[i].path);
		imageNames.push(images[i].name);
		var originalFile = fs.statSync(images[i].path);
		originalSize += originalFile["size"];
	}
	console.log("Image Names: " + imageNames);
	console.log("Original Total Size: " + originalSize);
	var minified = new Imagemin();
	minified.src(imagesArray);
	minified.dest(destination);
	minified.use(Imagemin.optipng({optimizationLevel: 3}));
	minified.use(Imagemin.gifsicle({interlaced: true}));
	minified.use(Imagemin.jpegtran({progressive: true}));
	minified.use(Imagemin.svgo());
	minified.run(function(err, files){
		var newSize = 0;

		for(i = 0; i < imageNames.length; i++) {
			var minifiedFile = fs.statSync(destination + '/' + imageNames[i]);
			newSize += minifiedFile["size"];
		}
		var percentSaved = Math.round((1 - (newSize / originalSize))*100) + "%";
		info.text("Done! Saved: " + percentSaved);
	});

};





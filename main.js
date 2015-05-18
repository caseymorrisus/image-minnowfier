var app = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are close.
app.on('window-all-closed', function() {
	app.quit();
});

app.on('ready', function() {
	// Create the main browser window
	mainWindow = new BrowserWindow({ width: 800, height: 600 });

	// load the index.html of the app into the main window
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// Emmited when he window is closed.
	mainWindow.on('closed', function() {
		mainWindow.null;
	});
});
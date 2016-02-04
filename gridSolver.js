var fs = require('fs');
var _ = require('underscore');

var gridHandler = require('./gridHandler.js');
var gridProcessor = require('./gridProcessor.js');

// main execution
var input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

if (!gridHandler.validateInput(input)) {
	console.log('Invalid input: missing rows or columns');
} else {
	var runningGrid = gridHandler.buildGrid(input);
	console.log('Input grid:');
	gridHandler.printGrid(runningGrid);
	console.log('----------');
	console.log('Calculating...');

	_.each(gridProcessor.solve(runningGrid), gridHandler.printGrid);
}
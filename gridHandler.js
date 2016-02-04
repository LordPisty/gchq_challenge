var _ = require('underscore');
exports.validateInput = function(input) {
	return input.grid.rows && input.grid.columns;
};
exports.buildGrid = function(input) {
	var grid = {
		data: []
	};
	grid.rows = input.grid.rows;
	grid.columns = input.grid.columns;
	for (i = 0; i < grid.rows.length; i++) {
		grid.data[i] = _.map(new Array(grid.columns.length), function() {return undefined;});
	}
	_.each(input.grid.cells, function(cell) {
		grid.data[cell[0]][cell[1]] = 1;
	});
	return grid;
};
exports.printGrid = function(grid) {
	for (i = 0; i < grid.data.length; i++) {
		var row = '';
		for (j = 0; j < grid.data[i].length; j++) {
			row += grid.data[i][j] ? '\u25A0' : ' ' ;
		}
		console.log(row);
	}
};
exports.cloneWith = function(grid, row, idx) {
	var retVal = {
		rows: grid.rows,
		columns: grid.columns,
		data: _.map(grid.data, _.clone)
	};
	if (row) {
		retVal.data[idx] = _.clone(row);
	}
	return retVal;
};
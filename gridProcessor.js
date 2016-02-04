var _ = require('underscore');

var utils = require('./utils.js');
var gridHandler = require('./gridHandler.js');
var KKcache = require('./KKcache.js');

var sequenceCache = KKcache.getKKcache();
var feasibilityCache = KKcache.getKKcache();

// single array generation
var placeSequenceR = function(acc, arr, start, seq) {
	if (utils.empty(seq)) {
		var newArr = _.clone(arr);
		var valid = true;
		_.each(_.range(start, arr.length), function(idx) {
			if (newArr[idx] == 1) {
				valid = false;
				return;
			} else {
				newArr[idx] = 0;
			}
		});
		if (valid) {
			acc.push(newArr);
		}
		return;
	}
	var seqLength = utils.sum(seq) + (seq.length - 1);
	var currSeq = _.head(seq);
	var z = start;
	for (; z <= arr.length - seqLength; z++) {
		var newArr = _.clone(arr);
		var l = start;
		for (; l < z; l++) {
			if (newArr[l] == 1) {
				continue;
			} else {
				newArr[l] = 0;
			}
		}
		var q = 0;
		for (; q < currSeq; q++) {
			newArr[z+q] = 1;
		}
		if (z+q < arr.length) {
			if (newArr[z+q] == 1) {
				continue;
			} else {
				newArr[z+q] = 0;
			}
		}
		placeSequenceR(acc, newArr, z+q+1, _.tail(seq));
	}
};
var placeSequence = function(arr, sequence) {
	var key = arr.toString();
	var key2 = sequence.toString();
	var cached = sequenceCache.get(key, key2);
	if (cached) {
		return cached;
	}
	var acc = [];
	placeSequenceR(acc, arr, 0, sequence);
	sequenceCache.put(key,key2,acc);
	return acc;
};

// feasibility checks
var feasibleColumn = function(dataColumn, sequence, idx) {
	var key = dataColumn.slice(0,idx+1).toString();
	var key2 = sequence.toString();
	var cached = feasibilityCache.get(key, key2);
	if (cached) {
		return cached;
	}
	var t = 0;
	var currSeq = false;
	var currLength = 0;
	var tempSequence = _.clone(sequence);
	for (; t <= idx; t++) {
		if (dataColumn[t] === 0) {
			if (currSeq === true && currLength !== 0) {
				feasibilityCache.put(key,key2,false);
				return false;
			} else {
				currSeq = false;
			}
		} else {
			if (currSeq === true) {
				if (currLength > 0) {
					currLength--;
				} else {
					feasibilityCache.put(key,key2,false);
					return false;
				}
			} else {
				currLength = _.head(tempSequence);
				if (!currLength) {
					feasibilityCache.put(key,key2,false);
					return false;
				} else {
					currLength--;
				}
				currSeq = true;
				tempSequence = _.tail(tempSequence);
			}
		}
	}
	feasibilityCache.put(key,key2,true);
	return true;
};
var feasible = function(grid, row, idx) {
	var retVal = true;
	var p = 0;
	for(; p < grid.columns.length && retVal; p++) {
		var dataColumn = _.map(grid.data, function(row) {return row[p];});
		dataColumn[idx] = row[p];
		retVal &= feasibleColumn(dataColumn, grid.columns[p], idx);
	}
	return retVal;
};

// solutions generation
var solveR = function(acc, grid, idx) {
	_.each(placeSequence(grid.data[idx], grid.rows[idx]), function (row) {
		if (feasible(grid, row, idx)) {
			var newGrid = gridHandler.cloneWith(grid, row, idx);
			if (idx == newGrid.rows.length - 1) {
				acc.push(newGrid);
				return;
			} else {
				solveR(acc, newGrid, idx+1);
			}
		}
	})
};
exports.solve = function(grid) {
	var acc = [];
	solveR(acc, gridHandler.cloneWith(grid), 0);
	return acc;
};
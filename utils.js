var _ = require('underscore');
exports.empty = function(arr) {
	return arr.length === 0;
};
exports.sum = function(arr) {
	return _.reduce(arr, function(z, el){return z + el;}, 0);
};
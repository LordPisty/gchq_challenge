var _ = require('underscore');

function KKcache () {
	this.data = [];
}

KKcache.prototype.put = function(k1, k2, v) {
	if (!this.data[k1]) {
		this.data[k1] = {};
	}
	this.data[k1][k2] = v;
}

KKcache.prototype.get = function(k1, k2) {
	if (this.data[k1]) {
		return this.data[k1][k2];
	} else {
		return undefined;
	}
}

exports.getKKcache = function() {
	return new KKcache();
};
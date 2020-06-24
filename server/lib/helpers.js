const util = require('util');

exports.log = function(text) {
	console.log(text);
};

exports.flog = function(obj) {
	console.log(util.inspect(obj, false, null, true /* enable colors */));
};

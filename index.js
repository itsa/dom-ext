"use strict";

module.exports = function (window) {
    require('./lib/nodelist.js')(window);
    require('./lib/document.js')(window);
    require('./lib/element.js')(window);
};
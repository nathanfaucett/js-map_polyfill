var isNative = require("is_native"),
    createMap = require("create_map");


var NativeMap = typeof(Map) !== "undefined" ? Map : null,
    MapShim, forEach, createCallback;


if (isNative(NativeMap)) {
    MapShim = NativeMap;

    MapShim.prototype.count = function() {
        return this.size;
    };
} else {
    MapShim = function Map() {
        this.__map = createMap();
    };
    MapShim.prototype.constructor = MapShim;

    MapShim.prototype.get = function(key) {

        return this.__map.get(key);
    };

    MapShim.prototype.set = function(key, value) {

        this.__map.set(key, value);
    };

    MapShim.prototype.has = function(key) {

        return this.__map.has(key);
    };

    MapShim.prototype["delete"] = function(key) {

        return this.__map.remove(key);
    };

    MapShim.prototype.clear = function() {

        this.__map.clear();
    };

    if (Object.defineProperty) {
        Object.defineProperty(MapShim.prototype, "size", {
            get: function() {
                return this.__map.size();
            }
        });
    }

    MapShim.prototype.count = function() {
        return this.__map.size();
    };

    MapShim.prototype.length = 1;

    MapShim.prototype.forEach = function(fn, thisArg) {
        return forEach(
            this,
            this.__map,
            thisArg != null ? createCallback(fn, thisArg) : fn
        );
    };

    forEach = function forEach(obj, map, fn) {
        var i = -1,
            il = map.count() - 1;

        while (i++ < il) {
            if (fn(map.value(i), map.key(i), obj) === false) {
                return false;
            }
        }

        return obj;
    };

    createCallback = function createCallback(fn, thisArg) {
        return function callback(value, key, obj) {
            fn.call(thisArg, value, key, obj);
        };
    };
}

MapShim.prototype.remove = MapShim.prototype["delete"];


module.exports = MapShim;

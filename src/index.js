var isNative = require("isNative"),
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
        this._map = createMap();
    };
    MapShim.prototype.constructor = MapShim;

    MapShim.prototype.get = function(key) {

        return this._map.get(key);
    };

    MapShim.prototype.set = function(key, value) {

        this._map.set(key, value);
    };

    MapShim.prototype.has = function(key) {

        return this._map.has(key);
    };

    MapShim.prototype["delete"] = function(key) {

        return this._map.remove(key);
    };

    MapShim.prototype.clear = function() {

        this._map.clear();
    };

    if (Object.defineProperty) {
        Object.defineProperty(MapShim.prototype, "size", {
            get: function() {
                return this._map.size();
            }
        });
    }

    MapShim.prototype.count = function() {
        return this._map.size();
    };

    MapShim.prototype.length = 1;

    MapShim.prototype.forEach = function(fn, thisArg) {
        return forEach(
            this,
            this._map,
            thisArg != null ? createCallback(fn, thisArg) : fn
        );
    };

    forEach = function forEach(obj, map, fn) {
        var i = -1,
            length = map.size() - 1;

        while (i++ < length) {
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

var isNative = require("is_native"),
    createMap = require("create_map");


var NativeMap = typeof(Map) !== "undefined" ? Map : null,
    MapPolyfill, forEach, createCallback;


if (isNative(NativeMap)) {
    MapPolyfill = NativeMap;

    MapPolyfill.prototype.count = function() {
        return this.size;
    };
} else {
    MapPolyfill = function Map() {
        this.__map = createMap();
    };
    MapPolyfill.prototype.constructor = MapPolyfill;

    MapPolyfill.prototype.get = function(key) {

        return this.__map.get(key);
    };

    MapPolyfill.prototype.set = function(key, value) {

        this.__map.set(key, value);
    };

    MapPolyfill.prototype.has = function(key) {

        return this.__map.has(key);
    };

    MapPolyfill.prototype["delete"] = function(key) {

        return this.__map.remove(key);
    };

    MapPolyfill.prototype.clear = function() {

        this.__map.clear();
    };

    if (Object.defineProperty) {
        Object.defineProperty(MapPolyfill.prototype, "size", {
            get: function() {
                return this.__map.size();
            }
        });
    }

    MapPolyfill.prototype.count = function() {
        return this.__map.size();
    };

    MapPolyfill.prototype.length = 1;

    MapPolyfill.prototype.forEach = function(fn, thisArg) {
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

MapPolyfill.prototype.remove = MapPolyfill.prototype["delete"];


module.exports = MapPolyfill;

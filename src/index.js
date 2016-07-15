var isNative = require("@nathanfaucett/is_native"),
    createMap = require("@nathanfaucett/create_map");


var NativeMap = typeof(Map) !== "undefined" ? Map : null,
    MapPolyfill, forEach, createCallback, MapPolyfillPrototype;


if (isNative(NativeMap)) {
    MapPolyfill = NativeMap;
    MapPolyfillPrototype = MapPolyfill.prototype;

    MapPolyfillPrototype.count = function() {
        return this.size;
    };
} else {
    MapPolyfill = function Map() {
        this.__map = createMap();
    };
    MapPolyfillPrototype = MapPolyfill.prototype;
    MapPolyfillPrototype.constructor = MapPolyfill;

    MapPolyfillPrototype.get = function(key) {
        return this.__map.get(key);
    };

    MapPolyfillPrototype.set = function(key, value) {
        this.__map.set(key, value);
    };

    MapPolyfillPrototype.has = function(key) {
        return this.__map.has(key);
    };

    MapPolyfillPrototype["delete"] = function(key) {
        return this.__map.remove(key);
    };

    MapPolyfillPrototype.clear = function() {
        this.__map.clear();
    };

    MapPolyfillPrototype.count = function() {
        return this.__map.size();
    };

    if (Object.defineProperty) {
        Object.defineProperty(MapPolyfillPrototype, "size", {
            get: MapPolyfillPrototype.count
        });
    }

    MapPolyfillPrototype.length = 0;

    MapPolyfillPrototype.forEach = function(fn, thisArg) {
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

MapPolyfillPrototype.remove = MapPolyfillPrototype["delete"];
MapPolyfillPrototype.__KeyedCollection__ = true;
MapPolyfillPrototype.__Collection__ = true;


module.exports = MapPolyfill;

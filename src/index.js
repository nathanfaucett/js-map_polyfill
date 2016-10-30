var isNative = require("@nathanfaucett/is_native"),
    HashMap;


var NativeMap = typeof(Map) !== "undefined" ? Map : null,
    MapPolyfill, forEach, createCallback, MapPolyfillPrototype;


if (isNative(NativeMap)) {
    MapPolyfill = NativeMap;
    MapPolyfillPrototype = MapPolyfill.prototype;

    MapPolyfillPrototype.count = function() {
        return this.size;
    };
} else {
    HashMap = require("./HashMap");


    MapPolyfill = function Map() {
        this._map = new HashMap();
    };
    MapPolyfillPrototype = MapPolyfill.prototype;
    MapPolyfillPrototype.constructor = MapPolyfill;

    MapPolyfillPrototype.get = function(key) {
        return this._map.get(key);
    };

    MapPolyfillPrototype.set = function(key, value) {
        this._map.set(key, value);
    };

    MapPolyfillPrototype.has = function(key) {
        return this._map.has(key);
    };

    MapPolyfillPrototype["delete"] = function(key) {
        return this._map.remove(key);
    };

    MapPolyfillPrototype.clear = function() {
        this._map.clear();
    };

    MapPolyfillPrototype.count = function() {
        return this._map.size();
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
            this._map,
            thisArg != null ? createCallback(fn, thisArg) : fn
        );
    };

    MapPolyfillPrototype.keys = function() {
        return this._map.keys();
    };

    MapPolyfillPrototype.values = function() {
        return this._map.values();
    };

    forEach = function forEach(obj, map, fn) {
        var array = map.toArray(),
            i = -1,
            il = array.length - 1,
            entry;

        while (i++ < il) {
            entry = array[i];

            if (fn(entry[1], entry[0], obj) === false) {
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
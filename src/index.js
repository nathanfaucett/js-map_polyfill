var type = require("type");


var NativeMap = global.Map,
    MapShim, forEach, createCallback, get, getIndex;


if (type.isNative(NativeMap)) {
    MapShim = NativeMap;

    MapShim.prototype.count = function() {
        return this.size;
    };
} else {
    MapShim = function Map() {
        this._keys = [];
        this._values = [];
    };
    MapShim.prototype.constructor = MapShim;

    MapShim.prototype.get = function(key) {

        return get(key, this._keys, this._values);
    };

    MapShim.prototype.set = function(key, value) {
        var index = getIndex(key, this._keys),
            keys;

        if (index !== -1) {
            this._values[index] = value;
        } else {
            keys = this._keys;
            index = keys.length;

            keys[index] = key;
            this._values[index] = value;
        }
    };

    MapShim.prototype.has = function(key) {

        return getIndex(key, this._keys, this._values) !== -1;
    };

    MapShim.prototype["delete"] = function(key) {
        var keys = this._keys,
            values = this._values,
            index = getIndex(key, keys, values);

        if (index === -1) {
            return false;
        }

        keys.splice(index, 1);
        values.splice(index, 1);

        return true;
    };

    MapShim.prototype.clear = function() {

        this._keys.length = 0;
        this._values.length = 0;
    };

    if (Object.defineProperty) {
        Object.defineProperty(MapShim.prototype, "size", {
            get: function() {
                return this._keys.length;
            }
        });
    }

    MapShim.prototype.count = function() {
        return this._keys.length;
    };

    MapShim.prototype.length = 1;

    MapShim.prototype.forEach = function(fn, thisArg) {
        return forEach(
            this,
            this._keys,
            this._values,
            thisArg != null ? createCallback(fn, thisArg) : fn
        );
    };

    forEach = function forEach(obj, keys, values, fn) {
        var i = -1,
            length = keys.length - 1;

        while (i++ < length) {
            if (fn(values[i], keys[i], obj) === false) {
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

    get = function get(key, keys, values) {
        var index = getIndex(key, keys);

        return index !== -1 ? values[index] : undefined;
    };

    getIndex = function getIndex(key, keys) {
        var i = keys.length,
            other;

        while (i--) {
            other = keys[i];

            if (key === other || (key !== key && other !== other)) {
                return i;
            }
        }

        return -1;
    };
}

MapShim.prototype.remove = MapShim.prototype["delete"];


module.exports = MapShim;

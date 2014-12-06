var type = require("type");


var hasOwnProp = Object.prototype.hasOwnProperty;


function hiddenStore(obj, key) {
    var valueOf = obj.valueOf,
        store = {
            key: key
        };

    obj.valueOf = function(value) {
        return value !== key ? valueOf.apply(this, arguments) : store;
    };

    return store;
}

function createStore() {
    var key = {},
        keys = [];

    function storeFn(obj) {
        var store;

        if (!type.isObject(obj)) {
            throw new TypeError("Invalid value used as key");
        }

        store = obj.valueOf(key);

        if (store == null || store.key !== key) {
            store = hiddenStore(obj, key);
            keys[keys.length] = obj;
        }

        return store;
    }

    storeFn.clear = function() {
        var i = keys.length,
            value;

        while (i--) {
            value = keys[i];
            delete value.valueOf;
            keys.splice(i, 1);
        }
    };

    storeFn.remove = function(obj) {
        var store = storeFn(obj),
            i;

        if (!hasOwnProp.call(store, "value")) {
            return false;
        }

        i = keys.length;
        while (i--) {
            if (keys[i] === obj) {
                keys.splice(i, 1);
                break;
            }
        }
        delete obj.valueOf;

        return delete store.value;
    };

    storeFn.count = function() {
        return keys.length;
    };

    return storeFn;
}


var internal = createStore();


function Map() {
    internal(this).value = createStore();
}

Map.prototype.constructor = Map;

Map.prototype.has = function(key) {

    return hasOwnProp.call(internal(this).value(key), "value");
};

Map.prototype.get = function(key) {

    return internal(this).value(key).value;
};

Map.prototype.set = function(key, value) {

    internal(this).value(key).value = value;
};

Map.prototype.clear = function() {

    internal(this).value.clear();
};

Map.prototype.remove = function(key) {

    return internal(this).value.remove(key);
};

Map.prototype["delete"] = Map.prototype.remove;

if (Object.defineProperty) {
    Object.defineProperty(Map.prototype, "length", {
        get: function() {
            return internal(this).value.count();
        },
        set: function() {}
    });
} else {
    Map.prototype.length = 0;
}


module.exports = Map;

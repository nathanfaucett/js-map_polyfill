var hashCode = require("@nathanfaucett/hash_code"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    HashNode = require("./HashNode");


var DELETED_ENTRY = {},
    DEFAULT_TABLE_SIZE = 128,
    THRESHOLD = 0.75,

    HashMapPrototype;


module.exports = HashMap;


function HashMap() {
    var table = new Array(DEFAULT_TABLE_SIZE),
        i = DEFAULT_TABLE_SIZE;

    while (i--) {
        table[i] = null;
    }

    this._size = 0;
    this._maxSize = 96;
    this._table = table;
    this._threshold = THRESHOLD;
}
HashMapPrototype = HashMap.prototype;


HashMapPrototype.setThreshold = function(threshold) {
    this._threshold = threshold;
    this._maxSize = this._table.length * threshold;
};

HashMapPrototype.size = function() {
    return this._size;
};

HashMapPrototype.clear = function() {
    var table = this._table;

    table.length = 0;
    table.length = DEFAULT_TABLE_SIZE;

    this._size = 0;
    this._maxSize = 96;
    this._threshold = THRESHOLD;
};

HashMapPrototype.has = function(key) {
    var hash = HashMap_key(this, key),
        initialHash = HashMap_key.initialHash;

    if (isNullOrUndefined(this._table[hash]) || hash === initialHash) {
        return false;
    } else {
        return true;
    }
};

HashMapPrototype.get = function(key) {
    var hash = HashMap_key(this, key),
        initialHash = HashMap_key.initialHash;

    if (isNullOrUndefined(this._table[hash]) || hash === initialHash) {
        return undefined;
    } else {
        return this._table[hash].value;
    }
};

HashMapPrototype.keys = function() {
    var keys = new Array(this._size),
        table = this._table,
        i = -1,
        il = table.length - 1,
        index = 0,
        value;

    while (i++ < il) {
        value = table[i];

        if (value instanceof HashNode) {
            keys[index++] = value.key;
        }
    }

    return keys;
};

HashMapPrototype.values = function() {
    var values = new Array(this._size),
        table = this._table,
        i = -1,
        il = table.length - 1,
        index = 0,
        value;

    while (i++ < il) {
        value = table[i];

        if (value instanceof HashNode) {
            values[index++] = value.value;
        }
    }

    return values;
};

HashMapPrototype.toArray = function() {
    var values = new Array(this._size),
        table = this._table,
        i = -1,
        il = table.length - 1,
        index = 0,
        value;

    while (i++ < il) {
        value = table[i];

        if (value instanceof HashNode) {
            values[index++] = [value.key, value.value];
        }
    }

    return values;
};

HashMapPrototype.set = function(key, value) {
    var table = this._table,
        hash = (hashCode(key) % table.length),
        initialHash = -1,
        indexOfDeletedEntry = -1;

    while (hash !== initialHash && (
            table[hash] === DELETED_ENTRY ||
            !isNullOrUndefined(table[hash]) && table[hash].key !== key
        )) {
        if (initialHash === -1) {
            initialHash = hash;
        }

        if (table[hash] === DELETED_ENTRY) {
            indexOfDeletedEntry = hash;
        }

        hash = (hash + 1) % table.length;
    }

    if ((isNullOrUndefined(table[hash]) || hash === initialHash) && indexOfDeletedEntry !== -1) {
        table[indexOfDeletedEntry] = new HashNode(key, value);
        this._size++;
    } else if (initialHash !== hash) {
        if (
            table[hash] !== DELETED_ENTRY &&
            !isNullOrUndefined(table[hash]) && table[hash].key === key
        ) {
            table[hash].value = value;
        } else {
            table[hash] = new HashNode(key, value);
            this._size++;
        }
    }

    if (this._size >= this._maxSize) {
        HashMap_resize(this);
    }
};

function HashMap_key(_this, key) {
    var table = _this._table,
        hash = (hashCode(key) % table.length),
        initialHash = -1;

    while (hash !== initialHash && (
            table[hash] === DELETED_ENTRY ||
            !isNullOrUndefined(table[hash]) &&
            table[hash].key !== key
        )) {
        if (initialHash === -1) {
            initialHash = hash;
        }
        hash = (hash + 1) % table.length;
    }

    HashMap_key.initialHash = initialHash;

    return hash;
}

function HashMap_resize(_this) {
    var table = _this._table,
        tableSize = 2 * table.length,
        oldTable = table,
        i = -1,
        il = oldTable.length - 1;

    _this._maxSize = ~~(tableSize * THRESHOLD);
    _this._table = new Array(tableSize);
    _this._size = 0;

    while (i++ < il) {
        if (!isNullOrUndefined(oldTable[i]) && oldTable[i] !== DELETED_ENTRY) {
            _this.set(oldTable[i].key, oldTable[i].value);
        }
    }
}

HashMapPrototype.remove = function(key) {
    var table = this._table,
        hash = (hashCode(key) % table.length),
        initialHash = -1;

    while (hash !== initialHash && (
            table[hash] === DELETED_ENTRY ||
            !isNullOrUndefined(table[hash]) &&
            table[hash].key !== key
        )) {
        if (initialHash === -1) {
            initialHash = hash;
        }
        hash = (hash + 1) % table.length;
    }

    if (hash !== initialHash && !isNullOrUndefined(table[hash])) {
        table[hash] = DELETED_ENTRY;
        this._size--;
    }
};
var tape = require("tape");


var NativeMap = global.Map,
    MapPolyFill;


global.Map = undefined;
MapPolyFill = require("..");
global.Map = NativeMap;


tape("Map#get(key)", function(assert) {
    var a = new MapPolyFill();
    a.set("key", "value");
    assert.equal(a.get("key"), "value", "should return value at key, else returns undefined");
    assert.equal(a.get("no"), undefined, "should return value at key, else returns undefined");
    assert.end();
});

tape("Map#set(key, value)", function(assert) {
    var a = new MapPolyFill();
    a.set("key", "value");
    assert.equal(a.get("key"), "value", "should set value at key");
    assert.end();
});

tape("Map#has(key)", function(assert) {
    var a = new MapPolyFill();
    a.set("key", "value");
    assert.equal(a.has("key"), true, "should return true if map contains key");
    assert.end();
});

tape("Map#remove(key)", function(assert) {
    var a = new MapPolyFill();
    a.set("key", "value");
    a.remove("key");
    assert.equal(a.has("key"), false, "should remove value stored at key");
    assert.end();
});

tape("Map#clear()", function(assert) {
    var a = new MapPolyFill();
    a.set("key", "value");
    a.clear();
    assert.equal(a.count(), 0, "should remove all keys from map");
    assert.end();
});

tape("Map#forEach()", function(assert) {
    var a = new MapPolyFill(),
        index = 0;

    a.set(0, 0);
    a.set(1, 1);
    a.set(2, 2);

    assert.deepEquals(a.keys(), [0, 1, 2]);
    assert.deepEquals(a.values(), [0, 1, 2]);

    a.forEach(function(value, key) {
        assert.equals(value, index);
        assert.equals(key, index);
        index += 1;
    });

    assert.end();
});

tape("Map many keys and values", function(assert) {
    var a = new MapPolyFill(),
        size = 100000,
        array = new Array(size),
        i, value;

    i = size;
    while (i--) {
        value = {};
        array[i] = value;
        a.set(value, value);
    }

    i = size;
    while (i--) {
        value = array[i];
        if (!a.has(value)) {
            assert.end(new Error("should contain find values"));
        }
    }

    assert.end();
});

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

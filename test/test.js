var assert = require("assert");


global.Map = undefined;


describe("Map", function() {
    var Map = require("../src/index");

    describe("Map#get(key)", function() {
        it("should return value at key, else returns undefined", function() {
            var a = new Map();
            a.set("key", "value");
            assert.equal(a.get("key"), "value");
            assert.equal(a.get("no"), undefined);
        });
    });

    describe("Map#set(key, value)", function() {
        it("should set value at key", function() {
            var a = new Map();
            a.set("key", "value");
            assert.equal(a.get("key"), "value");
        });
    });

    describe("Map#has(key)", function() {
        it("should return true if map contains key", function() {
            var a = new Map();
            a.set("key", "value");
            assert.equal(a.has("key"), true);
        });
    });

    describe("Map#remove(key)", function() {
        it("should remove value stored at key", function() {
            var a = new Map();
            a.set("key", "value");
            a.remove("key");
            assert.equal(a.has("key"), false);
        });
    });

    describe("Map#clear()", function() {
        it("should remove all keys from map", function() {
            var a = new Map();
            a.set("key", "value");
            a.clear();
            assert.equal(a.count(), 0);
        });
    });
});

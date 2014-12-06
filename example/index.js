global.Map = require("../src/index");


global.map = new Map();


var nan = NaN,
    object = {},
    array = [],
    number = 10;

map.set(nan, "NaN");
map.set(object, "{}");
map.set(array, "[]");
map.set(number, "10");

console.log(
    map.get(nan),
    map.get(object),
    map.get(array),
    map.get(number)
);

global.test = function test() {
    console.time("test");
    map.forEach(function() {});
    console.timeEnd("test");
};

map.forEach(function() {});

test();

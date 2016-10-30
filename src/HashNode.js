module.exports = HashNode;


function HashNode(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
}
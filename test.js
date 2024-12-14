const { bodyUpdateParser } = require("./src/utils");
const data = [1, 2, [3, [4, [5, 6]], 7], 8]
console.log(data.flat(2))
// console.log(typeof undefined);
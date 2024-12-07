const { bodyUpdateParser } = require("./src/utils");
const data = {
    a: 1,
    b: 2,
    c: {
        d: 1,
        e: null,
        f: {
            g: 1,
            h: undefined
        }
    }
}
console.log(bodyUpdateParser(data));
// console.log(typeof undefined);
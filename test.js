const multiply = (number1, number2) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (number1 < 0 || number2 < 0) {
                return reject('number is negative')
            }
            let product = number1 * number2
            resolve(product)
        }, 2090)
    })
}
const cube = (number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(number * number * number)
        })
    }, 1909)
}
multiply(26, 3).then(product => {
    return cube(product)
}).then(result => {
    console.log("The cube of the product is : ",
        result)
}).catch(error => {
    console.log(error)
})
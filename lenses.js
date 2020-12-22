const { toUpper, view, over, lensProp, compose } = require('rambda')

const L = {
	name: lensProp('name'),
	street: lensProp('street'),
	address: lensProp('address')
}

const user { address: { street: { name: 'Maple' } } }
const addrStreetName = compose(L.address, L.street, L.name)
const res = over(addrStreetName, toUpper, user)
console.log(res)
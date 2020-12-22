const Box = x => 
({
	map: f =>  Box(f(x)),
	chain: f => f(x),
	fold: f => f(x),
	toString: `Box(${x})`
})

// const result = () =>
// 	['a']
// 	.map(x => x.toUpperCase())
// 	.map(x => String.fromCharCode(x))

// MARK: -- trapping data, it's a pipeline (state is contained)
const result = () =>
	Box('a')
	.map(x => x.toUpperCase())
	.map(x => String.fromCharCode(x))
	.map(x => x[0])

console.log(result());

const first = xs => xs[0]

const nextCharForNumberString = str =>
	Box(str)
	.map(x => x.trim())
	.map(trimmed => parseInt(trimmed, 10))
	.map(number => new Number(number + 1))
	.fold(String.fromCharCode)

const n = nextCharForNumberString('   64 ')
console.log(n)

const compose = (f, g) => x => Box(x).map(g).fold(f)

const halfTheFirstLargeNumber = xs =>
	Box(xs)
		.map(xs => xs.filter(x => x >= 20))
		.map(found => first(found) / 2)
		.fold(answer => `The answer is ${answer}`)

const res = halfTheFirstLargeNumber([1, 4, 50]);
console.log(res);


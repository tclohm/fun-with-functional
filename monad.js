const Right = x =>
({
 chain: f => f(x),
 map: f => Right(f(x)),
 fold: (f, g) => g(x),
 toString: `Right(${x})`
})

const Left = x =>
({
 chain: f => Left(x),
 map: f => Left(x),
 fold: (f, g) => f(x),
 toString: `Left(${x})`
})

const fromNullable = x => x != null ? Right(x) : Left()

const tryCatch = f => {
	try {
		return Right(f());
	} catch(e) {
		return Left(e);
	}
}

const findColor = name => 
	fromNullable(
		{
			red: '#ff4444', 
			blue: '#3b5998', 
			yellow: '#fff68f'
		}[name]
	)


const res = findColor('red')
	.map(x => x.toUpperCase())
	.map(x => x.slice(1))
	.fold(
		() => 'no color!',
		color => color
	)

console.log(res)

const fs = require('fs')

const readFileSync = path => tryCatch(() => fs.readFileSync(path))

const parseJSON = content => tryCatch(() => JSON.parse(content))


// MARK: -- chain is flatMap
const getPort = () => 
	readFileSync('config.json')
	.chain(contents => parseJSON(contents))
	.map(config => config.port)
	.fold(() => 8080, x => x)

const result = getPort();
console.log(result);
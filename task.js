const { compose } = require('rambda');
const { Task } = require('./types');

const Box = f => 
	({
		map: g => Box(compose(f, g)),
		fold: f
	})

const t1 = Task((rej, res) => res(2))
			.map(two => two + 1)
			.map(three => three * 2)

t1.fork(console.error, console.log)
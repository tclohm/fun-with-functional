const { curry, compose } = require('rambda');

const add = (x, y) => x + y;

const toUpper = str => str.toUpperCase();

const exclaim = str => str + '!';

const concat = curry((x, y) => y + x);

const first = xs => xs[0];

//const compose = (f, g) => x => f(g(x)); // f . g

const log = curry((tag, x) => (console.log(tag, x), x));

const shout = compose(concat('!'), log('here:'), toUpper, log('start'));

const loudFirst = compose(toUpper, first);

console.log(shout('tears'));
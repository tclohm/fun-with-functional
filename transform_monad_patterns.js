const fs = require('fs')
const { Task, Either, Id } = require('./types')
const { Right, Left, fromNullable } = Either
const { List, Map } = require('immutable-ext')

const httpGet = (path, params) =>
	Task.of(`${path}: result`)

const getUser = x => httpGet('/user', { id: x })
const getTimeline = x => httpGet(`/timeline/${x}`, {})
const getAds = x => httpGet('/ads', {})

//Promise.all([getUser, getTimeline, getAds]) // Promise([result, result, result])

// MARK: --
List([getUser, getTimeline, getAds])
	.traverse(Task.of, f => f())
	.fork(console.log, x => console.log(x.toJS()))


const greaterThan5 = x => x.length > 5 ? Right(x) : Left('not greater than 5')

const looksLikeEmail = x => x.match(/@/ig) ? Right(x) : Left('not an email')

const email = "taylor.swooper.pooper@nads.com"
const res = List([greaterThan5, looksLikeEmail]).traverse(Either.of, v => v(email))


res.fold(console.log, x => console.log(x.toJS()))

// MARK: -- natural transformation
// F a -> T a -- encapsulation (abstract)
const eitherToTask = e => e.fold(Task.rejected, Task.of)


const fake = id => ({ id: id, name: 'user1', best_friend_id: id + 1 })
const Db = ({ 
	find: id => 
		Task((rej, res) =>
			setTimeout(() => 
				res(id > 2 ? Right(fake(id)) : Left('no found')),
			100)
		)
})

const send = (code, json) => console.log(`sending ${code}: ${JSON.stringify(json)}`)

Db.find(3) // Task(Either(User))
.chain(eitherToTask) // Task(User)
.chain(u => Db.find(u.best_friend_id))
.chain(eitherToTask)
.fork(error => send(500, {error}), u => send(200, u))

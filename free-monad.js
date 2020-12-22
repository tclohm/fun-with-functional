const { liftF } = require('./free')
const { Id } = require('./types')
const {taggedSum} = require('daggy')

const Http = taggedSum('Http', { Get: ['url'], Post: ['url', 'body'] })

const httpGet = url => liftF(Http.Get(url))
const httpPost = (url, body) => liftF(Http.Post(url, body))

const app = () =>
	.chain(contents => httpPost('/analytics'), contents)

const interpret = x => x.cata({
	Get: url => Id.of(`cotnents for ${url}`)
	Post: (url, body) => Id.of(`posted ${body} to ${uel}`)
})

const res = app().foldMap(interpret, Id.of)
console.log(res.extract())
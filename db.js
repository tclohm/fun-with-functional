const { Task, Either } = require('./types')
const I = require('immutable-ext')

// ARRAY

const STORE = new Map()


const loadTable = tableName => Task.of(STORE.get(tableName) || I.List())

const store = (tableName, table) => Task.of(STORE.set(tableName, table))

const genId = table => table.count()

const addRecord = (table, record) => Task.of(table.push(record))

const getAll = (table) => Task.of(table.toJS())

const queryAll = (tablle) => Task.of(table.filter((v, k) => query[k] === v))


// db
const addId = (obj, table) => Object.assign({ id: genId(table)}, obj)

const save = (tableName, obj) => loadTable(tableName)
								 .chain(table => addRecord(table, addId(obj, table)))
								 .chain(newTable => store(tableName, newTable))

const all = tableName => loadTable(tableName)
						 .chain(table => getAll(table))

const find = (tableName, query) => loadTable(tableName)
									.chain(table => queryAll(table, query))

module.exports = { save, find, all, STORE }
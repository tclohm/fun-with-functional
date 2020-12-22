// Setup
//==============
const _ = R;
const {formatMoney} = accounting;

// Example Data
const CARS = [
    {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
    {name: "Spyker C12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
    {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
    {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
    {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
    {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: false}
  ];

// Exercise 1:
// ============
// use _.compose() to rewrite the function below. Hint: _.prop() is curried.

const isLastInStock = _.compose(_.prop('in_stock'), _.last)

QUnit.test("Ex1: isLastInStock", assert => {
  assert.deepEqual(isLastInStock(CARS), false);
})

''


// Exercise 2:
// ============
// use _.compose(), _.prop() and _.head() to retrieve the name of the first car

const nameOfFirstCar = _.compose(_.prop('name'), _.head)

QUnit.test("Ex2: nameOfFirstCar", assert => {
  assert.equal(nameOfFirstCar(CARS), "Ferrari FF");
})

// Exercise 3:
// ============
// Use the helper function _average to refactor averageDollarValue as a composition

const _average = function(xs) { return _.reduce(_.add, 0, xs) / xs.length; }; // <- leave be

const averageDollarValue_ = function(cars) {
  const dollar_values = _.map(_.prop('dollar_value'), cars);
  return _average(dollar_values);
};

var averageDollarValue = _.compose(_average, _.map(_.prop('dollar_value')))

QUnit.test("Ex3: averageDollarValue", assert => {
  assert.equal(averageDollarValue(CARS), 790700);
})


// Exercise 4:
// ============
// Write a function: sanitizeNames() using compose that returns a list of lowercase and underscored names: e.g: sanitizeNames(["Hello World"]) //=> ["hello_world"].

const _underscore = _.replace(/\W+/g, '_'); //<-- leave this alone and use to sanitize

const sanitizeNames = _.map(_.compose(_.toLower, _underscore, _.prop('name')))

QUnit.test("Ex4: sanitizeNames", assert => {
  assert.deepEqual(sanitizeNames(CARS), ['ferrari_ff', 'spyker_c12_zagato', 'jaguar_xkr_s', 'audi_r8', 'aston_martin_one_77', 'pagani_huayra']);
})



// Bonus 1:
// ============
// Refactor availablePrices with compose.

const availablePrices_ = function(cars) {
  const available_cars = _.filter(_.prop('in_stock'), cars);
  return available_cars.map(x => formatMoney(x.dollar_value)).join(', ');
}

const formatDollarValue = _.compose(formatMoney, _.prop('dollar_value'))
const availablePrices = _.compose(_.join(', '), _.map(formatDollarValue), _.filter(_.prop('in_stock')))

QUnit.test("Bonus 1: availablePrices", assert => {
  assert.deepEqual(availablePrices(CARS), '$700,000.00, $1,850,000.00');
})

// Bonus 2:
// ============
// Refactor to pointfree.

const fastestCar_ = function(cars) {
  const sorted = _.sortBy(car => car.horsepower, cars);
  const fastest = _.last(sorted);
  return fastest.name + ' is the fastest';
}

const append = _.flip(_.concat)

const fastestCar = _.compose(
  append(' is the fastest'),
  _.prop('name'),
  _.last, 
  _.sortBy(_.prop('horsepower')))

QUnit.test("Bonus 2: fastestCar", assert => {
  assert.equal(fastestCar(CARS), 'Aston Martin One-77 is the fastest');
})


// MARK: -- functors

const Box = x =>
({
  map: f => Box(f(x)),
  fold: f => f(x),
  toString: () => `Box(${x})`
})

// Exercise: Box
// Goal: Refactor each example using Box
// Keep these tests passing!
// Bonus points: no curly braces




// Ex1: Using Box, refactor moneyToFloat to be unnested.
// =========================
const moneyToFloat_ = str =>
  parseFloat(str.replace(/\$/, ''))

const moneyToFloat = str =>
  Box(str)
  .map(s => s.replace(/\$/, ''))
  .fold(s => parseFloat(s))


QUnit.test("Ex1: moneyToFloat", assert => {
  assert.equal(String(moneyToFloat('$5.00')), 5)
})





// Ex2: Using Box, refactor percentToFloat to remove assignment
// =========================
const percentToFloat_ = str => {
  const float = parseFloat(str.replace(/\%/, ''))
  return float * 0.0100
}

const percentToFloat = str =>
  Box(str)
  .map(s => s.replace(/\%/, ''))
  .map(s => parseFloat(s))
  .fold(flt => flt * 0.0100)


QUnit.test("Ex2: percentToFloat", assert => {
  assert.equal(String(percentToFloat('20%')), 0.2)
})





// Ex3: Using Box, refactor applyDiscount (hint: each variable introduces a new Box)
// =========================
const applyDiscount_ = (price, discount) => {
  const cents = moneyToFloat(price)
  const savings = percentToFloat(discount)
  return cents - (cents * savings)
}


const applyDiscount = (price, discount) => 
  Box(moneyToFloat(price))
    .fold(cents => 
      Box(percentToFloat(discount))
      .fold(savings => cents - (cents * savings))
    )

QUnit.test("Ex3: Apply discount", assert => {
  assert.equal(String(applyDiscount('$5.00', '20%')), 4)
})

// MARK: -- Either
// Definitions
// ====================
const Right = x =>
({
 chain: f => f(x),
 map: f => Right(f(x)),
 fold: (f, g) => g(x),
 toString: () => `Right(${x})`
})

const Left = x =>
({
 chain: f => Left(x),
 map: f => Left(x),
 fold: (f, g) => f(x),
 toString: () => `Left(${x})`
})

const fromNullable = x =>
 x != null ? Right(x) : Left(null)

const tryCatch = f => {
 try {
   return Right(f())
 } catch(e) {
   return Left(e)
 }
}

const logIt = x => {
 console.log(x)
 return x
}

const DB_REGEX = /postgres:\/\/([^:]+):([^@]+)@.*?\/(.+)$/i

// Exercise: Either
// Goal: Refactor each example using Either
// Bonus: no curlies
// =========================


// Ex1: Refactor streetName to use Either instead of nested if's
// =========================
const street_ = user => {
 const address = user.address

 if(address) {
   return address.street
 } else {
   return 'no street'  
 }
}

const street = user =>
  fromNullable(user.address)
  .map(address => address.street)
  .fold(() => 'no street', street => street)


QUnit.test("Ex1: street", assert => {
 const user = { address: { street: { name: "Willow" } } }
 assert.deepEqual(street(user), {name: "Willow"})
 assert.equal(street({}), "no street")
})

// Ex1: Refactor streetName to use Either instead of nested if's
// =========================
const streetName_ = user => {
 const address = user.address

 if(address) {
   const street = address.street

   if(street) {
     return street.name
   }
 }

 return 'no street'
}

const streetName = user => 
  fromNullable(user.address)
  .chain(address => fromNullable(address.street)) // Right(Right(x)) , Right(Left(x))
  .map(street => street.name)
  .fold(() => 'no street', name => name)

QUnit.test("Ex1: streetName", assert => {
 const user = { address: { street: { name: "Willow" } } }
 assert.equal(streetName(user), "Willow")
 assert.equal(streetName({}), "no street")
 assert.equal(streetName({ address: { street: null } }), "no street")
})


// Ex2: Refactor parseDbUrl to return an Either instead of try/catch
// =========================
const parseDbUrl_ = cfg => {
 try {
   const c = JSON.parse(cfg) // throws if it can't parse
   return c.url.match(DB_REGEX)
 } catch(e) {
    return null
 }
}

const parseDbUrl = cfg =>
  tryCatch(() => JSON.parse(cfg))
  .map(parsed => parsed.url.match(DB_REGEX))
  .fold(() => null, x => x)


QUnit.test("Ex1: parseDbUrl", assert => {
 const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}' 
 assert.equal(parseDbUrl(config)[1], "sally")
 assert.equal(parseDbUrl(), null)
})



// Ex3: Using Either and the functions above, refactor startApp
// =========================
const startApp_ = cfg => {
 const parsed = parseDbUrl(cfg)

 if(parsed) {
   const [_, user, password, db] = parsed
   return `starting ${db}, ${user}, ${password}`
 } else {
   return "can't get config"
 }
}

const startApp = cfg => 
  fromNullable(parseDbUrl(cfg))
  .map(([_, user, password, db]) => `starting ${db}, ${user}, ${password}`)
  .fold(() => "can't get config", x => x)


QUnit.test("Ex3: startApp", assert => {
 const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}'
 assert.equal(String(startApp(config)), "starting mydb, sally, muppets")
 assert.equal(String(startApp()), "can't get config")
})


// SETUP
// =========================
const posts = {1: {title: "First"}, 2: {title: "Second"}}

const comments = {First: [{id: 1, body: "Brilliant!"}], Second: [{id: 2, body: "Unforgivable"}]}

const getPost = id =>
  new Task((rej, res) =>
    setTimeout(() => posts[id] ? res(posts[id]) : rej('not found'), 200))

const getComments = post =>
  new Task((rej, res) =>
    setTimeout(() => res(comments[post.title]), 200))



// Exercise: Task
// Goal: Refactor each example using Task
// Bonus points: no curly braces







// Ex1: Use the result of getPost() and upperCase the title. Posts and comments are defined above and look like {title: String} and {id: Int, body: String} respectively.
// =========================
const postTitle = id => // uppercase the title of the result of getPost()
  getPost(id).map(post => post.title.toUpperCase())


QUnit.test("Ex1: postTitle", assert => {
  const done = assert.async();
  postTitle(1)
  .fork(console.error, t => {
    assert.deepEqual(t, 'FIRST')
    done()
  })
})


// Ex2: pass in the post to getComments(), defined above, then assign the returned comments to the post
// =========================
const commentsForPost = id =>
  getPost(id).chain(post => 
          getComments(post).map(comments => 
                      Object.assign({comments}, post)))

QUnit.test("Ex2: commentsForPost", assert => {
  const done = assert.async();
  commentsForPost(2)
  .fork(console.error, t => {
    assert.deepEqual(t.title, "Second")
    assert.deepEqual(t.comments, comments["Second"])
    done()
  })
  
})


// Ex3: Wrap location.href in a Task to make it "pure"
// =========================
const getHref =
  new Task((rej, res) => res(location.href))// wrap me in Task


QUnit.test("Ex3: getHref", assert => {
  const done = assert.async();
  getHref
  .fork(console.error, t => {
    assert.equal(true, !!t.match("cdpn.io"))
    done()
  })
  
})

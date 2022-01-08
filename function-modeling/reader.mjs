/**
 * Created by steven on 12/29/21
 */
import Either from 'crocks/Either/index.js'

const { Left, Right } = Either

const toUpper = x => x.toUpperCase()
const exclaim = x => x.concat('!')

const Fn = run => ({
    run,
    map: f => Fn(x => f(run(x))),
    concat: f => Fn(x => run(x).concat(f.run(x))),
    chain: f => Fn(x => f(run(x)).run(x)),
})

Fn.ask = Fn(x => x)
Fn.of = x => Fn(() => x)

const r = Fn(toUpper).concat(Fn(exclaim)).run('hello')
console.log(r)

const r2 = Fn(toUpper).chain(upper => Fn(y => exclaim(upper))).run('hi')
console.log('r2', r2)

const r3 = Fn.of('hello')
    .map(toUpper)
    .chain(upper => Fn(x => [upper, exclaim(x)]))
    .run('hi')
console.log('r3', r3)

const r4 = Fn.of('hello')
    .map(toUpper)
    .chain(upper => Fn(config => [upper, config]))
console.log('r4', r4.run({ port: 3000 }))

const r5 = Fn.of('hello')
    .map(toUpper)
    .chain(upper => Fn.ask.map(config => [upper, config]))
console.log('r5', r5.run({ port: 3000 }))

const r6 = Fn.of('hello')
    .map(toUpper)
    .chain(upper => Fn(config => exclaim(upper)))
    .chain(ex => Fn.ask.map(config => [ex, config]))
console.log('r6', r6.run({ port: 3000 }))

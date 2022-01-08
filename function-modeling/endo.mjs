

import List from 'crocks/List/index.js'

const toUpper = x => x.toUpperCase()
const exclaim = x => x.concat('!')

const Endo = run => ({
    run,
    concat: other => Endo(x => run(other.run(x)))
})

Endo.empty = () => Endo(x => x)

const res = List.fromArray([toUpper, exclaim])
            .foldMap(Endo, Endo.empty())
            .run('hello')

console.log(res)


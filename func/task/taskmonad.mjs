/**
 * Created by steven on 1/5/22
 */
import Async from 'crocks/Async/index.js'

Async.of(2).map(two => two + 1)

const t1 = Async((rej, res) => res(2))
    .chain(two => Async.of(two + 1))
    .map(three => three * 2)

t1.fork(console.error, console.log)

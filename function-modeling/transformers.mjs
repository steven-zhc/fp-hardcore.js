/**
 * Created by steven on 1/7/22
 */
import isNil      from 'crocks/core/isNil.js'
import Async      from 'crocks/Async/index.js'
import Either     from 'crocks/Either/index.js'
import Logic      from 'crocks/logic/index.js'
import _          from 'lodash'

const { ifElse } = Logic
const { Left, Right } = Either
const { Rejected, Resolved } = Async

const users = [{id: 1, name: 'Brian'}, {id: 2, name: 'Marc'}, {id: 3, name: 'Steven'}]
const following = [{user_id: 1, follow_id: 3}, {user_id: 1, follow_id: 2}, {user_id: 2, follow_id: 1}]

// -> Async(Either(User))
const find = (table, query) =>
    Async.of(ifElse(isNil, Left, Right)(_.find(table, query)))

const app = () =>
    find(users, { id: 1 }) // Async(Either(User))
        .chain(eu =>
            eu.either(Rejected, u => find(following, { follow_id: u.id })),
        )
        .chain(eu =>
            eu.either(Rejected, fo => find(users, { id: fo.user_id })),
        )
        .fork(console.error, eu => eu.either(console.error, console.log))
app()


// (acc, a) -> acc
// (a, acc) -> acc
// a -> acc -> acc
// a -> Endo(acc -> acc)
// Fn(a -> Endo(acc -> acc))
const Reducer = run => ({
    run,
    contramap: f => Reducer((acc, x) => run(acc, f(x))),
})

Reducer(login)
    .contramap(pay => pay.user)
    .concat(Reducer(changePage).contramap(pay => pay.currentPage))
    .run(state, {user: {}, currentPage: {}})

// ----
const Pred = run => ({
	run,
	concat: other => Pred(x => run(x) && other.run(x)),
	contramap: f => Pred(x => run(f(x))),
})

QUnit.test("Ex2: pred", assert => {
	const p = Pred(x => x > 4).contramap(x => x.length).concat(Pred(x => x.startsWith('s')))
	const result = ['scary', 'sally', 'sipped', 'the', 'soup'].filter(p.run)
	assert.deepEqual(result, ["scary", "sally", 'sipped'])
})

// Ex3: 
// =========================
const extension = file => file.name.split('.')[1]

const matchesAny = regex => str =>
    str.match(new RegExp(regex, 'ig'))

const matchesAnyP = pattern => Pred(matchesAny(pattern)) // Pred(str => Bool)

// TODO: rewrite using matchesAnyP. Take advantage of contramap and concat
// const ex3 = file =>
// 	matchesAny('txt|md')(extension(file)) && matchesAny('functional')(file.contents)

const ex3 = file => matchesAnyP('txt|md').contramap(extension)
	.concat(matchesAnyP('functional').contramap(f => f.contents))
	.run(file)


QUnit.test("Ex3", assert => {
	const files = [
		{name: 'blah.dll', contents: '2|38lx8d7ap1,3rjasd8uwenDzvlxcvkc'},
		{name: 'intro.txt', contents: 'Welcome to the functional programming class'},
		{name: 'lesson.md', contents: 'We will learn about monoids!'},
		{name: 'outro.txt', contents: 'Functional programming is a passing fad which you can safely ignore'}
	]

	assert.deepEqual([files[1], files[3]], files.filter(ex3))
})

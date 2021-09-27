import SimpleParser from './index.js'

async function main () {
    const parser = new SimpleParser({
        token: [
            ['int', /\d+/],
            ['add', /\+/],
            ['sub', /-/],
            ['mul', /\*/],
            ['div', /\//],
            ['lb', /\(/],
            ['rb', /\)/]
        ],
        ignore: /[ \t\n]+/
    })
    parser.rule
        .entry('expr2')
            .do()
        .for('value')
            .when('%int').do(([v]) => parseInt(v))
            .when('%lb', 'expr2', '%rb').do(([, v]) => v)
        .for('expr1')
            .sameas('value')
            .when('value')
                .withloop()
                    .when('%mul', 'value').do(([, v]) => v)
                    .when('%div', 'value').do(([, v]) => 1 / v)
                .do(([x, ys]) => ys.reduce((a, b) => a * b, x))
        .for('expr2')
            .sameas('expr1')
            .when('expr1')
                .withloop()
                    .when('%add', 'expr1').do(([, v]) => v)
                    .when('%sub', 'expr1').do(([, v]) => -v)
                .do(([x, ys]) => ys.reduce((a, b) => a + b, x))
    // console.log(JSON.stringify(parser.parseRule, null, 4))
    const data = "2+3+4-5-6"
    console.log(parser.parse(data))
}

main()
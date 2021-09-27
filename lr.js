import SimpleParser from './index.js'

function parser (opt) {
    const parser = new SimpleParser({
        token: [
            ['num', /[+-]?\d+/],
            ['sym', /[A-Z]{3}/],
            ['ge', />=/],
            ['le', /<=/],
            ['gt', />/],
            ['lt', /</],
            ['eq', /==/],
            ['ne', /!=/],
            ['and', /&/],
            ['or', /\|/],
            ['lb', /\(/],
            ['rb', /\)/]
        ],
        ignore: /[ \t\n]+/
    })
    parser.rule
        .entry('expr3')
            .do()
        .for('value')
            .when('%num').do(([v]) => parseInt(v))
            .when('%sym').do(([v]) => opt[v])
            .when('%lb', 'expr2', '%rb').do(([, v]) => v)
        .for('expr1')
            .when('value', '%ge', 'value').do(([x, , y]) => x >= y)
            .when('value', '%le', 'value').do(([x, , y]) => x <= y)
            .when('value', '%gt', 'value').do(([x, , y]) => x > y)
            .when('value', '%lt', 'value').do(([x, , y]) => x < y)
            .when('value', '%eq', 'value').do(([x, , y]) => x == y)
            .when('value', '%ne', 'value').do(([x, , y]) => x != y)
        .for('expr2')
            .sameas('expr1')
            .when('expr1')
                .withloop()
                    .when('%and', 'expr1').do(([, v]) => v)
                .do(([x, ys]) => ys.reduce((a, b) => a && b, x))
        .for('expr3')
            .sameas('expr2')
            .when('expr2')
                .withloop()
                    .when('%or', 'expr2').do(([, v]) => v)
                .do(([x, ys]) => ys.reduce((a, b) => a || b, x))
    return parser
}

async function main () {
    const opt = {
        INT: 3,
        CHR: 5
    }
    const p = parser(opt)
    const data = "INT>=3&CHR<=6"
    console.log(p.parse(data))
}

main()
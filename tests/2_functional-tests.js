const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    cases = [
        { stock: 'AAPL',expected: {"stock":"AAPL","price":200.85,"likes":0}},
        { stock: 'GOOG', like: true ,expected: {"stock":"GOOG","price":172.85,"likes":1}},
        { stock: 'GOOG', like: true, expected: {"stock":"GOOG","price":172.85,"likes":1}},
        { stock: ['AMZN', 'MSFT'], expected: [
            {"stock":"AMZN","price":205.01,"rel_likes":0},
            {"stock":"MSFT","price":460.36,"rel_likes":0}
        ]},
        { stock: ['AAPL', 'GOOG'], like: true, expected: [
            {"stock":"AAPL","price":200.85,"rel_likes":0},
            {"stock":"GOOG","price":172.85,"rel_likes":0}
        ]}
    ];

    cases.forEach(function({ stock, like, expected }) {
        test(`GET /api/stock-prices with stock ${stock}`, function(done) {
            chai.request(server)
                .get('/api/stock-prices/')
                .query({stock, like})
                .end(function(err, res) {
                    assert.equal(res.status, 200);                    
                    assert.deepEqual(res.body.stockData, expected);
                    done();
                });
        });
    });
});


// node.js built-in modules
const assert   = require('assert');

// npm modules
const fixtures = require('haraka-test-fixtures');

// start of tests
//    assert: https://nodejs.org/api/assert.html
//    mocha: http://mochajs.org

beforeEach(function (done) {
    this.plugin = new fixtures.plugin('index');
    done();  // if a test hangs, assure you called done()
});

describe('auth-imap', function () {
    it('loads', function (done) {
        assert.ok(this.plugin);
        done();
    });
});

describe('load_imap_ini', function () {
    it('loads config/auth_imap.ini', function (done) {
        this.plugin.load_imap_ini();
        assert.ok(this.plugin.cfg);
        done();
    });
});

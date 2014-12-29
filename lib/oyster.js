
/**
 * Module Dependencies
 */

var Browser = require('zombie');

/**
 * Oyster "Class"
 */
var Oyster = function() {
  return this;
};

/**
 * Authenticate using Oyster Online Credentials
 * @param  {String}   username
 * @param  {String}   password
 * @param  {Function} callback with signature (err), if !err you are logged in
 */
Oyster.prototype.login = function(username, password, callback) {
  var browser = Browser.create();
  browser.features = 'no-scripts';
  browser.visit('https://account.tfl.gov.uk/oyster', function(err) {
    if (err) return callback(err);
    browser.fill('UserName', username)
      .fill('Password', password).
      pressButton('Sign in', function(err) {
        if (err) return callback(err);
        try {
          browser.assert.text('title', 'Oyster online - Transport for London - Card overview');
        }
        catch(e) {
          return callback(new Error('Wrong credentials.'));
        }
        var body = browser.tabs.current._response.body;
        return callback(null, body.match(/Balance: &#163;([0-9|\.]+)/)[1]);
      });
  });
};

/**
 * Create an Oyster client and optionally login
 * @param  {String}   username optional, follows Oyster.prototype.login
 * @param  {String}   password optional, follows Oyster.prototype.login
 * @param  {Function} callback optional, follows Oyster.prototype.login
 * @return {Oyster}
 */
var createClient = function(username, password, callback) {
  var client = new Oyster();
  if(!username) return client;
  client.login(username, password, callback);
  return client;
};

/**
 * Exports
 */

module.exports = createClient;
module.exports.createClient = createClient;
module.exports.Oyster = Oyster;
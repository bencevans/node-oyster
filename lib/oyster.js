
/**
 * Module Dependencies
 */

var request = require('request');
var cheerio = require('cheerio');

/**
 * Oyster "Class"
 */
var Oyster = function() {
  this.jar = request.jar();
  return this;
};

/**
 * Authenticate using Oyster Online Credentials
 * @param  {String}   username
 * @param  {String}   password
 * @param  {Function} callback with signature (err), if !err you are logged in
 */
Oyster.prototype.login = function(username, password, callback) {
  var oyster = this;
  request.post({
    uri: 'https://account.tfl.gov.uk/Oyster/',
    followRedirect: true,
    headers: {
      'referrer': 'https://oyster.tfl.gov.uk/oyster/entry.do',
      'user-agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.4) Gecko/20030624 Netscape/7.1 (ax)'
    },
    form: {
      ReturnUrl: "https://oyster.tfl.gov.uk/oyster/security_check",
      AppId: "8ead5cf4-4624-4389-b90c-b1fd1937bf1f",
      UserName: username,
      Password: password,
      'Sign In': 'Sign In'
    },
    jar: this.jar
  }, function(err, res, body) {
    if(err) return callback(err);
    console.log(res.headers);
    if(res.headers.location && (res.headers.location.match(/security_check/)))
      return callback();
    return callback(new Error('Wrong Credentials'));
  });
};

Oyster.prototype.balance = function(card, callback) {
  callback = callback || card;
  request({
    uri: 'https://oyster.tfl.gov.uk/oyster/entry.do',
    followRedirect: true,
    headers: {
      'referrer': 'https://oyster.tfl.gov.uk/oyster/entry.do',
      'user-agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.4) Gecko/20030624 Netscape/7.1 (ax)'
    },
    jar: this.jar
  }, function(err, res, body) {
    if(err) return callback(err);
    callback(null, body.match(/Balance: &pound;([0-9|\.]+)/)[1]);
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
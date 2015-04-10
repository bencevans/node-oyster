/**
 * Module Dependencies
 */

var request = require('request')

/**
 * Oyster "Class"
 */
var Oyster = function () {
  this.jar = request.jar()

  this.request = request.defaults({
    followRedirect: true,
    followAllRedirects: true,
    jar: this.jar,
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.4) Gecko/20030624 Netscape/7.1 (ax)'
    }
  })

  return this
}

/**
 * Authenticate using Oyster Online Credentials
 * @param  {String}   username
 * @param  {String}   password
 * @param  {Function} callback with signature (err), if !err you are logged in
 */
Oyster.prototype.login = function (username, password, callback) {
  this.request({
    method: 'POST',
    uri: 'https://account.tfl.gov.uk/Oyster/',
    form: {
      'ReturnUrl': 'https://oyster.tfl.gov.uk/oyster/security_check',
      'AppId': '8ead5cf4-4624-4389-b90c-b1fd1937bf1f',
      'UserName': username,
      'Password': password,
      'Sign in': 'Sign in'
    }
  }, function (err, res) {
    if (err) {
      return callback(err)
    } else if (res.body.match(/Welcome Back,/)) {
      return callback()
    } else if (res.body.match(/Login failed. Please check your username and password and try again/)) {
      return callback(new Error('Wrong Credentials'))
    } else {
      return callback(new Error('Unknown Response: TFL have probably changed their website again'))
    }
  })

}

/**
 * Check balance (requires a successful .login())
 * @param  {Function} Callback with signature (err, balance). balance instanceof Number.
 */
Oyster.prototype.balance = function (callback) {
  this.request('https://oyster.tfl.gov.uk/oyster/oyster/selectCard.do', function (err, res, body) {
    if (err) {
      return callback(err)
    }

    var balanceMatch = body.match(/Balance: &#163;([0-9|\.]+)/)
    var balance

    if (balanceMatch) {
      try {
        balance = parseFloat(balanceMatch[1])
      } catch (e) {
        return callback(e)
      }

      return callback(null, balance)

    } else {
      return callback(new Error('Unknown Response: TFL have probably changed their website again'))
    }
  })

}

/**
 * Create an Oyster client and optionally login
 * @param  {String}   username optional, follows Oyster.prototype.login
 * @param  {String}   password optional, follows Oyster.prototype.login
 * @param  {Function} callback optional, follows Oyster.prototype.login
 * @return {Oyster}
 */
var createClient = function (username, password, callback) {
  var client = new Oyster()
  if (!username) return client
  client.login(username, password, callback)
  return client
}

/**
 * Exports
 */

module.exports = createClient
module.exports.createClient = createClient
module.exports.Oyster = Oyster

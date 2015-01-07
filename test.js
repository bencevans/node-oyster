var Oyster = require('./');

var oyster = Oyster(process.env.USER, process.env.PASS, function(err) {
  if(err) throw err;
  console.log('Logged In');
  oyster.balance(function(err, balance) {
    if(err) throw err;
    console.log('Balance: £' + balance);
  });
});
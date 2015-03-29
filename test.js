var Oyster = require('./');

var cards = [
	"012345678910",
	"123456789101",
	"234567891012"
];

var oyster = Oyster(process.env.USER, process.env.PASS, function(err) {
  if(err) throw err;
  
  console.log('Logged In');
  
  for(var i; i <= cards.length; i++) {
	  oyster.balance(cards[i], function(err, balance) {
	    
	    if(err) throw err;
	    
	    console.log('Balance: £' + balance);
	  });
   }

});
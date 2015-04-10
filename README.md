# node-oyster

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Install

`npm install oyster`

## Usage

```javascript
var Oyster = require('oyster');

var oyster = Oyster('USERNAME', 'PASSWORD', function(err) {
  if(err) throw err;
  console.log('Logged In');
  oyster.balance(function(err, balance) {
    if(err) throw err;
    console.log('Balance: ' + balance);
  });
});
```

## Licence

MIT
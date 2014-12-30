# node-oyster

## Install

`npm install oyster`

## Usage

```javascript
var Oyster = require('oyster');

var oyster = Oyster('USERNAME', 'PASSWORD', function(err, balance) {
  if(err) throw err;
  console.log(balance); // 5.20
});
```

## Licence

MIT
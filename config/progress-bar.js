let progress = require('smooth-progress');
var Rx = require('rxjs/Rx');

 
let bar = progress({
    tmpl: 'Downloading... :bar :percent :eta',
    width: 25,
    total: parseInt(100),
 });

var source = Rx.Observable.from([1, 2, 3, 4, 5]).delay(2000);
source.subscribe(val => {
  bar.tick(25 - 25/ 1);
}, err => {

}, () => {

});

 
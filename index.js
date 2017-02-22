const Utils = require('./utils');
require('dotenv').load();
const startDate = process.env.START_DATE;
const endDate = process.env.END_DATE;
const render = require('./config/render');


if(!startDate && !endDate) {
    console.log("You idiot you missed some dates yo!");
    process.exit(1)
}

let freckle = new Utils(startDate, endDate);
const arr = [];
freckle.logHours()
.subscribe(res => {
    const data = freckle.filterData(res);
    // console.log(data);
    arr.push(data);
    console.log('============================');
}, err => {
    console.log('errr', err);
}, complete => {
    render(arr);
    console.log('done');
    process.exit(0);
});

const Utils = require('./utils');
const startDate = process.env.START_DATE;
const endDate = process.env.END_DATE;


if(!startDate && !endDate) {
    console.log("You idiot you missed some dates yo!");
    process.exit(1)
}

let freckle = new Utils(startDate, endDate);


freckle.logHours()
.then(res => {
    console.log(freckle.filterData(res.data));
})
.catch(error => console.log("something failed"));

const Utils = require('./utils');
const Progress = require('ascii-progress');
require('dotenv').load();
const startDate = process.env.START_DATE;
const endDate = process.env.END_DATE;
const description = process.env.TAG_NAMES;
const projectName = process.env.PROJECT_NAME;
const hours = process.env.HOURS
const render = require('./config/render');

if (!startDate && !endDate) {
  console.log("You idiot you missed some dates yo!");
  process.exit(1)
}

let freckle = new Utils(startDate, endDate, hours, description, projectName);
const arr = [];

const progress = new Progress({
  schema: '[:bar.green] :current/:total :percent :etas',
  clear: true,
  total: freckle.datesArray.length
});

freckle.logHours()
  .subscribe(res => {
    const data = freckle.filterData(res);
    arr.push(data);
    progress.tick()
  }, err => {
    console.log('errr', err);
  }, complete => {
    console.log()
    render(arr);
    process.exit(0);
  });

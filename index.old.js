const axios = require('axios');

/**
 * Load the environment variables
 */

require('dotenv').load();

const freckleUrl = 'https://api.letsfreckle.com/v2';
const freckleToken = process.env.PERSONAL_ACCESS_TOKEN;
console.log(process.env)
  /**
   * [addDays Adds days to the current date]
   * @param {[type]} days [description]
   */

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf())
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * [isWeekend Checks if the date specified is a weekend]
 * @param  {[type]}  date [Date to be checked]
 * @return {Boolean}
 */

function isWeekend(date) {
  let dateVal = date.getDay();
  return (dateVal == 0 || dateVal == 6) ? true : false
}

/**
 * [getDates Gets all the dates within the specified range]
 * @param  {[type]} startDate [date to begin with]
 * @param  {[type]} stopDate  [The last date to end with]
 * @return {[type]}           [description]
 */
function getDates(startDate, stopDate) {
  let dateArray = new Array();
  let currentDate = startDate;

  while (currentDate <= stopDate) {

    if (!isWeekend(currentDate)) {
      dateArray.push(currentDate)
    }
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

let dateArray = getDates(new Date(process.env.START_DATE), new Date(process.env.END_DATE));
console.log(dateArray);
for (let date of dateArray) {
  let logDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let payload = {
    "date": `${logDate}`,
    "minutes": Number(process.env.HOURS) * 60,
    "description": process.env.TAG_NAMES,
    "project_name": process.env.PROJECT_NAME
  };

  /**
   * Make an api request to freckle api
   */
  axios
    .post(`${freckleUrl}/entries?freckle_token=${freckleToken}`, payload)
    .then((res) => {
      console.log(res);
    }).catch((error) => {
      console.log(error);
    });
}

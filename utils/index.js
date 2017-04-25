const axios = require('axios');
const Rx = require('rxjs/Rx');
const Progress = require('progress');
//const ProgressBar = require('../config/progress-bar');
const freckleUrl = 'https://api.letsfreckle.com/v2';
require('dotenv').load();
const freckleToken = process.env.PERSONAL_ACCESS_TOKEN;

/**
 * [addDays Adds days to the current date]
 * @param {[type]} days [description]
 */

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf())
  date.setDate(date.getDate() + days);
  return date;
}

class Utils {
  /**
   * [payload description]
   * @param  {[type]} dateToLogHoursTo [description]
   * @return {[type]}                  [description]
   */
  constructor(startDate, endDate) {
    this.datesArray = this.getDates(new Date(startDate), new Date(endDate));
  }

  payload(dateToLogHoursTo) {
    return {
      "date": `${dateToLogHoursTo}`,
      "minutes": Number(process.env.HOURS) * 60,
      "description": process.env.TAG_NAMES,
      "project_name": process.env.PROJECT_NAME
    };
  }

  parseDate(dateToParse) {
    return `${dateToParse.getFullYear()}-${dateToParse.getMonth() + 1}-${dateToParse.getDate()}`;
  }

  logHours() {
    let promises = [];
    let payloadArray = [];

    for (let date of this.datesArray) {

      let dateTologHoursTo = this.parseDate(date);
      let payloadData = this.payload(dateTologHoursTo);
      payloadArray.push(payloadData);

      /**
       * Make an api request to freckle api
       */
    }
    // observable
    const source = Rx.Observable.from(payloadArray).delay(2000).concatMap(payload => {
      return axios.post(`${freckleUrl}/entries?freckle_token=${freckleToken}`, payload);
    });

    return source;
  }


  filterData(res) {
    // return responseData.map(res => {
    let { id, date, billable, minutes, description, project } = res.data
    return { id, date, billable, minutes, description, project };
    // });
  }

  /**
   * [getDates Gets all the dates within the specified range]
   * @param  {[type]} startDate [date to begin with]
   * @param  {[type]} stopDate  [The last date to end with]
   * @return {[type]}           [description]
   */
  getDates(startDate, stopDate) {
    let dateArray = [];
    let currentDate = startDate;

    while (currentDate <= stopDate) {

      if (!this.isWeekend(currentDate)) {
        dateArray.push(currentDate)
      }

      currentDate = currentDate.addDays(1);
    }

    return dateArray;
  }

  /**
   * [isWeekend Checks if the date specified is a weekend]
   * @param  {[type]}  date [Date to be checked]
   * @return {Boolean}
   */

  isWeekend(date) {
    let dateVal = date.getDay();
    return (dateVal == 0 || dateVal == 6) ? true : false
  }

}

module.exports = Utils;

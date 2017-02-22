const axios = require('axios');
const freckleUrl = 'https://api.letsfreckle.com/v2';
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
    this.datesArray = this.getDates(startDate, endDate);
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
    for (let date of this.dateArray) {

      let dateTologHoursTo = this.parseDate(date);

      let payload = this.payload(dateTologHoursTo);

      /**
       * Make an api request to freckle api
       */
      setTimeout(() => {
        promises
          .push(axios
            .post(`${ freckleUrl }/entries?freckle_token=${ freckleToken }`, payload)
          );
      }, 2000);
    }
    return axios.all(promises);
  }

  filterData(responseData) {
    return responseData.map(res => {
      let { id, date, billable, minutes, description, project } = res.data
      return { id, date, billable, minutes, description, project };
    });
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

const vorpal = require('vorpal')();
const Utils = require('./utils');
const Progress = require('ascii-progress');
const render = require('./config/render');

if (!process.env.PERSONAL_ACCESS_TOKEN) {
  console.log('Environment variable PERSONAL_ACCESS_TOKEN is not set')
  process.exit(1)
}

function hasAllOptions(options, context) {
  let test = (options.project && options.description && options.hours);
  switch (context) {
    case 'today':
      if (test) {
        return true
      }
      return false
    default:
      if (test && options.startDate && options.endDate) {
        return true;
      }
      return false
  }
}

function isValidDate(date) {
  let test = ((/(\d{4}[-]\d{2}[-]\d{2})/ig).test(date) && date.length === 10)
  return test && (new Date(date) !== 'Invalid Date')
}

vorpal
  .command('log <command>', 'Logs Hours to freckle.')
  .option('-p, --project <project>', 'The project to log Hours to')
  .option('-d --description <description>', 'The description of what you did')
  .option('-h, --hours <hours>', 'The number of hours you would like to log')
  .option('-s, --startDate <startDate>', 'The date you would like to log hours from')
  .option('-e, --endDate <endDate>', 'The date you would like to log hours upto')
  .action(function (args, callback) {
    switch (args.command) {
      case 'today':
        if (args.options && hasAllOptions(args.options, args.command)) {
          this.log('logging hours for today ', args.options);
          return callback();
        }
        this.log('missing options for command ' + args.command)
        return callback();
      case 'range':

        if (!args.options || !hasAllOptions(args.options, args.command)) {
          this.log('missing options for command ' + args.command)
          return callback();
        }

        let { startDate, endDate, hours, description, project } = args.options;

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
          this.log(`You have logged Invalid date, this is the allowed format <YYYY-MM-DD>`)
          this.log(`Start Date: ${startDate} is ${isValidDate(startDate) ? '' : 'not'} valid`)
          this.log(`End Date: ${endDate} is ${isValidDate(endDate) ? "" : 'not'} valid`)
          return callback()
        }

        let freckle = new Utils(startDate, endDate, hours, description, project);

        const arr = [];

        const progress = new Progress({
          schema: '[:bar] :current/:total :percent :etas',
          clean: true,
          total: freckle.datesArray.length
        })

        freckle.logHours()
          .subscribe(res => {
            const data = freckle.filterData(res);
            arr.push(data);
            progress.tick()
          }, err => {
            console.log('This is the returned Error:', err.data);
            return callback();
          }, complete => {
            console.log()
            render(arr);
            console.log()
            return callback();
          });
        break;
      default:
        this.log('Unkown command');
        return callback();
    }
  });

vorpal.catch('[words...]', 'Catches incorrect commands')
  .action(function (args, cb) {
    this.log(args.words.join(' ') + ' is not a valid command.');
    cb();
  });

vorpal.delimiter('[ slakezy ]').show();

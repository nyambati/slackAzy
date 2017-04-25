const vorpal = require('vorpal')();
const Utils = require('./utils/freckle');
const { hasAllOptions, isValidDate } = require('./utils/helpers');
const Progress = require('ascii-progress');
const render = require('./config/render');

if (!process.env.PERSONAL_ACCESS_TOKEN) {
  console.log('Environment variable PERSONAL_ACCESS_TOKEN is not set')
  process.exit(1)
}

vorpal
  .command('log <command>', 'Logs Hours to freckle.')
  .option('-p, --project <project>', 'The project to log Hours to')
  .option('-d --description <description>', 'The description of what you did')
  .option('-h, --hours <hours>', 'The number of hours you would like to log')
  .option('-s, --startDate <startDate>', 'The date you would like to log hours from')
  .option('-e, --endDate <endDate>', 'The date you would like to log hours upto')
  .action(function (args, callback) {
    const self = this;
    switch (args.command) {
      case 'today':
        if (args.options && hasAllOptions(args.options, args.command)) {
          self.log('logging hours for today ', args.options);
          return callback();
        }
        self.log('missing options for command ' + args.command)
        return callback();
      case 'range':

        if (!args.options || !hasAllOptions(args.options, args.command)) {
          self.log('missing options for command ' + args.command)
          return callback();
        }

        let { startDate, endDate, hours, description, project } = args.options;

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
          self.log(`You have logged Invalid date, this is the allowed format <YYYY-MM-DD>`)
          self.log(`Start Date: ${startDate} is ${isValidDate(startDate) ? '' : 'not'} valid`)
          self.log(`End Date: ${endDate} is ${isValidDate(endDate) ? "" : 'not'} valid`)
          return callback()
        }

        let freckle = new Utils(startDate, endDate, hours, description, project);

        const arr = [];

        const progress = new Progress({
          schema: '[:bar] :current/:total :percent :etas',
          clean: true,
          total: freckle.datesArray.length
        })

        const onComplete = () => {
          self.log()
          render(arr);
          self.log()
          return callback();
        }

        const onSuccess = (res) => {
          const data = freckle.filterData(res);
          arr.push(data);
          progress.tick()
        }

        const onError = () => {
          self.log('This is the returned Error:', err.data);
          return callback();
        }

        freckle.logHours().subscribe(onSuccess, onError, onComplete);
        break;
      default:
        self.log('Unkown command');
        return callback();
    }
  });

vorpal.catch('[words...]', 'Catches incorrect commands')
  .action(function (args, cb) {
    this.log(args.words.join(' ') + ' is not a valid command.');
    cb();
  });

vorpal.delimiter('[ slakezy ]').show();

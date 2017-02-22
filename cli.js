const vorpal = require('vorpal')();

function hasAllOptions(options, context) {
  let test = (options.project && options.description && options.hours);
  switch (context) {
    case 'today':
      if (test) {
        return true
      }
      return false
    default:
      if (test && options['start-date'] && options['end-date']) {
        return true;
      }
      return false
  }
}

vorpal
  .command('log <command>', 'Logs Hours to freckle.')
  .option('-p, --project <project>', 'The project to log Hours to')
  .option('-d --description <description>', 'The description of what you did')
  .option('-h, --hours <hours>', 'The number of hours you would like to log')
  .option('-s, --start-date <start-date>', 'The date you would like to log hours from')
  .option('-e, --end-date <end-date>', 'The date you would like to log hours upto')
  .action(function(args, callback) {
    switch (args.command) {
      case 'today':

        if (args.options && hasAllOptions(args.options, args.command)) {
          this.log('logging hours for today ', args.options);
          return callback();
        }

        this.log('missing options for command ' + args.command)
        return callback();
      case 'range':
        this.log(args.options);
        if (args.options && hasAllOptions(args.options, args.command)) {
          this.log('logging hours with range ', args.options);
          return callback();
        }

        this.log('missing options for command ' + args.command)
        return callback();
      default:
        this.log('Unkown command');
        return callback();
    }
  });


vorpal
  .catch('[words...]', 'Catches incorrect commands')
  .action(function(args, cb) {
    this.log(args.words.join(' ') + ' is not a valid command.');
    cb();
  });

vorpal
  .delimiter('$')
  .show();

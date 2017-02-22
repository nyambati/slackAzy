const Table = require('cli-table');

module.exports = (logs) => {
  let table = new Table({
    head: [
      'projectName', 'Billable', 'Hours', 'Tags'
    ],
    chars: {
      'top': '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      'bottom': '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      'left': '║',
      'left-mid': '╟',
      'mid': '─',
      'mid-mid': '┼',
      'right': '║',
      'right-mid': '╢',
      'middle': '│'
    },

    style: {
      'padding-left': 0,
      'padding-right': 0
    },
    colWidths: [30, 50, 30, 100]
  });

  for (let log of logs) {

    table.push([
      log.project.name,
      log.billable,
      `${(log.minutes /60)} Hrs`,
      log.description,
      ""
    ]);
  }

  console.log(table.toString());
};

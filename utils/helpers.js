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

module.exports = { hasAllOptions, isValidDate };
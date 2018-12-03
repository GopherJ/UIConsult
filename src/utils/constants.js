exports.exchanged = {
    SENT: Symbol(),
    RECEIVED: Symbol(),
    NONE: Symbol()
};

exports.monthsMap = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12
};

exports.timeUnitMap = {
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    w: 7 * 24 * 60 * 60,
    M: 30 * 24 * 60 * 60,
    y: 365 * 24 * 60 * 60
};

exports.vegaTimeUnits = [
    "yearmonthdatehours", 
    "yearmonthdatehoursminutes",
    "yearmonthdatehoursminutesseconds",
    "quarter", 
    "quartermonth",
    "month", 
    "monthdate",
    "date",
    "day",
    "hours",
    "hoursminutes",
    "hoursminutesseconds",
    "minutes",
    "minutesseconds",
    "seconds",
    "secondsmilliseconds",
    "milliseconds" 
];

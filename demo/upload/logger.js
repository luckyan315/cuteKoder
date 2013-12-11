"use strict";

var slice = Array.prototype.slice;
var unshift = Array.prototype.unshift;

var logger = exports = module.exports = function(level) {
  var args = slice.call(arguments, 1);

  level = logger.levels[level];

  //coloring log
  var prefix =
    '\x1b[' + level[0] + 'm' +
    logger.PREFIX +
    '[' + format_date(new Date(), true) + ']' +
    '\x1b[m ';

  //beautify print format
  prefix = typeof args[0] === 'string' ? prefix : prefix + '\n';

  //push prefix data to front
  unshift.call(args, prefix);

  return console[level[1]].apply(console, args);
};

//foreground
logger.FORE_BLACK = 30;
logger.FORE_RED = 31;
logger.FORE_GREEN = 32;
logger.FORE_YELLOW = 33;
logger.FORE_BLUE = 34;
logger.FORE_MAGENTA = 35;
logger.FORE_CYAN = 36;
logger.FORE_WHITE = 37;

//background
logger.BG_BLACK = 40;
logger.BG_RED = 41;
logger.BG_GREEN = 42;
logger.BG_YELLOW = 43;
logger.BG_BLUE = 44;
logger.BG_MAGENTA = 45;
logger.BG_CYAN = 46;
logger.BG_WHITE = 47;

logger.levels = {
  'info': [logger.FORE_BLUE, 'info'],
  'log': [logger.FORE_GREEN, 'log'],
  'error': [logger.FORE_RED, 'error'],
  'warn': [logger.FORE_YELLOW, 'error']
};

logger.PREFIX = '[BrowserIDE]';

logger.info = function() {
  return logger.apply(null, ['info'].concat(slice.call(arguments)));
};

logger.log = function() {
  return logger.apply(null, ['log'].concat(slice.call(arguments)));
};

logger.warn = function() {
  return logger.apply(null, ['warn'].concat(slice.call(arguments)));
};

logger.error = function() {
  return logger.apply(null, ['error'].concat(slice.call(arguments)));
};


/**
 * date formation
 *
 * @param {String}
 * @return {String}
 * @api public
 */
function format_date(date, isDetail) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (!isDetail) {
    var ms = new Date().getTime() - date.getTime();

    var TIME_SET = [1000, /* 0) 1 second */
                    60 * 1000, /* 1) 1 minute */
                    60 * 60 * 1000, /* 2) 1 hour */
                    24 * 60 * 60 * 1000, /* 3) 1 day */
                    30 * 24 * 60 * 60 * 1000, /* 4) 1 month */
                    12 * 30 * 24 * 60 * 60 * 1000 /* 5) 1 year */
                    // 100 * 12 * 30 * 24 * 60 * 60 * 1000 /* 6) 100 year */
                       ];

    if (ms < TIME_SET[5]) {
      if (ms > 0 && ms < TIME_SET[1]) {
        var elapsed_s = ms / TIME_SET[0];

        if (elapsed_s < 1) {
          return "Just now";
        } else {
          return Math.floor(elapsed_s).toString() + ' seconds ago';
        }

      }

      if (ms > TIME_SET[1] && ms < TIME_SET[2]) {
        return Math.floor(ms / TIME_SET[1]).toString() + ' minutes ago';
      }

      if (ms > TIME_SET[2] && ms < TIME_SET[3]) {
        return Math.floor(ms / TIME_SET[2]).toString() + ' hours ago';
      }

      if (ms > TIME_SET[3] && ms < TIME_SET[4]) {
        return Math.floor(ms / TIME_SET[3]).toString() + ' days ago';
      }

      if (ms > TIME_SET[4]) {
        return Math.floor(ms / TIME_SET[4]).toString() + ' months ago';
      }
    }
  }

  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0' : '') + second;

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};

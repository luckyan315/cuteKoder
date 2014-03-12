/** 
 * bref: util functions
 * date: Sat Dec 14 10:51:33 2013
 * author: angl (lucky315.an@gmail.com)
 */

"use strict";

var fs = require('fs');
var crypto = require('crypto');
var util = require('util');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var path = require('path');
var os = require('os');

var config = require('../../config.js');
var bashrc_path = path.join(config.template.ROOT, config.template.CONFIG);
var ip_config_path = config.ip_config;
var zip_out_dir = config.zip_out_dir;
var isDebugMode = config.debug;
var workspace_dir = config.workspace_dir;

//Crypto relative
exports.md5 = {
  encrypt: encrypt_md5
};

/**
 * util function to encrypt string by md5
 *
 * @param {string} str a string to be encrypted by md5
 * @return {String}
 */
function encrypt_md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * merge s(source) to d(dest)
 *
 * @param {Object} d dest object
 * @param {Object} s source object
 * @return {Object} merged object
 */
exports.merge = function(d, s) {
  for (var prop in s) {
    d[prop] = s[prop];
  }
  return d;
};

/**
 * go through dir path once
 *
 * @param {string} path  Dir path to walk
 * @param {Object} opt   the option obj, the desc of prop as follow:
 *                       recursive [bool]  whether -R walk through  the dir.
 *
 * @param {function} cb   as find a file , will trigger the callback
 * @param {function} over triggered while complete
 */
exports.walk = function(path, opt, cb, over) {
  //default option
  var OPTION_DEFAULT = {
    recursive: true
  };

  opt = exports.merge(OPTION_DEFAULT, opt);
  var nLeft = 1;

  go(path, cb);

  function go(path, cb) {
    fs.readdir(path, function(err, files) {
      nLeft--;
      if (err) {
        return cb(err);
      }

      files.forEach(function(file) {
        if (file[0] !== '.') {
          nLeft++;
          var fullPath = path + '/' + file;

          fs.stat(fullPath, function(err, stats) {
            if (err) {
              nLeft--;
              return cb(err);
            }

            if (stats.isDirectory(fullPath)) {
              var isDir = true;
              cb(null, fullPath, isDir);

              if (opt.recursive === true) {
                go(fullPath, cb);
              } else {
                nLeft--;

                if (!nLeft) {
                  over();
                }
              }
            } else {
              nLeft--;
              cb(null, fullPath);

              if (!nLeft) {
                over();
              }
            }
          });
        }

      });

      //if empty dir
      if (!nLeft) {
        over();
      }

    });
  }
};

/**
 * the same as 'mkdir -p'
 *
 * @param {string} aPath array path to make dir
 * @param {int} mode e.g. 0666
 * @param {function} cb callback function
 */
exports.mkdir = function(aPath, mode, cb) {
  var dirs = aPath.split('/');
  var path = '';

  dirs.forEach(function(s) {
    path += (s + '/');
    try {
      fs.mkdirSync(path, mode);
      cb(null);
    } catch (e) {
      cb(e);
    }
  });
};

/**
 * date formation
 *
 * @param {String}
 * @return {String}
 * @api public
 */
exports.format_date = function(date, isDetail) {
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

exports.formalize = function(str) {
  //stringify...
  if (typeof str === 'object' && str !== null && str.toString) {
    str = str.toString();
  }

  str = str === null ? '' : str + '';

  //remove extra blanks
  str = str.trim();

  return str.split(' ')[0];
};

exports.isAlphanumeric = function(str) {
  str = exports.formalize(str);
  return str.match(/^[0-9a-z]+$/i);
};


exports.addSystemUser = function(username, passwd, cb) {
  var logger = require('./log.js');
  var workspace_dir = require('../../config.js').workspace_dir;

  if (!username || !passwd || !cb) {
    throw TypeError('Param Error: username or passwd is empty');
  }

  var mkpasswd = spawn('mkpasswd', ['-m', 'des', passwd]);

  mkpasswd.stdout.on('data', function(encrypt_pw) {
    //remoev '\n'
    encrypt_pw = encrypt_pw.toString().split('\n')[0];

    var home_dir = workspace_dir + '/' + username;
    var mk_home = ['mkdir', home_dir].join(' ');
    var add_user = ['useradd', '-mp', encrypt_pw, '-d', home_dir, '-s', '/bin/bash', username].join(' ');

    var cmd = mk_home;

    fs.stat(home_dir, function(err, stats) {
      if (err) {
        logger.warn(err);

        return doAddSystemUser(add_user, function(err, data) {
          if (err) {
            logger.error(err);
            return cb(err);
          }

          configUserEnv(home_dir, function(err, data) {
            if (err) {
              logger.error(err);
              return cb(err);
            }

            return cb(null, data);
          })
        });
      }

      doAddSystemUser(add_user, cb);
    });

  }); /* end of mkpasswd.stdout */

  mkpasswd.stderr.on('data', function(data) {
    logger.error('mkpassword occur error!', data);
  });
};

//get main network interface
exports.getNic = function(cb) {
  if (!cb) {
    throw TypeError('callback function is empty!');
  }

  var nics = os.networkInterfaces();

  var nic_config = exports.getNicConfig();
  var bFind = false;

  Object.keys(nics).forEach(function(nic_name) {
    //except loop back addr
    if (!nic_name.match(/^lo\d?$/)) {
      bFind = true;
      return cb(nic_name, nic_config);
    }
  });

  if (!bFind) {
    return cb('eth0', nic_config);
  }
};

//private functions

exports.getNicConfig = function() {
  var content = fs.readFileSync(ip_config_path, 'utf8');
  var lines = content.split('\n');
  var nic = {
    name: '',
    address: '',
    netmask: '',
    gateway: '',
    main_dns: '',
    sub_dns: ''
  };
  var tmp = {};
  var attr;
  console.log('[lines]', lines);
  lines.forEach(function(line) {
    //unify all blank

    attr = line.replace(/\s+/g, ' ').split(' ');
    console.log('[attr]', attr);
    if (attr[0]) {

      switch (attr[0].trim()) {
        case 'address':
          tmp['address'] = attr[1] ? attr[1] : '';
          break;
        case 'netmask':
          tmp['netmask'] = attr[1] ? attr[1] : '';
          break;
        case 'gateway':
          tmp['gateway'] = attr[1] ? attr[1] : '';
          break;
        case 'dns-nameservers':
          tmp['main_dns'] = attr[1] ? attr[1] : '';
          tmp['sub_dns'] = attr[2] ? attr[2] : '';
          break;
      }
    }
  });

  exports.merge(nic, tmp);

  return nic;
};

exports.checkValidIp = function(ip) {
  if (!ip) {
    throw TypeError('IP is undefined!');
  }

  return ip.match(/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/);
};

exports.checkSystemAccount = function(username, cb) {

  exec('cat /etc/passwd | awk -F: \'{ print $1 }\'', function(error, stdout, stderr) {
    if (error) {
      return cb(error);
    }

    var content = stdout;
    var users = [];
    var isFind = false;

    if (content) {
      users = content.split('\n');
      if (isDebugMode) {
        require('./log.js').log('list linux users:', users);
      }

      users.forEach(function(user) {
        if (user === username) {
          isFind = true;
        }
      });

      if (isFind) {
        return cb('The user already existed in linux system!');
      }
    }

    return cb(null, 'The username is available!');
  });
};

exports.getUid = function(username, cb) {
  exec('id -u ' + username, function(error, stdout, stderr) {
    if (error) {
      return cb(error);
    }

    var uid = stdout;
    var gid = stdout; //set uid as a default value
    exec('id -g ' + username, function(error, stdout) {
      if (error) {
        return cb();
      }

      gid = stdout;

      try {
        uid = parseInt(uid, 10);
        gid = parseInt(gid, 10);
      } catch (e) {
        return cb(e);
      }

      return cb(null, uid, gid);
    });
  });
};

exports.getUserHome = function(username) {
  return workspace_dir + '/' + username;

};

exports.inherits = function(ctor, superCtor){
  function f(){
    this.constructor = ctor;
  }

  f.prototype = superCtor.prototype;
  ctor.prototype = new f();
};

function doMakeHome(mk_home_cmd, callback) {
  exec(mk_home_cmd,
    function(error, stdout, stderr) {
      if (error !== null) {
        // logger.error('exec error: ' + error);
        return callback(error);
      }

      callback(null, 'do make home success!');
    });
}

function doAddSystemUser(add_user_cmd, callback) {
  exec(add_user_cmd,
    function(error, stdout, stderr) {
      if (error !== null) {
        // logger.error('exec error: ' + error);
        return callback(error);
      }

      callback(null, 'add system user success!');
    });
}

function configUserEnv(user_path, callback) {
  //cp .bashrc to home dir
  var cp_bashrc = ['cp', bashrc_path, user_path].join(' ');

  exec(cp_bashrc, function(error, stdout, stderr) {
    if (error) {
      return callback(error);
    }

    //create zip_out_dir
    var mk_zip_out = ['mkdir', user_path + '/' + zip_out_dir].join(' ');

    exec(mk_zip_out, function(error, stdout, stderr) {
      if (error) {
        return callback(error);
      }

      return callback(null, 'config user_home dir success!');
    })
  });
};


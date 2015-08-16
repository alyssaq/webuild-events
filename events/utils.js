'use strict';

var Promise = require('promise');
var htmlStrip = require('striptags');
var moment = require('moment-timezone');

function waitAllPromises(arr) {
  return new Promise(function(resolve, reject) {
    var numResolved = 0;
    var numErrors = 0;

    if (arr.length === 0) {
      return resolve([]);
    }

    function save(i, val) {
      arr[ i ] = val
      if (numErrors === arr.length) {
        reject(arr[ 0 ].error);
      } else if (++numResolved === arr.length) {
        resolve(arr);
      }
    }

    arr.forEach(function(item, i) {
      item.then(function(val) {
        save(i, val);
      }).catch(function(err) {
        ++numErrors;
        save(i, {
          'error': err
        }); // resolve errors
      });
    });
  });
}

function htmlStripWrapper(str) {
  if (!str) {
    return '';
  }
  return htmlStrip(str);
}

function localTime(time, localZone) {
  return moment.utc(time).utcOffset(localZone);
}

function formatLocalTime(time, localZone, displayTimeformat) {
  return moment.utc(time).utcOffset(localZone).format(displayTimeformat);
}

module.exports = {
  waitAllPromises: waitAllPromises,
  htmlStrip: htmlStripWrapper,
  localTime: localTime,
  formatLocalTime: formatLocalTime
};

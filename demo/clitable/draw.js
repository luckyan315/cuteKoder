#!/usr/bin/env node
var Table = require('cli-table');

var table = new Table({
  head: ['No.', 'Name'],
  colWidths: [24, 24] // pixel data per col
});

table.push([1, 'angl'],[2, 'hana214']);

console.log(table.toString());
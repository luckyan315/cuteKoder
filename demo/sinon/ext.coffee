util = require('util')
EventEmitter = require('events').EventEmitter

Ext = exports = module.exports = (@name) ->
  EventEmitter.call(@)

util.inherits Ext, EventEmitter

Ext::test = () ->
  console.log 'It is test print...'



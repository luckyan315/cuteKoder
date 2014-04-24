util = require('util')
EventEmitter = require('events').EventEmitter

Ext = exports = module.exports = (@name) ->
  EventEmitter.call(@)

util.inherits Ext, EventEmitter

Ext::test = () ->
  console.log 'It is test print...'

Ext::fakeSearch = (uuid, cb) ->
  console.log 'Do some .....Fake Search DB.....'
  @.realSearch uuid, cb

Ext::realSearch = (uuid, cb) ->
  console.log 'Do some ....Real Search DB'

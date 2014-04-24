sinon = require('sinon')
should = require('should')
Ext = require('../ext')
assert = require('assert')

describe 'Ext on/emit api', ->
  it 'cb should be called', (done) ->
    ext = new Ext()
    mock_cb = sinon.spy()
    
    evt_name = 'emit_msg'
    ext.on evt_name, mock_cb
    ext.emit evt_name, 'hi angl'

    assert(mock_cb.called)
    done()


# Ext = require('./ext')

# ext = new Ext()

# # ext.emit('event1')

# ext.on 'msg', (data) ->
#   console.log "> #{data}"

# ext.emit 'msg', 'hi angl'


sinon = require('sinon')
should = require('should')
Ext = require('../ext')
assert = require('assert')

ext = null

describe 'Ext Mocha Test', ->
  before ->
    ext = new Ext

  describe 'Ext on/emit api', ->
    it 'cb should be called', (done) ->
      mock_cb = sinon.spy()

      evt_name = 'emit_msg'
      ext.on evt_name, mock_cb
      ext.emit evt_name, 'hi angl'

      assert(mock_cb.called)
      done()

  describe 'Ext fake search ', ->
    it 'should return person info when search via valid id', () ->
      mock_real_search = sinon.spy(ext, 'realSearch');

      mock_uuid = 'wkrldi'

      ext.fakeSearch(mock_uuid, ->
        console.log 'serach done'
      )
      
      assert(mock_real_search.calledOnce)
      # assert(mock_search_db.calledWith(mock_uuid))  




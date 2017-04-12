# test/fraud-detection-test.coffee
# Copyright 2017 9165584 Canada Corporation <legal@fuzzy.ai>

util = require 'util'

vows = require 'perjury'
assert = vows.assert
request = require 'request'

process.on 'uncaughtException', (err) ->
  console.error err

vows
  .describe('lemonade stand')
  .addBatch
    'When we load the module':
      topic: ->
        callback = @callback
        try
          FraudDetectionServer = require '../lib/fraud-detection-server'
          callback null, FraudDetectionServer
        catch err
          callback err
        undefined
      'it works': (err, FraudDetectionServer) ->
        assert.ifError err
      'it is a class': (err, FraudDetectionServer) ->
        assert.ifError err
        assert.isFunction FraudDetectionServer
      'and we instantiate a FraudDetectionServer':
        topic: (FraudDetectionServer) ->
          callback = @callback
          try
            env =
              PORT: "2342"
              HOST: "localhost"
              DRIVER: "memory"
              API_KEY: "unit-test-key"
            server = new FraudDetectionServer env
            callback null, server
          catch err
            callback err
          undefined
        'it works': (err, server) ->
          assert.ifError err
        'it is an object': (err, server) ->
          assert.ifError err
          assert.isObject server
        'it has a start() method': (err, server) ->
          assert.ifError err
          assert.isObject server
          assert.isFunction server.start
        'it has a stop() method': (err, server) ->
          assert.ifError err
          assert.isObject server
          assert.isFunction server.stop
        'and we start the server':
          topic: (server) ->
            callback = @callback
            server.start (err) ->
              if err
                callback err
              else
                callback null
            undefined
          'it works': (err) ->
            assert.ifError err
          'and we request the version':
            topic: ->
              callback = @callback
              url = 'http://localhost:2342/version'
              request.get url, (err, response, body) ->
                if err
                  callback err
                else if response.statusCode != 200
                  callback new Error("Bad status code #{response.statusCode}")
                else
                  body = JSON.parse body
                  callback null, body
              undefined
            'it works': (err, version) ->
              assert.ifError err
            'it looks correct': (err, version) ->
              assert.ifError err
              assert.include version, "version"
              assert.include version, "name"
            'and we stop the server':
              topic: (version, server) ->
                callback = @callback
                server.stop (err) ->
                  if err
                    callback err
                  else
                    callback null
                undefined
              'it works': (err) ->
                assert.ifError err
              'and we request the version':
                topic: ->
                  callback = @callback
                  url = 'http://localhost:2342/version'
                  request.get url, (err, response, body) ->
                    if err
                      callback null
                    else
                      callback new Error("Unexpected success after server stop")
                  undefined
                'it fails correctly': (err) ->
                  assert.ifError err
  .export(module)

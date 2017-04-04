# main.coffee
# Copyright 2017 9165584 Canada Corporation <legal@fuzzy.ai>

FraudDetectionServer = require './fraud-detection-server'

server = new FraudDetectionServer process.env

server.start (err) ->
  if err
    console.error(err)
  else
    console.log "Server listening on #{server.config.port}"

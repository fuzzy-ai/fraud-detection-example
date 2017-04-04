# fraud-detection-server.coffee
# Copyright 2017 9165584 Canada Corporation <legal@fuzzy.ai>

_ = require 'lodash'
express = require 'express'
APIClient = require 'fuzzy.ai'
Microservice = require 'fuzzy.ai-microservice'
path = require 'path'

agent = require './agent'

class FraudDetectionServer extends Microservice

  getName: ->
    "fraud-detection-server"

  environmentToConfig: (env) ->
    config = super env
    _.extend config,
      apiServer: env['API_SERVER'] || 'https://api.fuzzy.ai'
      apiKey: env['API_KEY']
      agentID: env['AGENT_ID']
    config

  setupMiddleware: (exp) ->
    exp.apiClient = new APIClient
      root: @config.apiServer
      key: @config.apiKey
    if process.env.NODE_ENV == 'development'
      webpack = require('webpack')
      webpackConfig = require '../webpack.config'
      webpackConfig.entry.unshift('webpack-hot-middleware/client?reload=true')
      webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
      compiler = webpack(webpackConfig)

      exp.use require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
      })
      exp.use(require('webpack-hot-middleware')(compiler))

    exp.use express.static path.join(__dirname, '..', 'public')

  setupParams: (exp) ->
    exp.param 'evaluationID', @evaluationID

  setupRoutes: (exp) ->
    exp.post '/data/evaluate', @_evaluate
    exp.post '/data/feedback/:evaluationID', @_feedback

  startDatabase: (callback) ->
    callback null

  stopDatabase: (callback) ->
    callback null

  startCustom: (callback) ->
    client = @express.apiClient

    # Make sure we have the proper agent.
    if @config.agentID
      client.putAgent @config.agentID, agent, (err, agent) ->
        if err
          callback err
        else
          callback null
    else
      callback null

  evaluationID: (req, res, next, id) ->
    req.evaluationID = id
    next()

  _evaluate: (req, res, next) ->
    client = req.app.apiClient
    config = req.app.config

    client.evaluate config.agentID, req.body, true, (err, evaluation) ->
      if err
        next err
      else
        res.json
          status: 'OK'
          evaluation: evaluation

  _feedback: (req, res, next) ->
    client = req.app.apiClient
    client.feedback req.evaluationID, req.body, (err, feedback) ->
      if err
        next err
      res.json
        status: 'OK'
        feedback: feedback

module.exports = FraudDetectionServer
